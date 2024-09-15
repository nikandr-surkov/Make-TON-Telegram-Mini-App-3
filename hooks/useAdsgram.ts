import { useCallback, useEffect, useRef } from 'react';

export interface ShowPromiseResult {
  done: boolean;
  description: string;
  state: 'load' | 'render' | 'playing' | 'destroy';
  error: boolean;
}

type BannerType = 'RewardedVideo' | 'FullscreenMedia';
type EventType = 'onReward' | 'onStart' | 'onSkip' | 'onBannerNotFound' | 'onError';
type HandlerType = () => void;

interface AdController {
  show(): Promise<ShowPromiseResult>;
  addEventListener(event: EventType, handler: HandlerType): void;
  removeEventListener(event: EventType, handler: HandlerType): void;
  destroy(): void;
}

declare global {
  interface Window {
    Adsgram?: {
      init(params: { blockId: string; debug?: boolean; debugBannerType?: BannerType }): AdController;
    };
  }
}

export interface UseAdsgramParams {
  blockId: string;
  onReward?: () => void;
  onStart?: () => void;
  onSkip?: () => void;
  onBannerNotFound?: () => void;
  onError?: (result: ShowPromiseResult) => void;
}

export function useAdsgram({
  blockId,
  onReward,
  onStart,
  onSkip,
  onBannerNotFound,
  onError
}: UseAdsgramParams): () => Promise<ShowPromiseResult> {
  const adControllerRef = useRef<AdController | undefined>(undefined);

  useEffect(() => {
    adControllerRef.current = window.Adsgram?.init({ blockId, debug: false, debugBannerType: 'FullscreenMedia' });

    return () => {
      adControllerRef.current?.destroy();
    };
  }, [blockId]);

  useEffect(() => {
    const controller = adControllerRef.current;
    if (!controller) return;

    if (onReward) controller.addEventListener('onReward', onReward);
    if (onStart) controller.addEventListener('onStart', onStart);
    if (onSkip) controller.addEventListener('onSkip', onSkip);
    if (onBannerNotFound) controller.addEventListener('onBannerNotFound', onBannerNotFound);
    if (onError) controller.addEventListener('onError', () => onError({ error: true, done: false, state: 'load', description: 'Ad error occurred' }));

    return () => {
      if (onReward) controller.removeEventListener('onReward', onReward);
      if (onStart) controller.removeEventListener('onStart', onStart);
      if (onSkip) controller.removeEventListener('onSkip', onSkip);
      if (onBannerNotFound) controller.removeEventListener('onBannerNotFound', onBannerNotFound);
      if (onError) controller.removeEventListener('onError', () => onError({ error: true, done: false, state: 'load', description: 'Ad error occurred' }));
    };
  }, [onReward, onStart, onSkip, onBannerNotFound, onError]);

  return useCallback(async (): Promise<ShowPromiseResult> => {
    if (adControllerRef.current) {
      try {
        
        const result = await adControllerRef.current.show();
        return result;
      } catch (error) {
        const errorResult: ShowPromiseResult = {
          error: true,
          done: false,
          state: 'load',
          description: 'Error showing ad'
        };
        onError?.(errorResult);
        return errorResult;
      }
    } else {
      const errorResult: ShowPromiseResult = {
        error: true,
        done: false,
        state: 'load',
        description: 'Adsgram script not loaded'
      };
      onError?.(errorResult);
      return errorResult;
    }
  }, [onError]);
}
