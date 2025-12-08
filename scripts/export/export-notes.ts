/**
 * Export notes and documentation generation
 */

/**
 * Build comprehensive export notes with usage guidance and privacy information
 */
export function buildExportNotes(job: any, dbKeys: string[], excludePii = false): string {
  const lines: string[] = [];
  lines.push('Export report');
  lines.push('==============');
  lines.push(`Databases: ${dbKeys.join(', ')}`);
  lines.push(`Format: ${String(job.format || 'csv').toUpperCase()}`);
  lines.push('');

  // Canonical descriptions taken from the site pages
  const seeText = "Explore our notes on solutions to SDG priorities and problems mapped around the world.";
  const testText = "Discover wicked development challenges we are curious about and the experiments conducted to learn what works and what doesn't in sustainable development.";
  const learnText = "Explore our curated collection of blogs and publications that foster collaboration, innovation, and continuous learning within the Accelerator Lab networks.";

  lines.push('What we see (solutions):');
  lines.push(`- ${seeText}`);
  lines.push('');
  lines.push('What we test (experiments, learning plans):');
  lines.push(`- ${testText}`);
  lines.push('');
  lines.push('What we learn (blogs):');
  lines.push(`- ${learnText}`);
  lines.push('');

  lines.push('Enrichments applied:');
  lines.push('- Contributor/owner lookups: when a contributor/owner UUID is present we try to resolve name, email and iso3 from the central `users` table (general DB).');
  lines.push('- Country names: iso3 codes are mapped to adm0 names when a matching table exists in the general DB.');
  lines.push('');
  lines.push('Privacy note:');
  if (excludePii) {
    lines.push('- Personal data (names, emails) has been excluded from this export as requested. Only UUIDs and country information are included.');
  } else {
    lines.push('- The export includes personal data (names, emails) resolved from user UUIDs when available. Ensure you store and share this file in accordance with data protection rules.');
  }
  if (job.exclude_owner_uuid) {
    lines.push('- Owner UUIDs have been excluded from this export as requested.');
  }
  if (Array.isArray(job.statuses) && job.statuses.length) {
    lines.push(`- Only pads with the following statuses are included: ${job.statuses.join(', ')}.`);
  }
  lines.push('');
  lines.push('Data elements & usage:');
  lines.push('- id / pad_id: internal identifier for the record. Use for cross-referencing with the application DB.');
  lines.push('- owner_uuid / contributor_uuid: user UUIDs (redacted when exclude_owner_uuid=true). Use to join back to user records when available.');
  lines.push('- owner_name / contributor_name: resolved display name from the users table (omitted when exclude_pii=true).');
  lines.push('- owner_email / contributor_email: resolved email (omitted when exclude_pii=true).');
  lines.push('- owner_country / contributor_country: resolved country name from iso3 (treated as PII and omitted when exclude_pii=true).');
  lines.push('- full_text / sections: content and structured sections from the pad/article. Note: when metadata is disabled (no tags/locations/metafields/engagement/comments requested) sections may be omitted.');
  lines.push('- tags / locations / metafields / engagement / comments: optional metadata enrichments. These are only included when explicitly requested and for non-blog exports.');
  lines.push('- data_type / article_type / status: categorical fields to help filter and aggregate exports.');
  lines.push('');
  lines.push('Caveats:');
  lines.push('- Not all platforms use the same column names; the exporter attempts to map common fields (id, owner, created_at) but some columns may be missing or differently named.');
  lines.push('- Large exports stream directly to Azure Blob Storage and may take several seconds to complete before the link becomes valid.');
  return lines.join('\n');
}
