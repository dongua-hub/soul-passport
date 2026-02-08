"use client";
import { forwardRef } from 'react';
import { extractGoldenQuote, extractSummary } from '@/lib/cardthemeutils'; // ✅ 統一使用 cardthemeutils

interface ResultCardExportProps {
  cardName: string;
  cardNameCh: string;
  cardSrc: string;
  isReversed: boolean;
  coreMessage: string;
  userQuestion: string;
  oriEmotion: string;
}

const ResultCardExport = forwardRef<HTMLDivElement, ResultCardExportProps>(
  ({ cardName, cardNameCh, cardSrc, isReversed, coreMessage, userQuestion, oriEmotion }, ref) => {
    
    // === 動態主題配色系統 ===
    const getThemeByCard = (cardName: string) => {
      // 莫蘭迪紫系列（神秘、靈性、宇宙）
      if (['The High Priestess', 'The Moon', 'The Star', 'Wheel of Fortune', 'Death', 'The World'].includes(cardName)) {
        return {
          name: 'morandi-purple',
          primaryGradient: `
            radial-gradient(ellipse at 50% 40%, #D4C5E0 0%, #B8A5C9 30%, #9B88B3 60%, #7D6B9D 100%),
            radial-gradient(circle at 50% 50%, transparent 0%, rgba(80, 65, 95, 0.4) 100%)
          `,
          cardGlow: 'rgba(180, 165, 201, 0.6)',
          cardShadow: 'rgba(80, 65, 95, 0.6)',
          textPrimary: '#F5F0FA',
          textSecondary: '#C8BAD8',
          accentColor: '#B8A5C9',
          ornamentOpacity: 0.12,
        };
      }

      // 暖棕系列（穩定、物質、實踐）
      if (['The Empress', 'The Emperor', 'The Hierophant', 'The Devil', 'The Tower'].includes(cardName)) {
        return {
          name: 'warm-brown',
          primaryGradient: `
            radial-gradient(ellipse at 50% 40%, #E8D9C8 0%, #D4BFA8 30%, #BDA890 60%, #A08968 100%),
            radial-gradient(circle at 50% 50%, transparent 0%, rgba(90, 70, 50, 0.4) 100%)
          `,
          cardGlow: 'rgba(212, 191, 168, 0.6)',
          cardShadow: 'rgba(90, 70, 50, 0.6)',
          textPrimary: '#FAF5F0',
          textSecondary: '#D4C4B0',
          accentColor: '#D4BFA8',
          ornamentOpacity: 0.12,
        };
      }

      // 米白色系列（預設 - 溫暖、療癒、中性）
      return {
        name: 'cream-white',
        primaryGradient: `
          radial-gradient(ellipse at 50% 40%, #F9F8F4 0%, #EDE8E0 30%, #DDD5C8 60%, #C8BFB0 100%),
          radial-gradient(circle at 50% 50%, transparent 0%, rgba(100, 90, 75, 0.3) 100%)
        `,
        cardGlow: 'rgba(237, 232, 224, 0.6)',
        cardShadow: 'rgba(100, 90, 75, 0.5)',
        textPrimary: '#3A3530',
        textSecondary: '#6B6258',
        accentColor: '#A89B8C',
        ornamentOpacity: 0.15,
      };
    };

    const theme = getThemeByCard(cardName);

    // 智能提取金句（AI 回覆中最精華的一句話）
    const extractGoldenQuote = (text: string): string => {
      if (!text || text.trim().length === 0) return '星象正在為你指引方向...';
      
      // 分割成句子
      const sentences = text.split(/[。！？]/);
      const firstSentence = sentences[0]?.trim() || text.slice(0, 50);
      
      // 限制在 50 字以內
      return firstSentence.length > 50 
        ? firstSentence.slice(0, 50) + '...' 
        : firstSentence + '。';
    };

    // 智能提取摘要（2 行內的精華段落）
    const extractSummary = (text: string, quote: string): string => {
      if (!text || text.trim().length === 0) return '';
      
      // 移除金句部分
      const withoutQuote = text.replace(quote.replace('...', '').replace('。', ''), '').trim();
      
      // 分割成句子
      const sentences = withoutQuote.split(/[。！？]/).filter(s => s.trim().length > 0);
      
      if (sentences.length === 0) return '';
      
      // 取前 1-2 個句子，但不超過 70 字
      let summary = '';
      for (let i = 0; i < Math.min(2, sentences.length); i++) {
        const candidate = summary + sentences[i] + '。';
        if (candidate.length <= 70) {
          summary = candidate;
        } else {
          break;
        }
      }
      
      return summary;
    };

    const goldenQuote = extractGoldenQuote(coreMessage);
    const summary = extractSummary(coreMessage, goldenQuote);

    return (
      <div
        ref={ref}
        style={{
          position: 'relative',
          width: '1080px',
          height: '1920px',
          background: theme.primaryGradient,
          display: 'flex',
          flexDirection: 'column',
          padding: '80px 64px',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          color: theme.textPrimary,
          overflow: 'hidden',
        }}
      >
        
        {/* === 全局暖色濾鏡覆蓋層 === */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: theme.name === 'morandi-purple' 
            ? 'rgba(180, 165, 201, 0.05)'
            : theme.name === 'warm-brown'
            ? 'rgba(212, 191, 168, 0.05)'
            : 'rgba(237, 232, 224, 0.05)',
          mixBlendMode: 'soft-light',
          pointerEvents: 'none',
          zIndex: 1,
        }} />
        
        {/* === 背景裝飾層 === */}
        <div style={{ position: 'absolute', top: '5%', left: '5%', width: '200px', height: '200px', opacity: theme.ornamentOpacity }}>
          <img src="/ui/fern-left.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div style={{ position: 'absolute', top: '5%', right: '5%', width: '200px', height: '200px', opacity: theme.ornamentOpacity }}>
          <img src="/ui/fern-up.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div style={{ position: 'absolute', bottom: '5%', left: '5%', width: '200px', height: '200px', opacity: theme.ornamentOpacity }}>
          <img src="/ui/fern-down.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: '200px', height: '200px', opacity: theme.ornamentOpacity }}>
          <img src="/ui/fern-right.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        {/* === HEADER: 用戶問題概述 === */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ 
            fontSize: '36px', 
            color: theme.textSecondary, 
            fontWeight: '500', 
            lineHeight: '1.4', 
            fontStyle: 'italic',
            maxWidth: '800px',
            margin: '0 auto',
            textShadow: theme.name === 'cream-white' 
              ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
              : '0 2px 8px rgba(0, 0, 0, 0.5)',
          }}>
            "{userQuestion}"
          </p>
        </div>

        {/* === HERO SECTION: 塔羅卡牌展示區 === */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '56px' }}>
          
          {/* 卡牌容器 - 環境光暈 + 真實陰影 */}
          <div 
            style={{ 
              position: 'relative',
              width: '480px', 
              height: '720px',
              borderRadius: '32px',
              overflow: 'hidden',
              boxShadow: `
                0 0 120px 40px ${theme.cardGlow},
                0 50px 100px -20px ${theme.cardShadow},
                0 20px 40px -10px rgba(0, 0, 0, 0.3)
              `,
              transform: isReversed ? 'rotate(180deg)' : 'none',
              transition: 'all 0.3s ease',
              border: `1px solid ${theme.accentColor}40`,
            }}
          >
            <img
              src={cardSrc}
              alt={cardName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* 卡片名稱（中英對照）*/}
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <h2 style={{ 
              fontSize: '64px', 
              fontWeight: 'bold', 
              color: theme.textPrimary, 
              marginBottom: '12px', 
              letterSpacing: '1px',
              textShadow: theme.name === 'cream-white'
                ? '0 3px 12px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.6)'
                : '0 3px 12px rgba(0, 0, 0, 0.6), 0 1px 4px rgba(0, 0, 0, 0.8)',
            }}>
              {cardName}
            </h2>
            <p style={{ 
              fontSize: '42px', 
              color: theme.textSecondary, 
              fontWeight: '500',
              textShadow: theme.name === 'cream-white'
                ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                : '0 2px 8px rgba(0, 0, 0, 0.5)',
            }}>
              {cardNameCh}
            </p>
          </div>
        </div>

        {/* === CONTENT SECTION: 金句 + 摘要 === */}
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '900px', margin: '0 auto' }}>
          
          {/* ✅ 金句 (Golden Quote) - 優雅中文字體 + 固定黑色 */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ 
              fontSize: '52px', 
              fontWeight: '600', 
              color: '#2C2416', // ✅ 固定黑色（溫暖色調）
              lineHeight: '1.6', 
              // ✅ 優雅的中文字體組合（思源宋體優先）
              fontFamily: '"Noto Serif TC", "Source Han Serif TC", "思源宋體", "PingFang TC", "Microsoft JhengHei", "微軟正黑體", serif',
              letterSpacing: '0.05em', // 增加字距，更優雅
              textAlign: 'center',
              // ✅ 統一優雅的陰影（增強可讀性）
              textShadow: `
                0 2px 8px rgba(0, 0, 0, 0.15),
                0 4px 16px rgba(0, 0, 0, 0.1),
                0 1px 2px rgba(0, 0, 0, 0.3)
              `,
            }}>
              {goldenQuote}
            </p>
          </div>

          {/* 摘要 (Summary) - Glassmorphism 效果 */}
          {summary && (
            <div style={{ 
              backgroundColor: theme.name === 'cream-white'
                ? 'rgba(255, 255, 255, 0.3)'
                : 'rgba(245, 239, 231, 0.08)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              borderRadius: '24px',
              padding: '36px',
              border: `2px solid ${theme.accentColor}30`,
              boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
            }}>
              <p style={{ 
                fontSize: '32px', 
                color: theme.textPrimary, 
                lineHeight: '1.6', 
                fontWeight: '400',
                textAlign: 'center',
                textShadow: theme.name === 'cream-white'
                  ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                  : '0 2px 8px rgba(0, 0, 0, 0.5)',
              }}>
                {summary}
              </p>
            </div>
          )}
        </div>

        {/* === FOOTER: 品牌區 === */}
        <div style={{ 
          position: 'absolute', 
          bottom: '64px', 
          left: '64px', 
          right: '64px', 
          zIndex: 10, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end' 
        }}>
          
          {/* 左側：Logo + 網址 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src="/ui/passport.png" 
                alt="Logo" 
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  objectFit: 'contain',
                  filter: theme.name === 'cream-white'
                    ? 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'
                    : 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4))',
                }} 
              />
              <p style={{ 
                fontSize: '32px', 
                fontWeight: 'bold', 
                color: theme.textPrimary,
                textShadow: theme.name === 'cream-white'
                  ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                  : '0 2px 8px rgba(0, 0, 0, 0.5)',
              }}>
                Soul Passport
              </p>
            </div>
            <p style={{ 
              fontSize: '24px', 
              color: theme.textSecondary,
              textShadow: theme.name === 'cream-white'
                ? '0 2px 6px rgba(0, 0, 0, 0.25)'
                : '0 2px 6px rgba(0, 0, 0, 0.4)',
            }}>
              soulpassport.app
            </p>
          </div>

          {/* 右側：奧莉情緒插圖 */}
          <div style={{ 
            width: '360px', 
            height: '360px', 
            opacity: 0.95,
            filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.4))',
          }}>
            <img 
              src={`/ui/ori-emo/ori-${oriEmotion}.png`} 
              alt="Ori" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>
        </div>

      </div>
    );
  }
);

ResultCardExport.displayName = 'ResultCardExport';

export default ResultCardExport;