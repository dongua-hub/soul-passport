"use client";
import React, { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * 錯誤邊界組件 - 捕獲子組件的運行時錯誤
 * 
 * 使用方式：
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定義 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 預設錯誤 UI
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen bg-[#F9F8F4] flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl shadow-xl border border-stone-200 p-8 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="text-6xl mb-4">🌙</div>
              <h2 className="text-2xl font-bold text-stone-700 mb-2">
                哎呀，出了點小狀況
              </h2>
              <p className="text-stone-600 mb-6">
                奧莉貓不小心打翻了水晶球...請重新整理頁面試試看。
              </p>
              
              {/* 錯誤詳情（開發環境顯示）*/}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-4 w-full text-left">
                  <summary className="text-xs text-stone-500 cursor-pointer mb-2">
                    技術細節（僅開發環境顯示）
                  </summary>
                  <pre className="text-xs bg-stone-50 p-3 rounded-lg overflow-auto max-h-40">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-[#4A457A] text-white rounded-full text-sm font-bold shadow-lg hover:bg-[#5A557A] hover:scale-105 transition-all"
              >
                重新整理 ↻
              </button>
            </div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;