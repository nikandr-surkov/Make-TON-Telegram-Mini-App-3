import { useCallback, useEffect, useRef } from 'react';

export interface ShowPromiseResult {
  error: boolean;
  done: boolean;
  state: string;
  description: string;
}

interface AdController {
  show: () => Promise<void>;
}

declare global {
  interface Window {
    Adsgram?: {
      init: (params: { blockId: string; debug: boolean; debugBannerType: string }) => AdController;
    };
  }
}

export interface useAdsgramParams {
  blockId: string;
  onReward: () => void;
  onError?: (result: ShowPromiseResult) => void;
}

export function useAdsgram({ blockId, onReward, onError }: useAdsgramParams): () => Promise<void> {
  const AdControllerRef = useRef<AdController | undefined>(undefined);

  useEffect(() => {
    AdControllerRef.current = window.Adsgram?.init({ blockId, debug: false, debugBannerType: 'FullscreenMedia' });
  }, [blockId]);

  return useCallback(async () => {
    if (AdControllerRef.current) {
      AdControllerRef.current
        .show()
        .then(() => {
          // user watch ad till the end
          onReward();
        })
        .catch((result: ShowPromiseResult) => {
          // user get error during playing ad or skip ad
          onError?.(result);
        });
    } else {
      onError?.({
        error: true,
        done: false,
        state: 'load',
        description: 'Adsgram script not loaded',
      });
    }
  }, [onError, onReward]);
}
