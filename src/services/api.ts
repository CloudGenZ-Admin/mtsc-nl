export const CMS_URL = (import.meta.env.VITE_API_URL || import.meta.env.VITE_CMS_URL || 'https://mtsc-nl-cms.cloudgenz.com').replace(/\/+$/, '');

// Global in-memory cache map for populated media objects
const mediaCacheMap = new Map();

export function populateMediaCache(data) {
  if (!data) return;
  if (Array.isArray(data)) {
    data.forEach(item => populateMediaCache(item));
  } else if (typeof data === 'object' && data !== null) {
    if (data.id && data.url) {
      mediaCacheMap.set(String(data.id), data);
    }
    for (const key in data) {
      if (typeof data[key] === 'object' && data[key] !== null) {
        populateMediaCache(data[key]);
      }
    }
  }
}

const fetchOptions: RequestInit = {
  cache: 'no-store',
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
};

/**
 * Fetch MTSC NL HomePage Global data from Payload CMS (with timestamp to bust browser cache cleanly)
 */
export async function getMtscnlHomePageData() {
  try {
    const res = await fetch(`${CMS_URL}/api/globals/mtscnl-home-page?depth=2&_t=${Date.now()}`, fetchOptions);
    if (!res.ok) {
      throw new Error(`Failed to fetch home page data: ${res.statusText}`);
    }
    const data = await res.json();
    populateMediaCache(data);
    return data;
  } catch (error) {
    console.error('Error fetching Mtscnl HomePage data from Payload CMS:', error);
    return null;
  }
}

/**
 * Fetch MTSC NL ContactPage Global data from Payload CMS
 */
export async function getMtscnlContactPageData() {
  try {
    const res = await fetch(`${CMS_URL}/api/globals/mtscnl-contact-page?depth=2&_t=${Date.now()}`, fetchOptions);
    if (!res.ok) {
      throw new Error(`Failed to fetch contact page data: ${res.statusText}`);
    }
    const data = await res.json();
    populateMediaCache(data);
    return data;
  } catch (error) {
    console.error('Error fetching Mtscnl ContactPage data from Payload CMS:', error);
    return null;
  }
}

/**
 * Fetch MTSC NL AboutPage Global data from Payload CMS
 */
export async function getMtscnlAboutPageData() {
  try {
    const res = await fetch(`${CMS_URL}/api/globals/mtscnl-about-page?depth=2&_t=${Date.now()}`, fetchOptions);
    if (!res.ok) {
      throw new Error(`Failed to fetch about page data: ${res.statusText}`);
    }
    const data = await res.json();
    populateMediaCache(data);
    return data;
  } catch (error) {
    console.error('Error fetching Mtscnl AboutPage data from Payload CMS:', error);
    return null;
  }
}

/**
 * Fetch MTSC NL SupportPage Global data from Payload CMS
 */
export async function getMtscnlSupportPageData() {
  try {
    const res = await fetch(`${CMS_URL}/api/globals/mtscnl-support-page?depth=2&_t=${Date.now()}`, fetchOptions);
    if (!res.ok) {
      throw new Error(`Failed to fetch support page data: ${res.statusText}`);
    }
    const data = await res.json();
    populateMediaCache(data);
    return data;
  } catch (error) {
    console.error('Error fetching Mtscnl SupportPage data from Payload CMS:', error);
    return null;
  }
}

/**
 * Fetch MTSC NL GetInvolvedPage Global data from Payload CMS
 */
export async function getMtscnlGetInvolvedPageData() {
  try {
    const res = await fetch(`${CMS_URL}/api/globals/mtscnl-get-involved-page?depth=2&_t=${Date.now()}`, fetchOptions);
    if (!res.ok) {
      throw new Error(`Failed to fetch get-involved page data: ${res.statusText}`);
    }
    const data = await res.json();
    populateMediaCache(data);
    return data;
  } catch (error) {
    console.error('Error fetching Mtscnl GetInvolvedPage data from Payload CMS:', error);
    return null;
  }
}

/**
 * Extracts YouTube Video ID from any full YouTube URL or raw ID
 */
export function getYouTubeVideoId(urlOrId) {
  if (!urlOrId || typeof urlOrId !== 'string') return 'MlBTjyV_ado';
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : 'MlBTjyV_ado';
}

/**
 * Get Media URL with Fallback and Caching
 */
export function getMediaUrl(mediaObj, fallbackUrl = null) {
  if (!mediaObj) return fallbackUrl;

  const formatUrl = (rawUrl) => {
    if (!rawUrl || typeof rawUrl !== 'string') return fallbackUrl;

    let cleanUrl = rawUrl;
    // Handle localhost mapping dynamically
    if (cleanUrl.includes('localhost:4000') || cleanUrl.includes('localhost:3000')) {
      cleanUrl = cleanUrl.replace(/^http:\/\/localhost:(4000|3000)/, CMS_URL);
    }

    if (cleanUrl.startsWith('http') || cleanUrl.startsWith('blob:') || cleanUrl.startsWith('data:')) {
      return cleanUrl;
    }
    return `${CMS_URL}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
  };

  // 1. If mediaObj is a populated object
  if (typeof mediaObj === 'object' && mediaObj !== null) {
    if (mediaObj.id && mediaObj.url) {
      mediaCacheMap.set(String(mediaObj.id), mediaObj);
    }
    if (mediaObj.url) {
      return formatUrl(mediaObj.url);
    }
    if (mediaObj.filename) {
      return `${CMS_URL}/api/media/file/${mediaObj.filename}`;
    }
    if (mediaObj.id) {
      mediaObj = mediaObj.id;
    }
  }

  // 2. Check if media ID exists in mediaCacheMap
  const strId = String(mediaObj);
  if (mediaCacheMap.has(strId)) {
    const cached = mediaCacheMap.get(strId);
    if (cached?.url) return formatUrl(cached.url);
    if (cached?.filename) return `${CMS_URL}/api/media/file/${cached.filename}`;
  }

  // 3. If mediaObj is a direct URL string (not an ID)
  if (typeof mediaObj === 'string' && !/^\d+$/.test(mediaObj) && !/^[a-f\d]{24}$/i.test(mediaObj)) {
    return formatUrl(mediaObj);
  }

  // 4. If mediaObj is a new ID not in cache yet, fetch it silently in background!
  if (/^\d+$/.test(strId) || /^[a-f\d]{24}$/i.test(strId)) { // Added MongoDB ObjectId support as well just in case
    fetch(`${CMS_URL}/api/media/${strId}?_t=${Date.now()}`)
      .then(res => res.json())
      .then(fetchedMedia => {
        if (fetchedMedia && (fetchedMedia.url || fetchedMedia.filename)) {
          mediaCacheMap.set(strId, fetchedMedia);
          window.dispatchEvent(new CustomEvent('payload-media-cached', { detail: { id: strId } }));
        }
      })
      .catch(() => {});
  }

  return fallbackUrl;
}