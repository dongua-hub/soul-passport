// 塔羅牌主題配色與工具函數庫

/**
 * 卡牌主題配色類型
 */
export interface CardTheme {
  name: string;
  primaryGradient: string;      // 主要漸層背景
  cardGlow: string;              // 卡牌光暈顏色
  textPrimary: string;           // 主要文字顏色
  textSecondary: string;         // 次要文字顏色
  accentColor: string;           // 強調色
  ornamentOpacity: number;       // 裝飾元素透明度
}

/**
 * 根據大阿爾克那牌名取得對應主題配色
 */
export const getCardTheme = (cardName: string): CardTheme => {
  // 火元素系列（熱情、行動、轉化）
  if (['The Tower', 'The Sun', 'Strength', 'The Chariot'].includes(cardName)) {
    return {
      name: 'fire',
      primaryGradient: 'linear-gradient(135deg, #FF6B6B 0%, #C92A2A 50%, #862E9C 100%)',
      cardGlow: 'rgba(255, 107, 107, 0.4)',
      textPrimary: '#2B2D42',
      textSecondary: '#8D99AE',
      accentColor: '#FF6B6B',
      ornamentOpacity: 0.15,
    };
  }

  // 水元素系列（情感、直覺、潛意識）
  if (['The High Priestess', 'The Moon', 'The Hanged Man', 'Temperance'].includes(cardName)) {
    return {
      name: 'water',
      primaryGradient: 'linear-gradient(135deg, #4ECDC4 0%, #1A535C 50%, #264653 100%)',
      cardGlow: 'rgba(78, 205, 196, 0.35)',
      textPrimary: '#F1FAEE',
      textSecondary: '#A8DADC',
      accentColor: '#4ECDC4',
      ornamentOpacity: 0.2,
    };
  }

  // 風元素系列（理智、溝通、思考）
  if (['The Fool', 'The Magician', 'The Lovers', 'Justice', 'Judgement'].includes(cardName)) {
    return {
      name: 'air',
      primaryGradient: 'linear-gradient(135deg, #A8DADC 0%, #457B9D 50%, #1D3557 100%)',
      cardGlow: 'rgba(168, 218, 220, 0.4)',
      textPrimary: '#F1FAEE',
      textSecondary: '#CAD2C5',
      accentColor: '#A8DADC',
      ornamentOpacity: 0.18,
    };
  }

  // 土元素系列（物質、穩定、實踐）
  if (['The Empress', 'The Emperor', 'The Hierophant', 'The Hermit', 'The Devil'].includes(cardName)) {
    return {
      name: 'earth',
      primaryGradient: 'linear-gradient(135deg, #84A98C 0%, #52796F 50%, #2F3E46 100%)',
      cardGlow: 'rgba(132, 169, 140, 0.35)',
      textPrimary: '#CAD2C5',
      textSecondary: '#A7C4BC',
      accentColor: '#84A98C',
      ornamentOpacity: 0.2,
    };
  }

  // 靈性/宇宙系列（命運、轉化、圓滿）
  if (['Wheel of Fortune', 'Death', 'The Star', 'The World'].includes(cardName)) {
    return {
      name: 'cosmic',
      primaryGradient: 'linear-gradient(135deg, #9D84B7 0%, #5E548E 50%, #231942 100%)',
      cardGlow: 'rgba(157, 132, 183, 0.4)',
      textPrimary: '#E0B1CB',
      textSecondary: '#BE95C4',
      accentColor: '#9D84B7',
      ornamentOpacity: 0.22,
    };
  }

  // 預設主題（溫暖中性）
  return {
    name: 'default',
    primaryGradient: 'linear-gradient(135deg, #D4A574 0%, #A67C52 50%, #7D5A3B 100%)',
    cardGlow: 'rgba(212, 165, 116, 0.3)',
    textPrimary: '#2C2416',
    textSecondary: '#6B5842',
    accentColor: '#D4A574',
    ornamentOpacity: 0.18,
  };
};

/**
 * 智能截斷文字（保持語意完整）
 * @param text 原始文字
 * @param maxLength 最大長度
 * @param addEllipsis 是否添加省略號
 * @returns 截斷後的文字
 */
export const truncateText = (text: string, maxLength: number, addEllipsis: boolean = true): string => {
  if (!text || text.length === 0) return '';
  if (text.length <= maxLength) return text;

  // 尋找最接近的標點符號位置（優先保持語意完整）
  const punctuationMarks = ['。', '！', '？', '，', '；', '：', '、'];
  let bestCutPoint = maxLength;

  // 在 maxLength 前後各 15 個字的範圍內尋找標點
  const searchStart = Math.max(0, maxLength - 15);
  const searchEnd = Math.min(text.length, maxLength + 5);

  for (let i = searchEnd - 1; i >= searchStart; i--) {
    if (punctuationMarks.includes(text[i])) {
      bestCutPoint = i + 1;
      break;
    }
  }

  // 如果沒找到標點，直接在 maxLength 處截斷
  if (bestCutPoint === maxLength && !punctuationMarks.includes(text[maxLength - 1])) {
    bestCutPoint = maxLength;
  }

  const truncated = text.slice(0, bestCutPoint).trim();
  return addEllipsis ? truncated + '...' : truncated;
};

/**
 * 從 AI 完整回覆中提取「金句」（最精華的一句話）
 * @param fullReading AI 完整回覆
 * @returns 金句字串
 */
export const extractGoldenQuote = (fullReading: string): string => {
  if (!fullReading || fullReading.trim().length === 0) {
    return '星象正在為你指引方向...';
  }

  let text = fullReading.trim();

  // 移除常見的前綴語（更精確的模式）
  const prefixPatterns = [
    /^(親愛的|嗨|你好|讓我告訴你)[，,]/,  // 開頭稱呼
    /^(嗯|好的|當然)[，,。！]/,          // 口語開場
    /^[「『].*?[」』][，,]/,             // 引號內容
  ];

  for (const pattern of prefixPatterns) {
    text = text.replace(pattern, '');
  }

  text = text.trim();

  // 分割成句子（保留標點符號）
  const sentenceMatches = text.match(/[^。！？]+[。！？]/g);
  
  if (sentenceMatches && sentenceMatches.length > 0) {
    // 取第一個完整句子
    let firstSentence = sentenceMatches[0].trim();
    
    // 如果第一句太短（少於 10 字），嘗試加上第二句
    if (firstSentence.length < 10 && sentenceMatches.length > 1) {
      firstSentence = (sentenceMatches[0] + sentenceMatches[1]).trim();
    }
    
    // 限制在 50 字以內（分享圖顯示的最佳長度）
    if (firstSentence.length > 50) {
      return truncateText(firstSentence, 50);
    }
    
    return firstSentence;
  }

  // 如果沒有找到完整句子，使用逗號分割
  const commaSegments = text.split(/[，,]/);
  if (commaSegments.length > 0 && commaSegments[0].length > 0) {
    const segment = commaSegments[0].trim();
    return segment.length > 50 ? truncateText(segment, 50) : segment + '。';
  }

  // 最後手段：直接截取前 50 字
  return truncateText(text, 50);
};

/**
 * 提取摘要（2 行以內的精華）
 * @param fullReading AI 完整回覆
 * @param goldenQuote 已提取的金句（避免重複）
 * @returns 摘要字串
 */
export const extractSummary = (fullReading: string, goldenQuote: string): string => {
  if (!fullReading || fullReading.trim().length === 0) {
    return '';
  }

  let text = fullReading.trim();

  // 移除金句部分（處理可能的省略號）
  const quoteToRemove = goldenQuote.replace(/\.{3}$/, '').trim();
  const quoteIndex = text.indexOf(quoteToRemove);
  
  if (quoteIndex !== -1) {
    // 找到金句位置，取其後的內容
    text = text.slice(quoteIndex + quoteToRemove.length).trim();
  }

  // 移除開頭的標點符號
  text = text.replace(/^[，。！？、；：]+/, '').trim();

  if (text.length === 0) {
    return '';
  }

  // 分割成句子
  const sentenceMatches = text.match(/[^。！？]+[。！？]/g);
  
  if (sentenceMatches && sentenceMatches.length > 0) {
    let summary = '';
    
    // 嘗試組合 1-2 個句子，但不超過 70 字
    for (let i = 0; i < Math.min(2, sentenceMatches.length); i++) {
      const candidate = summary + sentenceMatches[i];
      if (candidate.length <= 70) {
        summary = candidate;
      } else {
        break;
      }
    }

    // 移除常見的祝福語結尾
    summary = summary
      .replace(/(記住|提醒你|祝福你|願你|相信自己|保持|讓我們|繼續)[^。！？]*[。！？]?$/g, '')
      .trim();

    if (summary.length > 0) {
      return summary.length > 70 ? truncateText(summary, 70) : summary;
    }
  }

  // 如果沒有完整句子，取前 70 字
  const firstPart = text.slice(0, 70);
  
  // 移除祝福語
  const withoutBlessing = firstPart
    .replace(/(記住|提醒你|祝福你|願你|相信自己|保持|讓我們|繼續).*$/g, '')
    .trim();

  if (withoutBlessing.length > 15) {
    return truncateText(withoutBlessing, 70);
  }

  // 最後手段：返回前 70 字
  return truncateText(text, 70);
};

/**
 * 根據 AI 情緒標籤決定奧利表情
 * @param reading AI 完整回覆
 * @returns 表情檔名（不含路徑與副檔名）
 */
export const determineOriEmotion = (reading: string): string => {
  if (!reading) return 'clam';
  
  const lowerReading = reading.toLowerCase();
  
  // 興奮/正向
  if (
    lowerReading.includes('成功') || 
    lowerReading.includes('好運') || 
    lowerReading.includes('喜悅') || 
    lowerReading.includes('順利') ||
    lowerReading.includes('美好')
  ) {
    return 'excited';
  }
  
  // 開心/溫暖
  if (
    lowerReading.includes('愛') || 
    lowerReading.includes('溫暖') || 
    lowerReading.includes('療癒') || 
    lowerReading.includes('陪伴')
  ) {
    return 'happy';
  }
  
  // 困惑/需思考
  if (
    lowerReading.includes('迷茫') || 
    lowerReading.includes('困惑') || 
    lowerReading.includes('不確定') || 
    lowerReading.includes('等待') ||
    lowerReading.includes('思考')
  ) {
    return 'confuss';
  }
  
  // 安撫/鼓勵
  if (
    lowerReading.includes('挑戰') || 
    lowerReading.includes('困難') || 
    lowerReading.includes('阻礙') || 
    lowerReading.includes('需要')
  ) {
    return 'pet';
  }
  
  // 預設：平靜
  return 'clam';
};