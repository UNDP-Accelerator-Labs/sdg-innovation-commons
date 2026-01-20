/**
 * Image and media extraction utilities
 * @module lib/utils/media
 */

import { isURL } from './string';
import { APP_STORAGE } from '../config';

/**
 * Extract images from pad sections
 * Similar to parsers.getImg from legacy code
 * 
 * @param json - Pad JSON data with sections
 * @param unique - Return only first image if true
 * @returns Array of image URLs
 */
export function extractImages(json: any = {}, unique: boolean = true): string[] {
  if (!json?.sections) return [];

  const media = json.sections
    .map((section: any) => 
      section.items
        ?.map((item: any) => (item.type === 'group' ? item.items.flat() : item))
        .flat()
    )
    .flat()
    .filter(Boolean);

  // Extract regular images
  const images = media
    .filter((item: any) => item.type === 'img' && item.src)
    .map((item: any) => normalizeImageUrl(item.src));

  // Extract mosaic images
  const mosaicImages = media
    .filter((item: any) => item.type === 'mosaic' && item.srcs?.length > 0)
    .flatMap((item: any) => item.srcs)
    .map((src: string) => normalizeImageUrl(src));

  // Extract embed images
  const embedImages = media
    .filter((item: any) => item.type === 'embed' && item.src)
    .map((item: any) => item.src)
    .filter(Boolean)
    .map((src: string) => normalizeImageUrl(src));

  const allImages = [...images, ...mosaicImages, ...embedImages].filter(Boolean);

  if (unique) {
    return allImages.length > 0 ? [allImages[0]] : [];
  }

  return allImages;
}

/**
 * Normalize image URL (handle uploads path)
 * 
 * @param src - Image source URL or path
 * @returns Normalized image URL
 */
function normalizeImageUrl(src: string): string {
  if (!src) return '';
  
  if (isURL(src)) {
    return src;
  }
  
  // Handle local uploads path
  const normalized = src.replace('uploads', 'uploads/sm');
  return `/${normalized}`;
}

/**
 * Get image URL from Azure blob storage
 * 
 * @param path - Image path in blob storage
 * @returns Full image URL
 */
export function getBlobImageUrl(path: string): string {
  if (!path) return '';
  if (isURL(path)) return path;
  
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${APP_STORAGE}${cleanPath}`;
}

/**
 * Extract video URLs from pad sections
 * 
 * @param json - Pad JSON data with sections
 * @returns Array of video URLs
 */
export function extractVideos(json: any = {}): string[] {
  if (!json?.sections) return [];

  const media = json.sections
    .map((section: any) => 
      section.items
        ?.map((item: any) => (item.type === 'group' ? item.items.flat() : item))
        .flat()
    )
    .flat()
    .filter(Boolean);

  return media
    .filter((item: any) => item.type === 'video' && item.src)
    .map((item: any) => item.src)
    .filter(Boolean);
}

/**
 * Check if URL is an image
 * 
 * @param url - URL to check
 * @returns Boolean indicating if URL is an image
 */
export function isImageUrl(url: string): boolean {
  if (!url) return false;
  
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
  return imageExtensions.test(url.split('?')[0]);
}

/**
 * Check if URL is a video
 * 
 * @param url - URL to check
 * @returns Boolean indicating if URL is a video
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  
  const videoExtensions = /\.(mp4|webm|ogg|mov|avi|wmv|flv)$/i;
  return videoExtensions.test(url.split('?')[0]);
}

/**
 * Get thumbnail URL for a video (YouTube, Vimeo, etc.)
 * 
 * @param videoUrl - Video URL
 * @returns Thumbnail URL or empty string
 */
export function getVideoThumbnail(videoUrl: string): string {
  if (!videoUrl) return '';
  
  // YouTube
  const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
  }
  
  // Vimeo
  const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    // Vimeo requires API call for thumbnails, return placeholder
    return '';
  }
  
  return '';
}

/**
 * Legacy alias for extractImages
 * @deprecated Use extractImages instead
 */
export const getImg = extractImages;
