import { useReducer } from 'react';

// ===== 狀態機定義 =====

export type FlowStep = 'WELCOME' | 'INPUT' | 'DRAW' | 'LOADING' | 'RESULT';

export interface AppState {
  // 流程狀態
  currentStep: FlowStep;
  
  // 使用者輸入
  userQuestion: string;
  
  // 卡牌資料
  selectedCard: number | null;
  drawnCard: {
    id: number;
    name: string;
    nameCh: string;
    src: string;
    isReversed: boolean;
    displayName: string;
    displayNameCh: string;
  } | null;
  
  // UI 狀態
  isDrawing: boolean;
  isExporting: boolean;
  previewImage: string | null;
  
  // 遊戲資料
  coins: number;
}

// ===== Action 類型定義 =====

type AppAction =
  | { type: 'SUBMIT_QUESTION'; payload: string }
  | { type: 'START_DRAWING'; payload: number }
  | { type: 'FINISH_DRAWING'; payload: AppState['drawnCard'] }
  | { type: 'START_EXPORTING' }
  | { type: 'FINISH_EXPORTING'; payload: string }
  | { type: 'CLOSE_PREVIEW' }
  | { type: 'RESET' };

// ===== 初始狀態 =====

export const initialState: AppState = {
  currentStep: 'WELCOME',
  userQuestion: "",
  selectedCard: null,
  drawnCard: null,
  isDrawing: false,
  isExporting: false,
  previewImage: null,
  coins: 100,
};

// ===== Reducer 函數 =====

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SUBMIT_QUESTION':
      return {
        ...state,
        userQuestion: action.payload,
        currentStep: 'DRAW',
      };

    case 'START_DRAWING':
      return {
        ...state,
        selectedCard: action.payload,
        isDrawing: true,
        currentStep: 'LOADING',
      };

    case 'FINISH_DRAWING':
      return {
        ...state,
        drawnCard: action.payload,
        isDrawing: false,
        currentStep: 'RESULT',
      };

    case 'START_EXPORTING':
      return {
        ...state,
        isExporting: true,
      };

    case 'FINISH_EXPORTING':
      return {
        ...state,
        isExporting: false,
        previewImage: action.payload,
      };

    case 'CLOSE_PREVIEW':
      return {
        ...state,
        previewImage: null,
      };

    case 'RESET':
      return {
        ...initialState,
        coins: state.coins, // 保留金幣數
      };

    default:
      return state;
  }
};

// ===== Custom Hook =====

export const useAppState = () => {
  return useReducer(appReducer, initialState);
};