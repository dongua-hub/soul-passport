"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';

interface CardLoadingOverlayProps {
  message?: string;
  variant?: 'card' | 'export'; // ✅ 新增：區分卡片抽取與圖片匯出
}

export default function CardLoadingOverlay({ 
  message, 
  variant = 'card' 
}: CardLoadingOverlayProps) {
  
  const defaultMessage = variant === 'export' 
    ? '正在生成分享圖...' 
    : '奧莉正在翻閱星圖...';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center"
    >
      <div className="bg-white rounded-3xl px-8 py-6 shadow-2xl flex flex-col items-center gap-4">
        
        {/* ✅ 根據 variant 顯示不同動畫 */}
        {variant === 'card' ? (
          // 橫向移動的圖片（卡片抽取）
          <div className="relative w-32 h-32 overflow-visible">
            <motion.div
              animate={{ 
                x: [-30, 60]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear"
              }}
              className="relative w-full h-full"
            >
              <Image 
                src="/ui/loading.png" 
                alt="Ori walking" 
                fill 
                className="object-contain"
                priority
              />
            </motion.div>
          </div>
        ) : (
          // 旋轉動畫（圖片匯出）
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="relative w-24 h-24"
          >
            <Image 
              src="/ui/loading.png" 
              alt="Generating" 
              fill 
              className="object-contain"
              priority
            />
          </motion.div>
        )}
        
        {/* Loading 文字 */}
        <p className="text-stone-600 font-medium text-center">
          {message || defaultMessage}
        </p>
        
        {/* ✅ 進度點動畫 */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-2 h-2 bg-[#4A457A] rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}