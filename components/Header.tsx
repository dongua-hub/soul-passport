"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';

interface HeaderProps {
  coins?: number;
  mode?: string;
}

export default function Header({ coins = 0, mode = "每日塔羅" }: HeaderProps) {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md flex justify-between items-center z-10 mb-8"
    >
      {/* 左側：標題 + 護照 Icon */}
      <div className="flex items-center gap-2">
        <div className="relative w-6 h-6">
          <Image src="/ui/passport.png" alt="Passport" fill className="object-contain" />
        </div>
        <h1 className="text-xl font-bold text-stone-600">心靈護照</h1>
      </div>

      {/* 右側：金幣與模式 */}
      <div className="flex items-center gap-4">
        {/* 金幣數量 */}
        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-stone-100">
          <div className="relative w-4 h-4">
            <Image src="/ui/coin.png" alt="Coin" fill className="object-contain" />
          </div>
          <span className="text-sm font-bold text-stone-700">{coins}</span>
        </div>

        {/* 模式標籤 */}
        <div className="bg-[#4A457A] text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
          {mode}
        </div>
      </div>
    </motion.header>
  );
}