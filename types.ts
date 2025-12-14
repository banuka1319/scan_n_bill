export interface ReceiptItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
}

export interface ReceiptData {
  merchantName: string;
  date: string;
  currency: string;
  taxAmount: number;
  totalAmount: number;
  items: ReceiptItem[];
  summary?: string;
}

export interface ExtractedResult {
  data: ReceiptData | null;
  rawText: string;
  error?: string;
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}