export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

export interface User {
  id: number;
  email: string;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

export interface Alert {
  id: number;
  userId: number;
  symbol: string;
  targetPrice: number;
  triggered: boolean;
  createdAt: string;
}

export interface CreateAlertPayload {
  symbol: string;
  targetPrice: number;
}

export interface InAppNotification {
  id: number;
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: InAppNotification[];
  unreadCount: number;
}
