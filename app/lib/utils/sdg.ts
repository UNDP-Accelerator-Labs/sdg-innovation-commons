/**
 * SDG (Sustainable Development Goals) related utilities
 * @module lib/utils/sdg
 */

import { SDG_LABELS } from '../config';

/**
 * Extract SDG numbers from pad/content data
 * 
 * @param pad - Pad/content object with sections
 * @returns Array of unique SDG numbers
 */
export function extractSDGNumbers(pad: any): number[] {
  const sdgNumbers: number[] = [];

  pad?.sections?.forEach((section: any) => {
    section?.items?.forEach((item: any) => {
      if (item.type === 'radiogroup' && item.name === 'SDGs') {
        item.options?.forEach((option: any) => {
          if (option.checked && option.key) {
            sdgNumbers.push(Number(option.key));
          }
        });
      }
      
      // Handle nested groups
      if (item.type === 'group' && item.items) {
        item.items.forEach((nestedItem: any) => {
          if (nestedItem.type === 'radiogroup' && nestedItem.name === 'SDGs') {
            nestedItem.options?.forEach((option: any) => {
              if (option.checked && option.key) {
                sdgNumbers.push(Number(option.key));
              }
            });
          }
        });
      }
    });
  });

  // Return unique SDG numbers
  return [...new Set(sdgNumbers)].sort((a, b) => a - b);
}

/**
 * Get SDG label by number
 * 
 * @param sdgNumber - SDG number (1-17)
 * @returns SDG label or undefined
 */
export function getSDGLabel(sdgNumber: number): string | undefined {
  if (sdgNumber < 1 || sdgNumber > 17) return undefined;
  return SDG_LABELS[sdgNumber - 1];
}

/**
 * Get all SDG labels with their numbers
 * 
 * @returns Array of objects with SDG number and label
 */
export function getAllSDGs(): Array<{ number: number; label: string }> {
  return SDG_LABELS.map((label, index) => ({
    number: index + 1,
    label,
  }));
}

/**
 * Validate SDG number
 * 
 * @param sdgNumber - Number to validate
 * @returns Boolean indicating if number is valid SDG
 */
export function isValidSDG(sdgNumber: number): boolean {
  return sdgNumber >= 1 && sdgNumber <= 17;
}

/**
 * Get SDG color class (for UI styling)
 * 
 * @param sdgNumber - SDG number
 * @returns CSS class name for SDG color
 */
export function getSDGColorClass(sdgNumber: number): string {
  const colors: Record<number, string> = {
    1: 'bg-sdg-1',
    2: 'bg-sdg-2',
    3: 'bg-sdg-3',
    4: 'bg-sdg-4',
    5: 'bg-sdg-5',
    6: 'bg-sdg-6',
    7: 'bg-sdg-7',
    8: 'bg-sdg-8',
    9: 'bg-sdg-9',
    10: 'bg-sdg-10',
    11: 'bg-sdg-11',
    12: 'bg-sdg-12',
    13: 'bg-sdg-13',
    14: 'bg-sdg-14',
    15: 'bg-sdg-15',
    16: 'bg-sdg-16',
    17: 'bg-sdg-17',
  };
  
  return colors[sdgNumber] || 'bg-gray-500';
}

/**
 * Filter content by SDG numbers
 * 
 * @param items - Array of content items with SDG data
 * @param sdgNumbers - SDG numbers to filter by
 * @returns Filtered items
 */
export function filterBySDGs<T extends { sdgs?: number[] }>(items: T[], sdgNumbers: number[]): T[] {
  if (!sdgNumbers || sdgNumbers.length === 0) return items;
  
  return items.filter((item) => {
    if (!item.sdgs || item.sdgs.length === 0) return false;
    return sdgNumbers.some((sdg) => item.sdgs?.includes(sdg));
  });
}
