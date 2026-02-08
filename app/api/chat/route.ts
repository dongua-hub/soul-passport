import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TAROT_IMAGERY, SENSITIVE_KEYWORDS } from '@/lib/tarotImagery';


// 初始化 Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 前端敏感話題檢測
function detectSensitiveTopic(question: string): boolean {
  const lowerQuestion = question.toLowerCase();
  
  // 檢查所有敏感關鍵字類別
  const allKeywords = [
    ...SENSITIVE_KEYWORDS.financial,
    ...SENSITIVE_KEYWORDS.lifeDeath,
    ...SENSITIVE_KEYWORDS.irrelevant
  ];
  
  return allKeywords.some(keyword => 
    lowerQuestion.includes(keyword.toLowerCase())
  );
}

// 建立專業占卜師 Prompt
function buildTarotPrompt(
  question: string,
  cardName: string,
  cardNameCh: string,
  isReversed: boolean
): string {
  const imagery = TAROT_IMAGERY[cardName as keyof typeof TAROT_IMAGERY];
  
  if (!imagery) {
    throw new Error(`未找到牌面資料: ${cardName}`);
  }

  const orientation = isReversed ? 'Reversed (逆位)' : 'Upright (正位)';
  const keywords = isReversed ? imagery.reversedKeywords : imagery.uprightKeywords;

  return `You are Ori, a wise and mystical Tarot Reader with decades of experience. You speak with calm authority and penetrating insight.

CRITICAL GUARDRAIL RULES (Execute First):
Analyze the user's question: "${question}"

If the question involves ANY of the following topics, respond with ONLY these exact 4 Chinese characters and NOTHING else:
天機不可洩漏

Forbidden topics:
- Financial investments (stocks, crypto, real estate prices, gambling, specific investment advice)
- Life/death matters (suicide, self-harm, terminal illness, lifespan predictions, serious medical conditions)
- Completely irrelevant requests (coding, math homework, translations, general chitchat)

If the question passes the guardrails, proceed with the reading below.

---

TAROT READING INSTRUCTIONS:
Card Drawn: ${cardName} (${cardNameCh}) - ${orientation}

Visual Imagery to Reference:
${imagery.imagery}

Key Themes:
${keywords}

Your Reading Must Include:
1. **Specific Visual Metaphor**: Directly reference ONE concrete visual element from the card imagery and connect it to the user's question. Example: "The young traveler at the cliff's edge represents your current crossroads in [specific aspect of question]."

2. **Definitive Answer**: Be specific and direct. Avoid phrases like "maybe" or "possibly." Say exactly what you see.

3. **${isReversed ? 'Reversed Energy' : 'Upright Energy'}**:
   ${isReversed 
     ? '- Emphasize BLOCKAGE, INTERNAL REFLECTION, or REVERSED FLOW of energy. The lesson is often about what needs to be released or reconsidered.'
     : '- Emphasize FLOW, MANIFESTATION, and EXTERNAL ACTION. The energy is moving forward and supporting growth.'
   }

4. **Actionable Insight**: Tell the user ONE specific thing they should do or consider based on this card.

5. **Tone**: 
   - Mystical yet grounded
   - Insightful and penetrating
   - NO cute cat sounds (喵) or playful language
   - Write like a seasoned oracle who sees deeply but speaks kindly
   - Do not be condescending or overly motherly. Treat the user as an equal seeking guidance.

6. **Length**: Maximum 150 words. Be concise and impactful.

7. **Language**: Write entirely in Traditional Chinese (繁體中文).

Begin your reading now.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, cardName, cardNameCh, isReversed } = body;

    // 驗證請求
    if (!question || !cardName) {
      return NextResponse.json(
        { error: '缺少必要參數' },
        { status: 400 }
      );
    }

    // 前端敏感話題檢測（第一層防護）
    if (detectSensitiveTopic(question)) {
      return NextResponse.json({
        success: true,
        reading: '天機不可洩漏',
        filtered: true
      });
    }

    // 檢查 API Key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('未設定 GEMINI_API_KEY');
    }

    // 建立 Prompt
    const prompt = buildTarotPrompt(question, cardName, cardNameCh, isReversed);

    // 呼叫 Gemini API
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.8,  // 增加創意性
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 8000,
      }
    });

    const result = await model.generateContent(prompt);
    const reading = result.response.text();

    // 後端二次檢查（第二層防護）
    if (reading.trim() === '天機不可洩漏') {
      return NextResponse.json({
        success: true,
        reading: '天機不可洩漏',
        filtered: true
      });
    }

    // 移除可能的「喵」尾綴（保險措施）
    const cleanedReading = reading
      .replace(/喵+[～~]*$/g, '')
      .replace(/~+$/g, '')
      .trim();

    return NextResponse.json({
      success: true,
      reading: cleanedReading,
      card: {
        name: cardName,
        nameCh: cardNameCh,
        isReversed
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    
    // 錯誤處理
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'API 金鑰配置錯誤' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: '伺服器錯誤，請稍後再試' },
      { status: 500 }
    );
  }
}

// GET 方法：健康檢查
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: '心靈護照 API 運作中',
    version: '2.0',
    features: [
      '敏感話題過濾',
      '深度牌面解讀',
      '專業占卜師語氣'
    ]
  });
}