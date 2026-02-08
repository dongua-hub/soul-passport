// 塔羅牌資料庫 - 22 張大阿爾克那 (Major Arcana)
export const TAROT_CARDS = [
  { id: 0, name: "The Fool", nameCh: "愚者" },
  { id: 1, name: "The Magician", nameCh: "魔術師" },
  { id: 2, name: "The High Priestess", nameCh: "女祭司" },
  { id: 3, name: "The Empress", nameCh: "皇后" },
  { id: 4, name: "The Emperor", nameCh: "皇帝" },
  { id: 5, name: "The Hierophant", nameCh: "教皇" },
  { id: 6, name: "The Lovers", nameCh: "戀人" },
  { id: 7, name: "The Chariot", nameCh: "戰車" },
  { id: 8, name: "Strength", nameCh: "力量" },
  { id: 9, name: "The Hermit", nameCh: "隱者" },
  { id: 10, name: "Wheel of Fortune", nameCh: "命運之輪" },
  { id: 11, name: "Justice", nameCh: "正義" },
  { id: 12, name: "The Hanged Man", nameCh: "倒吊人" },
  { id: 13, name: "Death", nameCh: "死神" },
  { id: 14, name: "Temperance", nameCh: "節制" },
  { id: 15, name: "The Devil", nameCh: "惡魔" },
  { id: 16, name: "The Tower", nameCh: "高塔" },
  { id: 17, name: "The Star", nameCh: "星星" },
  { id: 18, name: "The Moon", nameCh: "月亮" },
  { id: 19, name: "The Sun", nameCh: "太陽" },
  { id: 20, name: "Judgement", nameCh: "審判" },
  { id: 21, name: "The World", nameCh: "世界" },
];

// 生成牌池（包含圖片路徑）
export const generateCardPool = () => {
  return TAROT_CARDS.map(card => ({
    ...card,
    src: `/tarot/card-${card.id}.png`,
    // 預設的簡短解讀（之後會用 AI 生成）
    fortuneUpright: `${card.nameCh}帶來正向的能量喵～`,
    fortuneReversed: `${card.nameCh}提醒你需要注意某些事情喵...`,
  }));
};

// 隨機抽取一張牌（包含正逆位）
export const drawRandomCard = () => {
  const randomIndex = Math.floor(Math.random() * TAROT_CARDS.length);
  const isReversed = Math.random() < 0.5; // 50% 機率逆位
  const card = TAROT_CARDS[randomIndex];
  
  return {
    ...card,
    src: `/tarot/card-${card.id}.png`,
    isReversed,
    displayName: `${card.name}${isReversed ? ' (逆位)' : ''}`,
    displayNameCh: `${card.nameCh}${isReversed ? ' (逆位)' : ''}`,
  };
};