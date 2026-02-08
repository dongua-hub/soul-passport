"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CONSENT_KEY = 'soul_passport_agreed';

export default function ConsentModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 檢查是否已同意過
    const hasAgreed = localStorage.getItem(CONSENT_KEY);
    if (!hasAgreed) {
      setIsVisible(true);
    }
  }, []);

  const handleAgree = () => {
    // 存入 localStorage
    localStorage.setItem(CONSENT_KEY, 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-[#F9F8F4] rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
          >
            {/* 頂部裝飾 */}
            <div className="relative h-24 bg-gradient-to-br from-[#D4BFA8] to-[#A08968] flex items-center justify-center">
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 400 100">
                  <pattern id="fern-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                    <circle cx="50" cy="50" r="2" fill="white" opacity="0.3"/>
                  </pattern>
                  <rect width="400" height="100" fill="url(#fern-pattern)"/>
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white z-10 text-center px-4">
                嘿！在開啟旅程之前...
              </h2>
            </div>

            {/* 內容區 */}
            <div className="p-6 md:p-8 space-y-5">
              
              {/* 免責聲明 */}
              <div className="bg-white rounded-2xl p-5 border-2 border-stone-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-amber-600 text-lg">⚠️</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-stone-700 mb-2">免責聲明</h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      本程式僅供<span className="font-semibold text-amber-600">娛樂與自我探索用途</span>，不代表專業醫療或心理建議。
                    </p>
                  </div>
                </div>
              </div>

              {/* 隱私提醒 */}
              <div className="bg-white rounded-2xl p-5 border-2 border-stone-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-lg">🔒</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-stone-700 mb-2">隱私提醒</h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      請勿輸入<span className="font-semibold text-blue-600">真實姓名或敏感隱私資訊</span>。
                    </p>
                  </div>
                </div>
              </div>

              {/* AI 說明 */}
              <div className="bg-white rounded-2xl p-5 border-2 border-stone-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-purple-600 text-lg">🤖</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-stone-700 mb-2">AI 說明</h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      結果由 <span className="font-semibold text-purple-600">Gemini AI</span> 生成，請保持批判性思考。
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* 底部按鈕 */}
            <div className="p-6 md:p-8 pt-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAgree}
                className="w-full py-4 bg-gradient-to-r from-[#D4BFA8] to-[#A08968] text-white rounded-full text-base md:text-lg font-bold shadow-lg hover:shadow-xl transition-all"
              >
                我已理解並進入 ✨
              </motion.button>
              
              <p className="text-xs text-stone-500 text-center mt-4">
                點擊按鈕即表示您同意以上條款
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}