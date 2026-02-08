"use client";
import { forwardRef } from 'react';
import Image from 'next/image';
import { 
  getCardTheme, 
  extractGoldenQuote, 
  extractSummary, 
  determineOriEmotion 
} from '@/lib/cardThemeUtils';

interface ResultCardExportV2Props {
  cardName: string;
  cardNameCh: string;
  cardSrc: string;
  isReversed: boolean;
  coreMessage: string;        // AI 完整回覆
  userQuestion: string;
  oriEmotion?: string;         // 可選，若未提供則自動判斷
}

const ResultCardExportV2 = forwardRef<HTMLDivElement, ResultCardExportV2Props>(
  ({ cardName, cardNameCh, cardSrc, isReversed, coreMessage, userQuestion, oriEmotion }, ref) => {
    
    // 動態主題計算
    const theme = getCardTheme(cardName);
    
    // 內容提取
    const goldenQuote = extractGoldenQuote(coreMessage);
    const summary = extractSummary(coreMessage, goldenQuote);
    const finalOriEmotion = oriEmotion || determineOriEmotion(coreMessage);

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
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '80px 64px',
          fontFamily: "'Noto Serif TC', 'Noto Sans TC', system-ui, sans-serif",
          color: theme.textPrimary,
          overflow: 'hidden',
        }}
      >
        {/* 背景裝飾層 - 蕨類（動態透明度）*/}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '280px', 
          height: '280px', 
          opacity: theme.ornamentOpacity,
          transform: 'rotate(15deg)',
        }}>
          <Image src="/ui/fern-left.png" alt="" fill style={{ objectFit: 'contain' }} />
        </div>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          width: '280px', 
          height: '280px', 
          opacity: theme.ornamentOpacity,
          transform: 'rotate(-15deg)',
        }}>
          <Image src="/ui/fern-up.png" alt="" fill style={{ objectFit: 'contain' }} />
        </div>
        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          width: '280px', 
          height: '280px', 
          opacity: theme.ornamentOpacity,
          transform: 'rotate(-15deg)',
        }}>
          <Image src="/ui/fern-down.png" alt="" fill style={{ objectFit: 'contain' }} />
        </div>
        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          right: 0, 
          width: '280px', 
          height: '280px', 
          opacity: theme.ornamentOpacity,
          transform: 'rotate(15deg)',
        }}>
          <Image src="/ui/fern-right.png" alt="" fill style={{ objectFit: 'contain' }} />
        </div>

        {/* Header - 用戶問題（淡化處理）*/}
        <div style={{ 
          position: 'relative', 
          zIndex: 10, 
          width: '100%', 
          maxWidth: '900px',
          textAlign: 'center',
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
            borderRadius: '24px',
            padding: '32px 40px',
            border: `1px solid ${theme.accentColor}33`,
          }}>
            <p style={{ 
              fontSize: '24px', 
              color: theme.textSecondary,
              fontWeight: '400',
              lineHeight: '1.5',
              letterSpacing: '0.5px',
            }}>
              「{userQuestion}」
            </p>
          </div>
        </div>

        {/* Hero Section - 卡牌展示（光暈效果）*/}
        <div style={{ 
          position: 'relative', 
          zIndex: 15,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '36px',
        }}>
          {/* 卡牌容器 - 多層光暈 */}
          <div style={{ 
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {/* 外層光暈 */}
            <div style={{
              position: 'absolute',
              width: '500px',
              height: '750px',
              background: `radial-gradient(circle, ${theme.cardGlow} 0%, transparent 70%)`,
              filter: 'blur(40px)',
              zIndex: 1,
            }} />
            
            {/* 中層光暈 */}
            <div style={{
              position: 'absolute',
              width: '460px',
              height: '690px',
              background: `radial-gradient(circle, ${theme.cardGlow} 0%, transparent 60%)`,
              filter: 'blur(25px)',
              zIndex: 2,
            }} />

            {/* 卡牌本體 */}
            <div style={{ 
              position: 'relative',
              width: '420px', 
              height: '630px', 
              borderRadius: '28px', 
              border: `3px solid ${theme.accentColor}66`,
              boxShadow: `
                0 40px 80px -20px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                0 0 60px ${theme.cardGlow}
              `,
              overflow: 'hidden', 
              backgroundColor: '#ffffff',
              zIndex: 3,
            }}>
              <div style={{ 
                position: 'relative', 
                width: '100%', 
                height: '100%', 
                transform: isReversed ? 'rotate(180deg)' : 'none',
              }}>
                <Image
                  src={cardSrc}
                  alt={cardName}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          {/* 卡片名稱 */}
          <div style={{ 
            textAlign: 'center',
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.3)',
          }}>
            <h2 style={{ 
              fontSize: '56px', 
              fontWeight: 'bold', 
              color: theme.textPrimary,
              marginBottom: '8px',
              letterSpacing: '2px',
            }}>
              {cardName}
            </h2>
            <p style={{ 
              fontSize: '38px', 
              color: theme.textSecondary,
              fontWeight: '300',
            }}>
              {cardNameCh}
            </p>
          </div>
        </div>

        {/* Content Section - 金句與摘要 */}
        <div style={{ 
          position: 'relative', 
          zIndex: 10,
          width: '100%',
          maxWidth: '900px',
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(16px)',
            borderRadius: '32px',
            boxShadow: `
              0 20px 40px rgba(0, 0, 0, 0.2),
              0 0 0 1px ${theme.accentColor}44 inset
            `,
            border: `2px solid ${theme.accentColor}33`,
            padding: '56px',
          }}>
            {/* 金句區 - 襯線體 */}
            <div style={{ 
              marginBottom: '32px',
              paddingBottom: '32px',
              borderBottom: `1px solid ${theme.textSecondary}33`,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
              }}>
                <div style={{ 
                  fontSize: '60px',
                  flexShrink: 0,
                  filter: `drop-shadow(0 0 12px ${theme.accentColor}66)`,
                }}>
                  🔮
                </div>
                <p style={{ 
                  fontSize: '42px',
                  lineHeight: '1.5',
                  fontWeight: '700',
                  color: theme.textPrimary,
                  fontFamily: "'Noto Serif TC', serif",
                  letterSpacing: '1px',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                }}>
                  {goldenQuote}
                </p>
              </div>
            </div>

            {/* 摘要區 - 無襯線體 */}
            <div>
              <p style={{ 
                fontSize: '28px',
                lineHeight: '1.7',
                fontWeight: '400',
                color: theme.textSecondary,
                fontFamily: "'Noto Sans TC', sans-serif",
                letterSpacing: '0.5px',
              }}>
                {summary}
              </p>
            </div>
          </div>
        </div>

        {/* Footer - 品牌與吉祥物 */}
        <div style={{ 
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '900px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}>
          {/* 左側品牌 */}
          <div style={{ 
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          }}>
            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              color: theme.textPrimary,
              marginBottom: '8px',
              letterSpacing: '1px',
            }}>
              Soul Passport
            </h1>
            <p style={{ 
              fontSize: '24px', 
              color: theme.textSecondary,
              fontWeight: '300',
            }}>
              心靈護照 · 塔羅預言
            </p>
          </div>

          {/* 右側奧莉（放大並加陰影）*/}
          <div style={{ 
            position: 'relative',
            width: '240px', 
            height: '240px',
            filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))',
          }}>
            <Image 
              src={`/ui/ori-emo/ori-${finalOriEmotion}.png`} 
              alt="Ori" 
              fill 
              style={{ objectFit: 'contain' }} 
            />
          </div>
        </div>

        {/* 右下角小標 - 網址 */}
        <div style={{
          position: 'absolute',
          bottom: '48px',
          right: '64px',
          zIndex: 5,
        }}>
          <p style={{ 
            fontSize: '20px',
            color: theme.textSecondary,
            opacity: 0.7,
            fontWeight: '300',
            letterSpacing: '0.5px',
          }}>
            soulpassport.app
          </p>
        </div>
      </div>
    );
  }
);

ResultCardExportV2.displayName = 'ResultCardExportV2';

export default ResultCardExportV2;
