# Project Specification & Credentials

## 1. Technical Stack (Overview)
- **Framework**: React 18+ (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Pixel Art Config)
- **State Management**: Zustand
- **Database / Auth**: Supabase (PostgreSQL)
- **Deployment**: Vercel

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
