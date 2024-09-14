import { useCallback, ReactElement } from 'react'
import { useAdsgram } from "./hooks/useAdsgram.ts";
import { ShowPromiseResult } from "./types/adsgram";


export function ShowAdButton(): ReactElement {
  const onReward = useCallback(() => {
    alert('Reward');
  }, []);
  const onError = useCallback((result: ShowPromiseResult) => {
    alert(JSON.stringify(result, null, 4));
  }, []);

  /**
   * insert your-block-id
   */
  const showAd = useAdsgram({ blockId: "3072", onReward, onError });

  return (
    <button onClick={showAd}>Show Ad</button>
  )
}
