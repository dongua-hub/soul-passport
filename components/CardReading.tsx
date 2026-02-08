"use client";
import { motion } from 'framer-motion';

interface CardReadingProps {
  cardName: string;
  cardNameCh: string;
  fortune: string;
}

export default function CardReading({ cardName, cardNameCh, fortune }: CardReadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-md px-6 z-10"
    >
      {/* 牌名區域 */}
      <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-6 mb-4">
        <h2 className="text-2xl font-bold text-stone-700 mb-1">{cardName}</h2>
        <p className="text-sm text-stone-500 mb-4">{cardNameCh}</p>
        
        {/* 分隔線 */}
        <div className="w-12 h-0.5 bg-stone-300 mb-4"></div>
        
        {/* 奧莉的短評 */}
        <div className="flex gap-3">
          <div className="text-2xl flex-shrink-0">🐱</div>
          <p className="text-stone-600 leading-relaxed text-sm">
            {fortune}
          </p>
        </div>
      </div>
    </motion.div>
  );
}