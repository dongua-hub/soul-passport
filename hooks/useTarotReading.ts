import { useState } from 'react';

interface UseTarotReadingOptions {
  maxRetries?: number;
  initialDelay?: number;
}

interface TarotReadingResult {
  reading: string;
  isLoading: boolean;
  error: string | null;
  fetchReading: (
    question: string,
    cardName: string,
    cardNameCh: string,
    isReversed: boolean
  ) => Promise<void>;
  reset: () => void;
}

/**
 * 塔羅解讀 Hook - 處理 API 呼叫與錯誤重試
 * 
 * 特性：
 * - 指數退避重試邏輯（最多 3 次）
 * - 15 秒超時保護
 * - 優雅的錯誤處理
 * - 預設回退解讀
 */
export const useTarotReading = (
  options: UseTarotReadingOptions = {}
): TarotReadingResult => {
  const { maxRetries = 3, initialDelay = 1000 } = options;

  const [reading, setReading] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 指數退避延遲函數
   */
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  /**
   * 生成預設回退解讀
   */
  const generateFallbackReading = (
    cardNameCh: string,
    isReversed: boolean
  ): string => {
    return isReversed
      ? `${cardNameCh}提醒你需要重新審視某些事情喵～雖然看似困難，但這是成長的機會！`
      : `${cardNameCh}帶來了正向的能量喵～相信自己的直覺，美好的事情即將發生！`;
  };

  /**
   * 單次 API 呼叫（含超時保護）
   */
  const fetchWithTimeout = async (
    question: string,
    cardName: string,
    cardNameCh: string,
    isReversed: boolean,
    timeoutMs: number = 15000
  ): Promise<string> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, cardName, cardNameCh, isReversed }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        
        // 處理特定錯誤碼
        if (errorData.error === 'CHANNEL_BUSY') {
          throw new Error('CHANNEL_BUSY');
        }
        
        throw new Error(errorData.message || 'API 請求失敗');
      }

      const data = await response.json();
      
      if (data.success && data.reading) {
        return data.reading;
      } else {
        throw new Error('API 回應格式錯誤');
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      
      if (err.name === 'AbortError') {
        throw new Error('TIMEOUT');
      }
      
      throw err;
    }
  };

  /**
   * 主要 API 呼叫函數（含重試機制）
   */
  const fetchReading = async (
    question: string,
    cardName: string,
    cardNameCh: string,
    isReversed: boolean
  ) => {
    setIsLoading(true);
    setError(null);

    let lastError: Error | null = null;

    // 重試邏輯
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const result = await fetchWithTimeout(
          question,
          cardName,
          cardNameCh,
          isReversed
        );
        
        setReading(result);
        setIsLoading(false);
        return; // 成功後直接返回
        
      } catch (err: any) {
        lastError = err;
        
        // 如果是通道繁忙或超時，不重試直接跳出
        if (err.message === 'CHANNEL_BUSY' || err.message === 'TIMEOUT') {
          break;
        }
        
        // 最後一次嘗試失敗，不再重試
        if (attempt === maxRetries - 1) {
          break;
        }
        
        // 指數退避：1s → 2s → 4s
        const waitTime = initialDelay * Math.pow(2, attempt);
        await delay(waitTime);
      }
    }

    // 所有重試都失敗，設定錯誤訊息與回退解讀
    if (lastError) {
      let errorMessage = '奧莉貓現在去抓蝴蝶了，請稍後再試喵～ 🦋';
      
      if (lastError.message === 'TIMEOUT') {
        errorMessage = '奧莉貓現在有點累了，請稍後再試 😴';
      } else if (lastError.message === 'CHANNEL_BUSY') {
        errorMessage = '通道繁忙，請稍後再試 🌟';
      }
      
      setError(errorMessage);
      setReading(generateFallbackReading(cardNameCh, isReversed));
    }

    setIsLoading(false);
  };

  /**
   * 重置狀態
   */
  const reset = () => {
    setReading("");
    setError(null);
    setIsLoading(false);
  };

  return {
    reading,
    isLoading,
    error,
    fetchReading,
    reset,
  };
};