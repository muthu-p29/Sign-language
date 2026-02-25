/**
 * Utility functions for the SignEase frontend
 */

/**
 * Formats a word or letter into a video URL for sign language videos
 * @param {string} word - The word or letter to convert to a video URL
 * @returns {string} The URL to the corresponding video file
 */
export function formatVideoUrl(word) {
  if (!word) return '';
  
  // Convert to uppercase for consistency with video file names
  const formattedWord = word.toUpperCase().trim();
  
  // Return the URL to the video file in the static folder (Django serves assets from /static/)
  return `/static/${formattedWord}.mp4`;
}

/**
 * Utility function for conditional className concatenation
 * Similar to the popular 'clsx' or 'classnames' libraries
 * @param {...any} classes - Class names to combine
 * @returns {string} Combined class names
 */
export function cn(...classes) {
  return classes
    .filter(Boolean)
    .map(cls => {
      if (typeof cls === 'string') return cls;
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([_, condition]) => Boolean(condition))
          .map(([className]) => className)
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .trim();
}
