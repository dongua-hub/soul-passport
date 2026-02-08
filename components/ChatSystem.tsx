"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface ChatSystemProps {
  currentStep: 'WELCOME' | 'INPUT' | 'DRAW' | 'LOADING' | 'RESULT';
  onQuestionSubmit: (question: string) => void;
  resultMessage?: string;
}

export default function ChatSystem({ currentStep, onQuestionSubmit, resultMessage }: ChatSystemProps) {
  const [question, setQuestion] = useState("");
  const MAX_LENGTH = 100;  // ✅ 新增：字數上限

  // 根據狀態決定奧莉的對話內容
  const getOriMessage = () => {
    switch (currentStep) {
      case 'WELCOME':
        return "今天有什麼疑惑呢？";
      case 'INPUT':
        return "告訴我你的問題，我會幫你找到答案喵～";
      case 'DRAW':
        return "選一張牌，開啟今日旅行吧～";
      case 'LOADING':
        return "讓我看看星圖怎麼說...";
      case 'RESULT':
        return resultMessage || "這張牌的能量很適合你喵！";
      default:
        return "今天有什麼疑惑呢？";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && question.length <= MAX_LENGTH) {
      onQuestionSubmit(question.trim());
      setQuestion("");
    }
  };

  // ✅ 新增：處理輸入變更並限制長度
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setQuestion(value);
    }
  };

  // ✅ 新增：計算剩餘字數
  const remainingChars = MAX_LENGTH - question.length;
  const isNearLimit = remainingChars <= 20;

  return (
    <section className="flex flex-col items-center justify-center z-10 w-full max-w-3xl mx-auto">
      {/* 奧莉貓圖片 - 放大版 */}
      <motion.div 
        className="relative w-112 h-112 md:w-56 md:h-56 mb-6 md:mb-8"
        animate={{ 
          scale: currentStep === 'LOADING' ? [1, 1.05, 1] : 1 
        }}
        transition={{ 
          duration: 1.5, 
          repeat: currentStep === 'LOADING' ? Infinity : 0 
        }}
      >
        <Image 
          src="/ui/ori-sit.png" 
          alt="Ori" 
          fill 
          className="object-contain" 
          priority 
        />
      </motion.div>

      {/* 奧莉的對話框 - 放大版 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-white px-8 py-4 md:px-10 md:py-5 rounded-2xl shadow-md border border-stone-100 min-h-[60px] md:min-h-[70px] flex items-center justify-center mb-6 md:mb-8"
        >
          <p className="text-stone-600 text-base md:text-lg font-medium text-center">
            {getOriMessage()}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* 輸入框（僅在 WELCOME 和 INPUT 狀態顯示）- 放大版 */}
      <AnimatePresence>
        {(currentStep === 'WELCOME' || currentStep === 'INPUT') && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="w-full"
          >
            <div className="flex flex-col gap-2">
              <div className="flex gap-3 md:gap-4">
                <input
                  type="text"
                  value={question}
                  onChange={handleInputChange}  // ✅ 修改：使用新的處理函數
                  placeholder="輸入你的問題..."
                  maxLength={MAX_LENGTH}  // ✅ 新增：HTML 原生限制
                  className="flex-1 px-6 py-4 md:px-8 md:py-5 rounded-full border-2 border-stone-200 focus:border-[#4A457A] focus:outline-none text-base md:text-lg text-stone-700 placeholder:text-stone-400 shadow-sm"
                  autoFocus
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!question.trim()}
                  className="px-8 py-4 md:px-10 md:py-5 bg-[#4A457A] text-white rounded-full text-base md:text-lg font-bold shadow-lg hover:bg-[#5A557A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  提交
                </motion.button>
              </div>
              
              {/* ✅ 新增：字數計數器 */}
              {question.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end px-2"
                >
                  <span 
                    className={`text-xs md:text-sm font-medium transition-colors ${
                      isNearLimit 
                        ? 'text-amber-600' 
                        : 'text-stone-500'
                    }`}
                  >
                    {remainingChars} / {MAX_LENGTH} 字
                  </span>
                </motion.div>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}