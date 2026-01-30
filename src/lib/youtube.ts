/**
 * YouTube URL Utilities
 * Converts various YouTube URL formats to embeddable URLs
 */

/**
 * Extracts video ID from various YouTube URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractYouTubeVideoId(url: string): string | null {
    if (!url) return null;

    try {
        const urlObj = new URL(url);

        // Standard watch URL: youtube.com/watch?v=VIDEO_ID
        if (urlObj.hostname.includes('youtube.com') && urlObj.pathname === '/watch') {
            return urlObj.searchParams.get('v');
        }

        // Short URL: youtu.be/VIDEO_ID
        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.slice(1); // Remove leading slash
        }

        // Shorts: youtube.com/shorts/VIDEO_ID
        if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.startsWith('/shorts/')) {
            return urlObj.pathname.split('/')[2];
        }

        // Embed URL: youtube.com/embed/VIDEO_ID
        if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.startsWith('/embed/')) {
            return urlObj.pathname.split('/')[2];
        }

        return null;
    } catch (error) {
        console.error('Error parsing YouTube URL:', error);
        return null;
    }
}

/**
 * Converts any YouTube URL to embed format
 * Returns null if URL is invalid or not a YouTube URL
 */
export function convertToYouTubeEmbed(url: string): string | null {
    const videoId = extractYouTubeVideoId(url);

    if (!videoId) {
        return null;
    }

    return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Checks if a URL is a valid YouTube URL
 */
export function isYouTubeUrl(url: string): boolean {
    if (!url) return false;

    try {
        const urlObj = new URL(url);
        return urlObj.hostname.includes('youtube.com') || urlObj.hostname === 'youtu.be';
    } catch {
        return false;
    }
}

/**
 * Gets YouTube thumbnail URL from video URL
 */
export function getYouTubeThumbnail(url: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'hq'): string | null {
    const videoId = extractYouTubeVideoId(url);

    if (!videoId) {
        return null;
    }

    const qualityMap = {
        'default': 'default',
        'mq': 'mqdefault',
        'hq': 'hqdefault',
        'sd': 'sddefault',
        'maxres': 'maxresdefault'
    };

    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}
