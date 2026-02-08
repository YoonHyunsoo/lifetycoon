# Project Specification & Credentials

## 📖 프로젝트 소개 (Project Overview)
**Mudspoon Tycoon (흙수저 타이쿤)**
React + TypeScript + Vite로 제작된 웹 기반 인생 시뮬레이션 게임입니다. 플레이어는 캐릭터의 인생을 관리하며 매주 스케줄을 결정하고, 운과 선택을 통해 다양한 인생을 경험합니다.

## 1. Technical Stack (Overview)
- **Framework**: React 18+ (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Pixel Art Config)
- **State Management**: Zustand
- **Database / Auth**: Supabase (PostgreSQL)
- **Deployment**: Vercel

---

## 3. Authentication Strategy (New)
**Goal**: Enable One-Click Login via Google.
**Provider**: Supabase Auth (Google OAuth)

### A. Setup Steps
1.  **GCP Console**: Create OAuth Client ID.
    - **Authorized Redirect URI**: `https://ggrwhlautxsrglzyeyyo.supabase.co/auth/v1/callback`
    - **Client ID**: `501020288224-ooradis5r6gmnab804k6grot40e8hkvm.apps.googleusercontent.com`
    - **Client Secret**: *(User to provide/store securely)*
2.  **Supabase Dashboard**: Enable Google Provider.
    - Paste Client ID / Secret from GCP.
3.  **Client Implementation**:
    - Use `supabase.auth.signInWithOAuth({ provider: 'google' })`.

### B. User Flow
- Guest User clicks "Login" -> Opens `AuthModal`.
- Click "Login with Google".
- Redirect to Google -> Redirect back to Game.
- `onAuthStateChange` detects session -> Loads Cloud Save.

---

## 2. Supabase Credentials (Legacy/Reference)
**WARNING: DO NOT SHARE THIS FILE PUBLICLY OR COMMIT TO GITHUB IF IT CONTAINS REAL SECRETS.**
*(Since this is a local development documentation, we store it here for your reference as requested)*

### Environment Variables
For Vercel / Local `.env`:

- **Key**: `VITE_SUPABASE_URL`
- **Value**: `https://ggrwhlautxsrglzyeyyo.supabase.co`

- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdncndobGF1dHhzcmdsenlleXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4ODA4NDQsImV4cCI6MjA4NTQ1Njg0NH0.EGBHjK6NFBokgdhph7DxDP1oVbP2LpTsWi8IY8tvbR8`

### Admin / Secrets
- **DB Password**: `LKe9lG4sNYPuiO5i`
- **API Key (Secret)**: `sb_secret_ItHWX-_rIRWqDzv5a-Gy4A_fB3WF034`
- **Service Role**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTg4MDg0NCwiZXhwIjoyMDg1NDU2ODQ0fQ.7_d6AXiMKUehPv98zFxxmZuTf7WerpS1dmnX5DySxuU`

---

## 3. Directory Structure Key
- `src/app/components`: React UI Components
- `src/store`: Zustand Stores (Game State, Event State, Auth)
- `src/lib`: Core Game Logic (Functions, Constants)
- `src/types`: TypeScript Interfaces
