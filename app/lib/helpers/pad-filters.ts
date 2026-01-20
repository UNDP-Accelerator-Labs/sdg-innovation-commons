/**
 * Build comprehensive pad filters for queries
 * This is a reusable function used across multiple API endpoints (tags, countries, etc.)
 * to ensure consistent filtering logic
 * 
 * Supports both authenticated (with session/token) and unauthenticated access
 */

import { loadExternDb, mapPlatformsToShortkeys } from '../utils/platform';
import { safeArr } from '../utils/array';
import { query as dbQuery } from '@/app/lib/db';

const DEFAULT_UUID = '00000000-0000-0000-0000-000000000000';

export interface PadFilterParams {
  // Filter parameters
  space?: string;
  search?: string;
  templates?: string | string[];
  platform?: string | string[];
  mobilizations?: string | string[];
  thematic_areas?: string | string[];
  sdgs?: string | string[];
  countries?: string | string[];
  regions?: string | string[];
  status?: number | string;
  contributors?: string | string[];
  pads?: string | string[];
  teams?: string | string[];
  pinboard?: string | string[];
  section?: string | number;
  
  // Session/Auth parameters (from user session or access token)
  uuid?: string;  // User UUID
  rights?: number;  // User rights level (0-4)
  collaborators?: string[];  // Team member UUIDs
  isPublic?: boolean;  // Is this a public (unauthenticated) request
  isUNDP?: boolean;  // Is user a UNDP member (email ends with @undp.org)
}

/**
 * Separate values into positive (no prefix) and negative (starts with '-')
 */
function separateFilters(values: string | string[]): { positive: string[]; negative: string[] } {
  const arr = Array.isArray(values) ? values : [values];
  const positive = arr.filter(d => !d.toString().startsWith('-'));
  const negative = arr.filter(d => d.toString().startsWith('-')).map(d => d.toString().substring(1));
  return { positive, negative };
}

/**
 * Build SQL WHERE clause for filtering pads
 * @param params - Filter parameters
 * @returns SQL WHERE clause string (without leading WHERE or AND)
 */
export async function buildPadFilters(params: PadFilterParams): Promise<string> {
  const padFilters: string[] = [];
  
  // Extract session/auth info with defaults
  const uuid = params.uuid || '00000000-0000-0000-0000-000000000000';
  const rights = params.rights ?? 0;
  const collaborators = params.collaborators || [];
  // Use provided isPublic value, or infer from uuid if not provided
  const isPublic = params.isPublic ?? (uuid === '00000000-0000-0000-0000-000000000000');
  const isUNDP = params.isUNDP ?? false;

  // Space-based filtering (matches Node.JS filter.js logic)
  const space = params.space || 'all';
  
  if (space === 'private' && !isPublic) {
    // Private space: owned by user OR shared with user (as team member)
    if (collaborators.length > 0) {
      padFilters.push(`(p.owner = '${uuid}' OR p.owner IN (${collaborators.map(c => `'${c}'`).join(', ')}))`);
    } else {
      padFilters.push(`p.owner = '${uuid}'`);
    }
  } else if (space === 'curated' && !isPublic) {
    // Curated space: reviewing OR admin rights
    padFilters.push(`(p.id IN (SELECT review FROM reviews WHERE reviewer = '${uuid}') OR ${rights} >= 3)`);
  } else if (space === 'shared' && !isPublic) {
    // Shared space: owned by team members (excluding user themselves)
    if (collaborators.length > 0) {
      const collaboratorsWithoutUser = collaborators.filter(c => c !== uuid);
      if (collaboratorsWithoutUser.length > 0) {
        padFilters.push(`p.owner IN (${collaboratorsWithoutUser.map(c => `'${c}'`).join(', ')})`);
      } else {
        padFilters.push('FALSE'); // No collaborators besides user
      }
    } else {
      padFilters.push('FALSE'); // No team members
    }
  } else if (space === 'reviewing' && !isPublic) {
    // Reviewing space: pads under review by this user
    padFilters.push(`p.id IN (SELECT review FROM reviews WHERE reviewer = '${uuid}')`);
  } else if (space === 'pinned' && !isPublic) {
    // Pinned space: in user's pinboards (pads don't have a pinned column)
    // Note: pinboard filter is applied universally below, so only handle the case where no specific pinboard is provided
    if (!params.pinboard) {
      // If no specific pinboard, get pads from all user's pinboards
      padFilters.push(`p.id IN (SELECT pad FROM pinboard_contributions WHERE pinboard IN (SELECT id FROM pinboards WHERE owner = '${uuid}'))`);
    }
  } else if (space === 'published') {
    // Published space: status >= 3 (published pads only)
    padFilters.push('p.status >= 3');
  } else if (space === 'public') {
    // Public space: status = 3 (exactly public, not private/curated)
    padFilters.push('p.status = 3');
  }
  // For 'all' space with authenticated user: apply complex visibility logic
  else if (space === 'all' && !isPublic) {
    // All accessible pads: public (3+) OR owned by user OR shared with team OR reviewing OR admin
    const visibilityConditions = ['p.status >= 3']; // Public pads
    visibilityConditions.push(`p.owner = '${uuid}'`); // Owned by user
    
    if (collaborators.length > 0) {
      visibilityConditions.push(`p.owner IN (${collaborators.map(c => `'${c}'`).join(', ')})`); // Team pads
    }
    
    visibilityConditions.push(`p.id IN (SELECT review FROM reviews WHERE reviewer = '${uuid}')`); // Reviewing
    
    if (rights >= 3) {
      // Admin can see all pads (status >= 0)
      visibilityConditions.push('p.status >= 0');
    }
    
    padFilters.push(`(${visibilityConditions.join(' OR ')})`);
  }
  // For 'all' space without auth OR unauthenticated: only public pads
  else if ((space === 'all' || !space) && isPublic) {
    padFilters.push('p.status >= 3');
  }
  // No space provided and authenticated: default to 'all' authenticated behavior
  else if (!space && !isPublic) {
    const visibilityConditions = ['p.status >= 3']; // Public pads
    visibilityConditions.push(`p.owner = '${uuid}'`); // Owned by user
    
    if (collaborators.length > 0) {
      visibilityConditions.push(`p.owner IN (${collaborators.map(c => `'${c}'`).join(', ')})`); // Team pads
    }
    
    visibilityConditions.push(`p.id IN (SELECT review FROM reviews WHERE reviewer = '${uuid}')`); // Reviewing
    
    if (rights >= 3) {
      // Admin can see all pads (status >= 0)
      visibilityConditions.push('p.status >= 0');
    }
    
    padFilters.push(`(${visibilityConditions.join(' OR ')})`);
  }

  // Exclude pads that are under review (unless user is reviewing them)
  if (!isPublic) {
    padFilters.push(`(p.id NOT IN (SELECT review FROM reviews) OR p.id IN (SELECT review FROM reviews WHERE reviewer = '${uuid}'))`);
  } else {
    padFilters.push(`p.id NOT IN (SELECT review FROM reviews)`);
  }

  // Pinboard filter (independent of space - filter to specific pinboard(s))
  if (params.pinboard) {
    const pinboards = Array.isArray(params.pinboard) ? params.pinboard : [params.pinboard];
    padFilters.push(`p.id IN (SELECT pad FROM pinboard_contributions WHERE pinboard IN (${pinboards.map(id => `${id}`).join(', ')}))`);
  }

  // Section filter (for multi-section pads)
  if (params.section !== undefined) {
    padFilters.push(`p.sections @> '[${params.section}]'::jsonb`);
  }

  // Status filter (explicit)
  if (params.status !== undefined) {
    const statusNum = typeof params.status === 'string' ? parseInt(params.status) : params.status;
    padFilters.push(`p.status = ${statusNum}`);
  }

  // Search filter (using regex like Node.js version)
  if (params.search) {
    // Escape regex special characters but preserve user intent
    const escapedSearch = params.search.replace(/[\\]/g, '\\\\').replace(/'/g, "''");
    // Use regex match ~* (case-insensitive) like Node.JS
    padFilters.push(`p.full_text ~* '${escapedSearch}'`);
  }

  // Templates filter (supports negative filters with '-' prefix)
  if (params.templates) {
    const { positive, negative } = separateFilters(params.templates);
    if (positive.length > 0) {
      padFilters.push(`p.template IN (${positive.join(', ')})`);
    }
    if (negative.length > 0) {
      padFilters.push(`(p.template NOT IN (${negative.join(', ')}) OR p.template IS NULL)`);
    }
  }

  // Contributors filter
  if (params.contributors) {
    const contributorsArr = Array.isArray(params.contributors) ? params.contributors : [params.contributors];
    if (contributorsArr.length > 0) {
      padFilters.push(`p.owner IN (${contributorsArr.map(c => `'${c}'`).join(', ')})`);
    }
  }

  // Pads filter (specific pad IDs)
  if (params.pads) {
    const padsArr = Array.isArray(params.pads) ? params.pads : [params.pads];
    if (padsArr.length > 0) {
      padFilters.push(`p.id IN (${padsArr.join(', ')})`);
    }
  }

  // Platform filter
  if (params.platform) {
    const platformArr = Array.isArray(params.platform) ? params.platform : [params.platform];
    const platformShortkeys = mapPlatformsToShortkeys(platformArr);
    const externDbMap = await loadExternDb();
    const platformIds = platformShortkeys
      .map((shortkey: string) => externDbMap.get(String(shortkey).toLowerCase()))
      .filter((id): id is number => id !== undefined);
    // if (platformIds.length > 0) {
    //   padFilters.push(`p.ordb IN (${platformIds.join(', ')})`);
    // }
  }

  // Countries filter (supports negative filters)
  if (params.countries) {
    const { positive, negative } = separateFilters(params.countries);
    if (positive.length > 0) {
      padFilters.push(`p.id IN (SELECT pad FROM locations WHERE iso3 IN (${positive.map(c => `'${c}'`).join(', ')}))`);
    }
    if (negative.length > 0) {
      padFilters.push(`p.id NOT IN (SELECT pad FROM locations WHERE iso3 IN (${negative.map(c => `'${c}'`).join(', ')}))`);
    }
  }

  // Regions filter (supports negative filters)
  if (params.regions) {
    const { positive, negative } = separateFilters(params.regions);
    
    if (positive.length > 0) {
      padFilters.push(`p.id IN (
        SELECT DISTINCT l.pad 
        FROM locations l
        INNER JOIN adm0_subunits a ON a.su_a3 = l.iso3 OR a.adm0_a3 = l.iso3
        WHERE a.undp_bureau IN (${positive.map(r => `'${r}'`).join(', ')})
      )`);
    }
    if (negative.length > 0) {
      padFilters.push(`p.id NOT IN (
        SELECT DISTINCT l.pad 
        FROM locations l
        INNER JOIN adm0_subunits a ON a.su_a3 = l.iso3 OR a.adm0_a3 = l.iso3
        WHERE a.undp_bureau IN (${negative.map(r => `'${r}'`).join(', ')})
      )`);
    }
  }

  // Teams filter (query team_members table)
  if (params.teams) {
    const teamsArr = Array.isArray(params.teams) ? params.teams : [params.teams];
    if (teamsArr.length > 0) {
      padFilters.push(`p.owner IN (SELECT member FROM team_members WHERE team IN (${teamsArr.map(t => `'${t}'`).join(', ')}))`);
    }
  }

  // Mobilizations filter (supports negative filters)
  if (params.mobilizations) {
    const { positive, negative } = separateFilters(params.mobilizations);
    
    if (positive.length > 0) {
      padFilters.push(`p.id IN (SELECT pad FROM mobilization_contributions WHERE mobilization IN (${positive.map(m => `'${m}'`).join(', ')}))`);
    }
    if (negative.length > 0) {
      padFilters.push(`p.id NOT IN (SELECT pad FROM mobilization_contributions WHERE mobilization IN (${negative.map(m => `'${m}'`).join(', ')}))`);
    }
  }

  // Thematic areas filter
  if (params.thematic_areas) {
    const thematicArr = Array.isArray(params.thematic_areas) ? params.thematic_areas : [params.thematic_areas];
    if (thematicArr.length > 0) {
      padFilters.push(`p.id IN (SELECT pad FROM tagging WHERE type = 'thematic_areas' AND tag_id IN (${thematicArr.join(', ')}))`);
    }
  }

  // SDGs filter
  if (params.sdgs) {
    const sdgsArr = Array.isArray(params.sdgs) ? params.sdgs : [params.sdgs];
    if (sdgsArr.length > 0) {
      padFilters.push(`p.id IN (SELECT pad FROM tagging WHERE type = 'sdgs' AND tag_id IN (${sdgsArr.join(', ')}))`);
    }
  }

  return padFilters.join(' AND ');
}

/**
 * Build complete pad subquery for use in other queries
 * @param params - Filter parameters
 * @returns SQL subquery string
 */
export async function buildPadSubquery(params: PadFilterParams): Promise<string> {
  const filters = await buildPadFilters(params);
  return `SELECT p.id FROM pads p WHERE ${filters}`;
}
