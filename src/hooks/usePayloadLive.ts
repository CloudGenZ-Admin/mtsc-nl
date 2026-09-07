import { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLivePreview } from '@payloadcms/live-preview-react';
import {
  CMS_URL,
  populateMediaCache,
  getMtscnlHomePageData,
  getMtscnlAboutPageData,
  getMtscnlContactPageData,
  getMtscnlSupportPageData,
  getMtscnlGetInvolvedPageData,
} from '../services/api';

/**
 * Detects whether the current window is embedded inside Payload CMS Admin iframe
 */
export const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

/**
 * Validates whether data is a non-empty CMS object with actual MTSC-NL content
 */
export function isValidCmsData(d: any): boolean {
  if (!d || typeof d !== 'object' || Array.isArray(d)) return false;
  const keys = Object.keys(d);
  if (keys.length <= 2) return false;

  return Boolean(
    d.id ||
    d.globalType ||
    d.hero_title ||
    d.hero_title_line_1 ||
    d.hero_badge ||
    d.hero_eyebrow ||
    d.history_title ||
    d.involved_title ||
    d.centre_title ||
    d.info_title
  );
}

/**
 * Reads persistent cached data from localStorage for instant 0ms rendering
 */
export function getStorageCache(key: string): any {
  try {
    const raw = localStorage.getItem(`mtscnl_data_v1_${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValidCmsData(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Saves valid data to localStorage for resilience against tab switches & network drops
 */
export function setStorageCache(key: string, data: any): void {
  if (!isValidCmsData(data)) return;
  try {
    localStorage.setItem(`mtscnl_data_v1_${key}`, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Evaluates data sources in priority order.
 * - Inside CMS Admin Iframe:
 *   1. Active postMessageData (as user types in CMS)
 *   2. Live preview hook data if user made live edits
 *   3. Freshly fetched initialData (from server on load or after SAVE)
 * - Outside Iframe (Normal Visitor):
 *   1. Freshly fetched initialData from CMS
 *   2. Last valid cached ref or localStorage
 */
function getBestData(
  postMessageData: any,
  liveData: any,
  initialData: any,
  lastValidRef: React.MutableRefObject<any>,
  cacheKey: string,
  hasLiveUpdates: boolean
): any {
  if (isInIframe) {
    if (isValidCmsData(postMessageData)) {
      lastValidRef.current = postMessageData;
      setStorageCache(cacheKey, postMessageData);
      return postMessageData;
    }
    if (hasLiveUpdates && isValidCmsData(liveData)) {
      lastValidRef.current = liveData;
      setStorageCache(cacheKey, liveData);
      return liveData;
    }
    if (isValidCmsData(initialData)) {
      lastValidRef.current = initialData;
      setStorageCache(cacheKey, initialData);
      return initialData;
    }
  }

  if (isValidCmsData(initialData)) {
    lastValidRef.current = initialData;
    setStorageCache(cacheKey, initialData);
    return initialData;
  }

  if (isValidCmsData(lastValidRef.current)) {
    return lastValidRef.current;
  }

  return getStorageCache(cacheKey);
}

/**
 * Generic builder for MTSC-NL Live Preview + Query Hook
 */
function createMtscnlLiveHook(
  cacheKey: string,
  queryKey: string,
  fetchFn: () => Promise<any>,
  slug: string
) {
  return function useHook() {
    const lastValidRef = useRef<any>(getStorageCache(cacheKey));
    const [hasLiveUpdates, setHasLiveUpdates] = useState(false);
    const [, setMediaCacheTick] = useState(0);

    // Media caching listener
    useEffect(() => {
      const handleMediaCached = () => setMediaCacheTick((t) => t + 1);
      window.addEventListener('payload-media-cached', handleMediaCached);
      return () => window.removeEventListener('payload-media-cached', handleMediaCached);
    }, []);

    // TanStack Query for server data
    const {
      data: initialData,
      isLoading,
      error,
      refetch,
    } = useQuery({
      queryKey: [queryKey],
      queryFn: fetchFn,
      initialData: () => getStorageCache(cacheKey),
      staleTime: 0,
      gcTime: 1000 * 60 * 60 * 24,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    });

    // Populate media URLs from initial data
    useEffect(() => {
      if (isValidCmsData(initialData)) {
        populateMediaCache(initialData);
      }
    }, [initialData]);

    // Live preview hook connected to Payload CMS
    const { data: liveData } = useLivePreview({
      initialData: initialData || lastValidRef.current,
      serverURL: CMS_URL,
      depth: 2,
    });

    useEffect(() => {
      if (isValidCmsData(liveData)) {
        populateMediaCache(liveData);
      }
    }, [liveData]);

    const [postMessageData, setPostMessageData] = useState<any>(null);

    // Window postMessage listener: handles live typing AND save events
    useEffect(() => {
      if (!isInIframe) return;

      const handleMessage = (event: MessageEvent) => {
        // 1. Handle SAVE event: Payload dispatches payload-document-event when document is saved
        if (
          event?.data?.type === 'payload-document-event' ||
          (event?.data?.type === 'payload-live-preview' && event?.data?.event === 'save')
        ) {
          // Immediately refetch from CMS database
          refetch();
          // Secondary refetch after 350ms to ensure DB commit is fully available
          setTimeout(() => {
            refetch();
          }, 350);
          return;
        }

        // 2. Handle Live Preview typing: Payload dispatches live preview field updates
        if (
          event?.data?.type === 'payload-live-preview' ||
          event?.data?.slug === slug ||
          event?.data?.globalSlug === slug ||
          event?.data?.globalType === slug
        ) {
          const payloadData = event.data.data || event.data.doc || event.data;
          if (payloadData && isValidCmsData(payloadData)) {
            setHasLiveUpdates(true);
            setPostMessageData({ ...payloadData });
          }
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }, [refetch]);

    const activeData = useMemo(() => {
      return getBestData(
        postMessageData,
        liveData,
        initialData,
        lastValidRef,
        cacheKey,
        hasLiveUpdates
      );
    }, [postMessageData, liveData, initialData, hasLiveUpdates]);

    return {
      data: activeData,
      isLoading: !isValidCmsData(activeData) && isLoading,
      error,
      refetch,
    };
  };
}

// Export individual hooks for all 5 MTSC Newfoundland pages
export const useMtscnlHomePageLive = createMtscnlLiveHook(
  'mtscnl-home-page',
  'mtscnl-home-page-data',
  getMtscnlHomePageData,
  'mtscnl-home-page'
);

export const useMtscnlAboutPageLive = createMtscnlLiveHook(
  'mtscnl-about-page',
  'mtscnl-about-page-data',
  getMtscnlAboutPageData,
  'mtscnl-about-page'
);

export const useMtscnlContactPageLive = createMtscnlLiveHook(
  'mtscnl-contact-page',
  'mtscnl-contact-page-data',
  getMtscnlContactPageData,
  'mtscnl-contact-page'
);

export const useMtscnlSupportPageLive = createMtscnlLiveHook(
  'mtscnl-support-page',
  'mtscnl-support-page-data',
  getMtscnlSupportPageData,
  'mtscnl-support-page'
);

export const useMtscnlGetInvolvedPageLive = createMtscnlLiveHook(
  'mtscnl-get-involved-page',
  'mtscnl-get-involved-page-data',
  getMtscnlGetInvolvedPageData,
  'mtscnl-get-involved-page'
);
