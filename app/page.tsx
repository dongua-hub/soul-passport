"use client";
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import html2canvas from 'html2canvas';
import Header from '@/components/Header';
import ChatSystem from '@/components/ChatSystem';
import CardLoadingOverlay from '@/components/CardLoadingOverlay';
import ResultCardExport from '@/components/ResultCardExport';
import FernDecorationsLayer from '@/components/FernDecorationsLayer';
import ConsentModal from '@/components/Consentmodal';
import { drawRandomCard } from '@/lib/tarotData';
import { useAppState } from '@/hooks/useAppState';
import { useTarotReading } from '@/hooks/useTarotReading';

// 根據 AI 解讀內容選擇奧莉表情
const getOriEmotion = (reading: string): string => {
  if (!reading) return 'clam';
  
  const lowerReading = reading.toLowerCase();
  
  if (lowerReading.includes('成功') || lowerReading.includes('好運') || 
      lowerReading.includes('喜悅') || lowerReading.includes('順利') ||
      lowerReading.includes('美好')) {
    return 'excited';
  }
  
  if (lowerReading.includes('愛') || lowerReading.includes('溫暖') || 
      lowerReading.includes('療癒') || lowerReading.includes('陪伴')) {
    return 'happy';
  }
  
  if (lowerReading.includes('迷茫') || lowerReading.includes('困惑') || 
      lowerReading.includes('不確定') || lowerReading.includes('等待') ||
      lowerReading.includes('思考')) {
    return 'confuss';
  }
  
  if (lowerReading.includes('挑戰') || lowerReading.includes('困難') || 
      lowerReading.includes('阻礙') || lowerReading.includes('需要')) {
    return 'pet';
  }
  
  return 'clam';
};

export default function Home() {
  // ===== 使用優化後的 Hook =====
  const [state, dispatch] = useAppState();
  const { reading, isLoading: isAILoading, error: apiError, fetchReading } = useTarotReading();
  
  const exportRef = useRef<HTMLDivElement>(null);

  // ===== 事件處理函數 =====

  const handleQuestionSubmit = (question: string) => {
    dispatch({ type: 'SUBMIT_QUESTION', payload: question });
  };

  const handleDraw = async (index: number) => {
    if (state.selectedCard !== null || state.currentStep !== 'DRAW' || state.isDrawing) return;
    
    dispatch({ type: 'START_DRAWING', payload: index });
    
    const card = drawRandomCard();
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    dispatch({ type: 'FINISH_DRAWING', payload: card });
    
    // 使用優化後的 API 呼叫（含重試邏輯）
    await fetchReading(
      state.userQuestion,
      card.name,
      card.nameCh,
      card.isReversed
    );
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  const handlePreviewImage = async () => {
    if (!exportRef.current || !state.drawnCard) return;
    
    dispatch({ type: 'START_EXPORTING' });
    
    try {
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        backgroundColor: '#F9F8F4',
        logging: false,
        useCORS: true,
      });

      const imageUrl = canvas.toDataURL('image/png');
      dispatch({ type: 'FINISH_EXPORTING', payload: imageUrl });
    } catch (error) {
      console.error('Export error:', error);
      alert('生成失敗，請稍後再試 🙏');
      dispatch({ type: 'FINISH_EXPORTING', payload: '' });
    }
  };

  const handleDownloadPreview = () => {
    if (!state.previewImage || !state.drawnCard) return;
    
    const link = document.createElement('a');
    link.download = `soul-passport-${state.drawnCard.nameCh}.png`;
    link.href = state.previewImage;
    link.click();
  };

  const handleClosePreview = () => {
    dispatch({ type: 'CLOSE_PREVIEW' });
  };

  // ===== 輔助函數 =====

  const getCoreMessage = () => {
    if (!reading) return "星象正在為你指引方向...";
    return reading.length > 80 ? reading.slice(0, 80) + '...' : reading;
  };

  const oriEmotion = getOriEmotion(reading);

  // ===== 渲染 =====

  return (
    <>
      <ConsentModal />

      <main className="h-[100dvh] bg-[#F9F8F4] flex flex-col items-center relative overflow-hidden">
        
        {/* 背景裝飾 - 優化版（18 個元素，原本 40+）*/}
        <FernDecorationsLayer />

        <AnimatePresence>
          {state.currentStep === 'LOADING' && <CardLoadingOverlay />}
        </AnimatePresence>

        <div className="w-full flex justify-center flex-shrink-0 px-4 md:px-8 pt-4 md:pt-6 z-10">
          <div className="w-full max-w-5xl mx-auto">
            <Header coins={state.coins} mode="每日塔羅" />
          </div>
        </div>

        {/* ChatSystem - 僅在 WELCOME 和 INPUT 時顯示 */}
        <AnimatePresence>
          {(state.currentStep === 'WELCOME' || state.currentStep === 'INPUT') && (
            <ChatSystem 
              currentStep={state.currentStep}
              onQuestionSubmit={handleQuestionSubmit}
              resultMessage={undefined}
            />
          )}
        </AnimatePresence>

        {/* 扇形牌堆 */}
        <AnimatePresence>
          {(state.currentStep === 'DRAW' || state.currentStep === 'LOADING') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, y: -100 }}
              transition={{ duration: 0.5 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            >
              <div className="relative w-[120vw] h-56 md:h-80 flex justify-center items-end pointer-events-auto overflow-visible">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((index) => {
                  const centerIndex = 7;
                  const offset = index - centerIndex;
                  const rotation = offset * 8;
                  const xPosition = offset * 28;
                  
                  const isEdge = index === 0 || index === 1 || index === 13 || index === 14;
                  const edgeOpacity = isEdge ? 0.7 : 1;
                  const edgeScale = isEdge ? 0.95 : 1;
                  
                  return (
                    <motion.div
                      key={index}
                      onClick={() => handleDraw(index)}
                      style={{
                        originY: 1,
                        zIndex: state.selectedCard === index ? 50 : 10 + index,
                        transformStyle: "preserve-3d",
                        pointerEvents: state.isDrawing ? 'none' : 'auto',
                        cursor: state.isDrawing ? 'not-allowed' : 'pointer',
                        willChange: 'transform', // ✅ 優化動畫效能
                      }}
                      animate={state.selectedCard === index ? {
                        y: -200,
                        rotateY: 180,
                        scale: 1.4,
                        rotate: 0,
                        x: 0,
                        opacity: 1
                      } : {
                        rotate: rotation,
                        x: `${xPosition}px`,
                        y: 0,
                        rotateY: 0,
                        scale: edgeScale,
                        opacity: edgeOpacity
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="absolute w-20 h-32 md:w-24 md:h-40 [transform-style:preserve-3d]"
                    >
                      <div className="relative w-full h-full [transform-style:preserve-3d]">
                        
                        <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl border-2 border-[#4A457A] shadow-xl overflow-hidden bg-[#2D2A4A]">
                          <Image src="/taro-card-back.png" alt="Back" fill className="object-cover" />
                        </div>

                        <div 
                          className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl border-2 border-stone-200 shadow-xl overflow-hidden bg-white flex items-center justify-center"
                        >
                          {state.drawnCard && state.selectedCard === index ? (
                            <div className={`relative w-full h-full ${state.drawnCard.isReversed ? 'rotate-180' : ''}`}>
                              <Image 
                                src={state.drawnCard.src} 
                                alt={state.drawnCard.name} 
                                fill 
                                className="object-cover"
                                onError={(e) => { 
                                  e.currentTarget.style.display = 'none'; 
                                }} 
                              />
                            </div>
                          ) : (
                            <span className="text-xs text-stone-400 font-bold">✨</span>
                          )}
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 解讀結果區域 */}
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden px-4 md:px-8 pb-4 flex items-center justify-center">
          <AnimatePresence>
            {state.drawnCard && state.selectedCard !== null && state.currentStep === 'RESULT' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-6xl z-40"
              >
                <div className="bg-white rounded-3xl shadow-xl border border-stone-100 p-6 md:p-8">
                  
                  {/* 上半部：牌名+問題（左）+ 卡牌（右）*/}
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4 md:mb-6">
                    
                    <div className="flex-1 flex flex-col justify-center">
                      <h2 className="text-lg md:text-xl font-bold text-stone-700 mb-0.5">
                        {state.drawnCard.displayName}
                      </h2>
                      <p className="text-xs md:text-sm text-stone-500 mb-3 md:mb-4">
                        {state.drawnCard.displayNameCh}
                      </p>
                      
                      <div className="w-10 h-0.5 bg-stone-300 mb-3 md:mb-4"></div>
                      
                      <div className="bg-stone-50 rounded-lg p-3 md:p-4">
                        <p className="text-[10px] text-stone-500 mb-0.5">你的問題</p>
                        <p className="text-xs md:text-sm text-stone-700 font-medium">"{state.userQuestion}"</p>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                      className="flex-shrink-0 flex justify-center md:justify-end"
                    >
                      <div className={`relative w-24 h-40 md:w-32 md:h-52 rounded-xl border-2 border-stone-200 shadow-xl overflow-hidden bg-white ${state.drawnCard.isReversed ? 'rotate-180' : ''}`}>
                        <Image 
                          src={state.drawnCard.src} 
                          alt={state.drawnCard.name} 
                          fill 
                          className="object-cover"
                          onError={(e) => { 
                            e.currentTarget.style.display = 'none'; 
                          }} 
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* 下半部：解讀內容 */}
                  <div className="flex gap-4 md:gap-6 pt-4 md:pt-6 border-t border-stone-200">
                    <div className="text-3xl md:text-4xl flex-shrink-0">
                      <Image 
                        src={`/ui/ori-emo/ori-${oriEmotion}.png`} 
                        alt="Ori" 
                        width={56} 
                        height={56}
                        className="w-12 h-12 md:w-14 md:h-14"
                      />
                    </div>
                    <div className="flex-1">
                      {isAILoading ? (
                        <div className="flex flex-col gap-2">
                          <motion.p
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-stone-500 text-base md:text-lg italic"
                          >
                            奧莉正在感應星象中...
                          </motion.p>
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                }}
                                className="w-2 h-2 bg-[#4A457A] rounded-full"
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-stone-600 leading-relaxed text-base md:text-lg">
                            {reading}
                          </p>
                          {apiError && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg"
                            >
                              <p className="text-xs text-amber-700">
                                ⚠️ {apiError}
                              </p>
                            </motion.div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 底部按鈕 */}
        <AnimatePresence>
          {state.currentStep === 'RESULT' && !isAILoading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.5 }}
              className="w-full flex-shrink-0 flex justify-center gap-3 md:gap-4 px-4 pb-6 md:pb-8 z-[100]"
            >
              <button 
                onClick={handlePreviewImage}
                disabled={state.isExporting}
                className="px-6 md:px-8 py-2.5 md:py-3 bg-[#4A457A] text-white rounded-full text-sm font-bold shadow-lg hover:bg-[#5A557A] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.isExporting ? '生成中...' : '預覽分享圖 📸'}
              </button>
              
              <button 
                onClick={handleReset}
                className="px-6 md:px-8 py-2.5 md:py-3 bg-stone-700 text-white rounded-full text-sm font-bold shadow-lg hover:bg-stone-600 hover:scale-105 transition-all"
              >
                重新旅行 ↺
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* 預覽彈窗 */}
      <AnimatePresence>
        {state.previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4"
            onClick={handleClosePreview}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-sm md:max-w-md"
              style={{ maxHeight: '66vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={state.previewImage} 
                alt="預覽" 
                className="w-full h-auto rounded-2xl shadow-2xl"
                style={{ maxHeight: '66vh', objectFit: 'contain' }}
              />
              
              <div className="flex gap-3 mt-6 justify-center">
                <button
                  onClick={handleDownloadPreview}
                  className="px-8 py-3 bg-[#4A457A] text-white rounded-full text-sm font-bold shadow-lg hover:bg-[#5A557A] hover:scale-105 transition-all"
                >
                  下載圖片 💾
                </button>
                <button
                  onClick={handleClosePreview}
                  className="px-8 py-3 bg-white text-stone-700 rounded-full text-sm font-bold shadow-lg hover:bg-stone-100 hover:scale-105 transition-all"
                >
                  關閉 ✕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 隱藏的導出組件 */}
      {state.drawnCard && (
        <div className="fixed -left-[9999px] -top-[9999px]">
          <ResultCardExport
            ref={exportRef}
            cardName={state.drawnCard.displayName}
            cardNameCh={state.drawnCard.displayNameCh}
            cardSrc={state.drawnCard.src}
            isReversed={state.drawnCard.isReversed}
            coreMessage={getCoreMessage()}
            userQuestion={state.userQuestion}
            oriEmotion={oriEmotion}
          />
        </div>
      )}
    </>
  );
}