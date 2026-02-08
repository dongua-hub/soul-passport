"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function CardLoadingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center"
    >
      <div className="bg-white rounded-3xl px-8 py-6 shadow-2xl flex flex-col items-center gap-4">
        {/* 橫向移動的圖片 */}
        <div className="relative w-32 h-32 overflow-visible">
          <motion.div
            animate={{ 
              x: [0, 100] // 單向移動到右邊
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",  // 移到右邊後瞬間回到左邊
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
        
        {/* Loading 文字 */}
        <p className="text-stone-600 font-medium text-center">
          奧莉正在翻閱星圖...
        </p>
      </div>
    </motion.div>
  );
}
