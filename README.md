# Stock Tracker App

## What it does

Stock Tracker App lets users monitor live stock prices, set price alerts, and receive instant push notifications when a stock reaches their target price. The app maintains a persistent WebSocket connection to receive price updates in real time during market hours, and includes an in-app notification center so users never miss a triggered alert.

## Why these technologies

- **React Native + Expo** — Single codebase for iOS and Android. Expo SDK 54 provides a managed workflow that significantly reduces native configuration complexity while maintaining access to native APIs via EAS Build.
- **Expo Router** — File-based routing inspired by Next.js. The navigation structure mirrors the folder structure, making it immediately obvious where each screen lives without reading a separate navigation config file.
- **TypeScript** — Shared interfaces between the frontend and backend ensure the data shapes stay in sync. Type errors are caught at compile time rather than at runtime on a user's device.
- **Socket.io Client** — Maintains a persistent connection to the backend WebSocket server.
- **@react-native-firebase** — Official Firebase SDK for React Native. Required for receiving FCM push notifications on Android, even when the app is closed or in the background.
- **AsyncStorage** — Lightweight key-value storage

## Live Backend

The app connects to a deployed backend on Render:

```
https://stock-tracker-backend-0ky0.onrender.com
```

## Tech Stack

| Layer              | Technology                 |
| ------------------ | -------------------------- |
| Framework          | React Native + Expo SDK 54 |
| Language           | TypeScript                 |
| Navigation         | Expo Router (file-based)   |
| HTTP Client        | Axios                      |
| Real-time          | Socket.io Client           |
| Storage            | AsyncStorage               |
| Push Notifications | Firebase Cloud Messaging   |
| Charts             | react-native-chart-kit     |
| Build              | EAS Build                  |

## Project Structure

```
stock-tracker-app/
├── app/
│   ├── (auth)/
│   │   ├── _layout.tsx        # Auth stack layout
│   │   └── login.tsx          # Login and register screen
│   ├── (tabs)/
│   │   ├── _layout.tsx        # Tab bar with badge support
│   │   ├── stocks.tsx         # Live stocks list + bell icon
│   │   ├── chart.tsx          # Daily price charts per stock
│   │   ├── alerts.tsx         # Create and manage price alerts
│   │   └── profile.tsx        # User info and logout
│   ├── notifications.tsx      # In-app notification center
│   ├── _layout.tsx            # Root layout with Toast provider
│   └── index.tsx              # Auth guard and redirect
├── constants/
│   └── config.ts              # API URL configuration
├── hooks/
│   ├── useAuth.ts             # Login, register, logout logic
│   ├── useStocks.ts           # Real-time stock data via WebSocket
│   ├── useNotifications.ts    # Notification center with socket events
│   └── useFCM.ts              # Firebase push notification registration
├── services/
│   ├── api.ts                 # Axios instance with JWT interceptor
│   └── socket.ts              # Socket.io client instance
├── types/
│   └── index.ts               # Shared TypeScript interfaces
├── .env.example               # Environment variable template
├── app.json                   # Expo configuration
├── eas.json                   # EAS Build profiles
└── google-services.json       # Firebase Android configuration
```

## Prerequisites

- Node.js 20+
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- Expo Go app on your Android device (for development)
- Stock Tracker Backend running (see [backend repository](https://github.com/MelissaPleitez/stock-tracker-app.git))

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/MelissaPleitez/frontend-stock-tracker-app.git
cd frontend-stock-tracker-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your backend URL:

```env
# For local development — use your machine's local IP
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:3000
EXPO_PUBLIC_SOCKET_URL=http://YOUR_LOCAL_IP:3000
```

> For production, use the deployed backend URL:
>
> ```
> EXPO_PUBLIC_API_URL=https://stock-tracker-backend-0ky0.onrender.com
> EXPO_PUBLIC_SOCKET_URL=https://stock-tracker-backend-0ky0.onrender.com
> ```

### 4. Start the development server

```bash
npx expo start
```

Scan the QR code with Expo Go on your Android device.

> **Note:** Push notifications (FCM) require a native build and will not work in Expo Go. Use the APK for full functionality, remember to use your computer's local IP address instead of localhost, or my deployed backend URLs.

## Building the APK

### Preview build (recommended for testing)

```bash
eas build --platform android --profile preview
```

or

```bash
npx eas-cli build --platform android --profile preview
```

### Production build

```bash
eas build --platform android --profile production
```

or

```bash
npx eas-cli build --platform android --profile production
```

After the build completes, EAS provides a download link for the APK. Install it directly on any Android device.

## Real-time Architecture

```
Finnhub WebSocket (backend)
         ↓
   Node.js Backend
         ↓
Socket.io emit('price_update')
         ↓
 React Native Socket.io Client
         ↓
   useStocks hook → setStocks()
         ↓
    UI updates instantly
```

---

Built by Melissa Pleitez
