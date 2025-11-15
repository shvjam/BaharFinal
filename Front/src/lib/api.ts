import axios from 'axios';

// خواندن آدرس پایه API از متغیرهای محیطی
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:5001/api';

/**
 * یک نمونه axios با تنظیمات پیش‌فرض برای ارتباط با API بک‌اند.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor برای افزودن توکن JWT به هدر تمام درخواست‌ها.
 * این تابع قبل از ارسال هر درخواست اجرا می‌شود.
 */
api.interceptors.request.use(
  (config) => {
    // خواندن توکن از localStorage
    const token = localStorage.getItem('token');

    // اگر توکن وجود داشت، آن را به هدر Authorization اضافه کن
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // در صورت بروز خطا در تنظیم درخواست، آن را رد کن
    return Promise.reject(error);
  }
);

export default api;
