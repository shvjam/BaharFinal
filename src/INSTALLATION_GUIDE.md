# 📦 راهنمای نصب و راه‌اندازی پروژه فرانت‌اند باربری بهار
## React + TypeScript + Vite + Tailwind CSS 4

---

## 📋 فهرست مطالب

1. [پیش‌نیازها](#1-پیشنیازها)
2. [دانلود پروژه](#2-دانلود-پروژه)
3. [ساختار پروژه](#3-ساختار-پروژه)
4. [فایل‌های ضروری برای اجرا](#4-فایلهای-ضروری-برای-اجرا)
5. [نصب Dependencies](#5-نصب-dependencies)
6. [اجرای پروژه](#6-اجرای-پروژه)
7. [رفع مشکلات احتمالی](#7-رفع-مشکلات-احتمالی)
8. [دستورات مفید](#8-دستورات-مفید)
9. [تنظیمات اختیاری](#9-تنظیمات-اختیاری)
10. [اتصال به بک‌اند](#10-اتصال-به-بکاند)

---

## 1. پیش‌نیازها

### ✅ نرم‌افزارهای مورد نیاز:

#### 1.1. Node.js و npm
- **نسخه مورد نیاز**: Node.js 18.x یا بالاتر
- **دانلود**: [nodejs.org](https://nodejs.org/)

**بررسی نصب:**
```bash
node --version
# باید چیزی شبیه v18.17.0 یا بالاتر نشان دهد

npm --version
# باید چیزی شبیه 9.6.7 یا بالاتر نشان دهد
```

#### 1.2. Git (اختیاری)
- **دانلود**: [git-scm.com](https://git-scm.com/)

```bash
git --version
```

#### 1.3. ویرایشگر کد (پیشنهادی)
- **VS Code**: [code.visualstudio.com](https://code.visualstudio.com/)

**افزونه‌های پیشنهادی برای VS Code:**
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets

---

## 2. دانلود پروژه

### روش 1: دانلود فایل ZIP

1. فایل ZIP پروژه را از منبع خود دانلود کنید
2. فایل را Extract کنید:
   - **Windows**: راست کلیک → Extract All
   - **Mac**: دابل کلیک روی فایل
   - **Linux**: `unzip project.zip`

3. پوشه را به مکان دلخواه منتقل کنید (مثلاً `C:\Projects\BarbariBahar`)

### روش 2: استفاده از Git (اگر پروژه در Repository است)

```bash
git clone [repository-url]
cd barbarbahar
```

---

## 3. ساختار پروژه

پس از Extract، پروژه شما باید این ساختار را داشته باشد:

```
BarbariBahar/
├── src/                      # کدهای اصلی پروژه (باید ایجاد شود)
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   ├── pages/
│   ├── contexts/
│   ├── types/
│   ├── styles/
│   ├── services/
│   └── constants/
│
├── public/                   # فایل‌های استاتیک (باید ایجاد شود)
│   └── vite.svg
│
├── package.json             # باید ایجاد شود
├── tsconfig.json            # باید ایجاد شود
├── vite.config.ts           # باید ایجاد شود
├── tailwind.config.js       # باید ایجاد شود (اختیاری در Tailwind 4)
├── postcss.config.js        # باید ایجاد شود (اختیاری در Tailwind 4)
└── index.html               # باید ایجاد شود
```

**⚠️ نکته مهم:** فایل‌هایی که در بخش بعدی ذکر می‌شوند باید **حتماً** در پروژه موجود باشند.

---

## 4. فایل‌های ضروری برای اجرا

### 4.1. ایجاد `package.json`

در ریشه پروژه، فایل `package.json` را با محتوای زیر ایجاد کنید:

```json
{
  "name": "barbarbahar",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-alert-dialog": "^1.1.1",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.1.1",
    "@radix-ui/react-collapsible": "^1.1.0",
    "@radix-ui/react-context-menu": "^2.2.1",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-hover-card": "^1.1.1",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-menubar": "^1.1.1",
    "@radix-ui/react-navigation-menu": "^1.2.0",
    "@radix-ui/react-popover": "^1.1.1",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.0",
    "@radix-ui/react-scroll-area": "^1.1.0",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.1",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-toggle-group": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2",
    "lucide-react": "^0.441.0",
    "date-fns": "^3.6.0",
    "date-fns-jalali": "^3.6.0-1",
    "recharts": "^2.12.7",
    "embla-carousel-react": "^8.3.0",
    "vaul": "^0.9.9",
    "sonner": "^1.5.0",
    "input-otp": "^1.2.4",
    "react-day-picker": "^8.10.1",
    "cmdk": "^1.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.18.0",
    "@typescript-eslint/parser": "^7.18.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.3",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.11",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0-alpha.25",
    "autoprefixer": "^10.4.20"
  }
}
```

### 4.2. ایجاد `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4.3. ایجاد `tsconfig.node.json`

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

### 4.4. ایجاد `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
})
```

### 4.5. ایجاد `index.html`

در ریشه پروژه (نه در src):

```html
<!doctype html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>باربری بهار - سامانه اسباب‌کشی آنلاین</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 4.6. ایجاد `src/main.tsx`

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from './components/ui/sonner'
import App from './App.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="top-center" />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
```

### 4.7. ایجاد ساختار `src`

فایل‌های موجود را به ساختار زیر منتقل کنید:

```bash
# در ویندوز (PowerShell یا CMD)
mkdir src
move App.tsx src\
move components src\
move pages src\
move contexts src\
move types src\
move styles src\
move services src\
move constants src\

# در Mac/Linux
mkdir src
mv App.tsx src/
mv components src/
mv pages src/
mv contexts src/
mv types src/
mv styles src/
mv services src/
mv constants src/
```

### 4.8. ایجاد `public/vite.svg`

پوشه `public` را ایجاد کنید و یک آیکون ساده در `public/vite.svg` قرار دهید (یا از آیکون پیش‌فرض Vite استفاده کنید).

---

## 5. نصب Dependencies

### گام 1: باز کردن Terminal/Command Prompt

**Windows:**
- راست کلیک روی پوشه پروژه → "Open in Terminal"
- یا: `Win + R` → `cmd` → `cd path\to\project`

**Mac:**
- راست کلیک روی پوشه پروژه → "New Terminal at Folder"
- یا در Terminal: `cd /path/to/project`

**VS Code:**
- `Ctrl + ` (backtick) برای باز کردن Terminal داخلی

### گام 2: نصب پکیج‌ها

```bash
npm install
```

این دستور تمام dependencies از `package.json` را نصب می‌کند.

**⏱️ زمان تقریبی:** 2-5 دقیقه (بسته به سرعت اینترنت)

**خروجی موفق:**
```
added 1234 packages, and audited 1235 packages in 2m

123 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### گام 3: بررسی نصب

```bash
# لیست پکیج‌های نصب شده
npm list --depth=0

# چک کردن پکیج خاص
npm list react
npm list tailwindcss
```

---

## 6. اجرای پروژه

### روش 1: حالت Development (توسعه)

```bash
npm run dev
```

**خروجی موفق:**
```
  VITE v5.4.3  ready in 523 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
  ➜  press h + enter to show help
```

### روش 2: باز کردن در مرورگر

1. مرورگر را باز کنید
2. به آدرس `http://localhost:5173` بروید
3. صفحه اصلی باربری بهار باید لود شود ✅

### روش 3: Build برای Production

```bash
# ساخت فایل‌های نهایی
npm run build

# مشاهده نسخه Production
npm run preview
```

فایل‌های build شده در پوشه `dist/` قرار می‌گیرند.

---

## 7. رفع مشکلات احتمالی

### ❌ خطا: `npm: command not found`

**راه حل:**
- Node.js را نصب کنید: [nodejs.org](https://nodejs.org/)
- Terminal را ری‌استارت کنید
- سیستم را ری‌استارت کنید

---

### ❌ خطا: `Cannot find module 'react'`

**راه حل:**
```bash
# پاک کردن node_modules و نصب مجدد
rm -rf node_modules package-lock.json
npm install

# در ویندوز:
rmdir /s /q node_modules
del package-lock.json
npm install
```

---

### ❌ خطا: `Port 5173 is already in use`

**راه حل 1 - تغییر پورت:**

در `vite.config.ts`:
```typescript
export default defineConfig({
  // ...
  server: {
    port: 3000, // تغییر به پورت دیگر
    host: true,
  },
})
```

**راه حل 2 - کشتن پروسه:**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID [شماره PID] /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

---

### ❌ خطا: `Failed to resolve import "@/..."`

**راه حل:**

بررسی کنید که `vite.config.ts` به درستی تنظیم شده:

```typescript
import path from 'path'

export default defineConfig({
  // ...
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

و در `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

### ❌ خطا: Tailwind CSS کار نمی‌کند

**راه حل:**

1. بررسی `styles/globals.css`:
```css
@import "tailwindcss";

@theme {
  /* ... */
}
```

2. بررسی import در `main.tsx`:
```typescript
import './styles/globals.css'
```

3. پاک کردن cache و ری‌استارت:
```bash
rm -rf node_modules/.vite
npm run dev
```

---

### ❌ خطا: فونت ایران‌سنس لود نمی‌شود

**راه حل:**

فونت‌ها از CDN لود می‌شوند. اگر اینترنت آفلاین است:

1. فونت‌ها را دانلود کنید
2. در `public/fonts/` قرار دهید
3. در `globals.css` تغییر دهید:

```css
@font-face {
  font-family: 'IRANSans';
  src: url('/fonts/IRANSans.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

---

### ❌ خطا: `EACCES: permission denied`

**راه حل (Mac/Linux):**
```bash
sudo chown -R $USER:$USER .
npm install
```

---

### ❌ اپلیکیشن صفحه سفید نشان می‌دهد

**راه حل:**

1. باز کردن Console در مرورگر (`F12` → Console)
2. بررسی خطاها
3. اطمینان از اینکه `src/main.tsx` به درستی فایل CSS را import می‌کند
4. بررسی `index.html` که به درستی به `src/main.tsx` لینک شده

---

### ❌ خطا: TypeScript errors

**راه حل موقت:**
```bash
# اجرا بدون type checking
npm run dev -- --host
```

**راه حل دائمی:**
```bash
# بررسی خطاهای TypeScript
npx tsc --noEmit

# رفع خطاها یکی یکی
```

---

## 8. دستورات مفید

### دستورات npm:

```bash
# اجرای development server
npm run dev

# ساخت برای production
npm run build

# پیش‌نمایش build
npm run preview

# بررسی کد با ESLint
npm run lint

# نصب پکیج جدید
npm install package-name

# نصب پکیج به عنوان devDependency
npm install --save-dev package-name

# حذف پکیج
npm uninstall package-name

# آپدیت تمام پکیج‌ها
npm update

# بررسی پکیج‌های قدیمی
npm outdated

# پاک کردن cache
npm cache clean --force
```

### دستورات Vite:

```bash
# اجرا با پورت خاص
npm run dev -- --port 3000

# اجرا با host
npm run dev -- --host

# اجرا با HTTPS
npm run dev -- --https

# اجرا با clearScreen: false
npm run dev -- --clearScreen false
```

---

## 9. تنظیمات اختیاری

### 9.1. تنظیم VS Code

ایجاد `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### 9.2. تنظیم Prettier (اختیاری)

ایجاد `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

### 9.3. تنظیم ESLint (اختیاری)

ایجاد `.eslintrc.cjs`:

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
}
```

### 9.4. تنظیم Git Ignore

ایجاد `.gitignore`:

```gitignore
# dependencies
node_modules
.pnp
.pnp.js

# testing
coverage

# production
dist
build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# editor directories and files
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Vite
.vite
*.local
```

---

## 10. اتصال به بک‌اند

وقتی بک‌اند آماده شد:

### 10.1. ایجاد فایل Environment

ایجاد `.env.local` در ریشه پروژه:

```env
VITE_API_BASE_URL=https://localhost:5001/api
VITE_SIGNALR_HUB_URL=https://localhost:5001/hubs
```

### 10.2. ایجاد سرویس API

ایجاد `src/services/api.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:5001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor برای افزودن Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor برای مدیریت خطاها
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 10.3. جایگزینی Mock Data

در `src/contexts/AuthContext.tsx`:

```typescript
import api from '../services/api';

// جایگزین کردن mock login با API واقعی:
const login = async (phoneNumber: string, otp: string): Promise<void> => {
  const response = await api.post('/Auth/login', { phoneNumber, otp });
  const { token, ...userData } = response.data.data;
  
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
  setUser(userData);
};
```

---

## ✅ چک‌لیست نهایی

پس از تمام مراحل، بررسی کنید:

- [x] Node.js نصب شده (v18+)
- [x] پروژه Extract شده
- [x] فایل‌های ضروری (`package.json`, `vite.config.ts`, `index.html`, `main.tsx`) ایجاد شده
- [x] ساختار `src/` به درستی سازماندهی شده
- [x] `npm install` بدون خطا اجرا شد
- [x] `npm run dev` پروژه را اجرا می‌کند
- [x] در مرورگر `http://localhost:5173` صفحه اصلی نمایش داده می‌شود
- [x] صفحه لاگین کار می‌کند
- [x] منوها و ناوبری کار می‌کند
- [x] فونت فارسی به درستی نمایش داده می‌شود
- [x] راست‌چین بودن درست است

---

## 🎉 تبریک!

پروژه فرانت‌اند شما با موفقیت اجرا شد!

### مراحل بعدی:

1. ✅ بک‌اند را بر اساس `BACKEND_IMPLEMENTATION_GUIDE.md` بسازید
2. ✅ فایل `.env.local` را برای اتصال به بک‌اند ایجاد کنید
3. ✅ Mock Data را با API واقعی جایگزین کنید
4. ✅ تست کامل سیستم را انجام دهید

---

## 📞 پشتیبانی

اگر با مشکل خاصی مواجه شدید:

1. خطای دقیق را از Console مرورگر کپی کنید (`F12` → Console)
2. خطای Terminal را کپی کنید
3. نسخه Node.js خود را چک کنید: `node --version`
4. مطمئن شوید تمام فایل‌های ضروری موجود هستند

---

**نسخه راهنما:** 1.0.0  
**تاریخ آخرین بروزرسانی:** دی ۱۴۰۳  
**سازگار با:** React 18, Vite 5, Tailwind CSS 4
