# رفع مشکل دکمه "شروع مسیر" 🔧

## مشکل
وقتی روی دکمه **"شروع مسیر"** کلیک می‌شد، هیچ اتفاقی نمی‌افتاد.

---

## علت
- `useNavigate` از `react-router-dom` import نشده بود
- تابع `handleStartTrip` تعریف نشده بود
- `onClick` به دکمه اضافه نشده بود

---

## تغییرات انجام شده

### 1️⃣ `/pages/driver/DriverDashboard.tsx`

#### ✅ Import useNavigate:
```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ اضافه شد
```

#### ✅ تعریف navigate و handler:
```typescript
export const DriverDashboard = () => {
  const navigate = useNavigate(); // ✅ اضافه شد
  const [driverStatus, setDriverStatus] = useState<'available' | 'busy' | 'offline'>(
    mockDriver.status as 'available' | 'busy' | 'offline'
  );

  const handleStatusChange = (newStatus: 'available' | 'busy' | 'offline') => {
    setDriverStatus(newStatus);
  };

  // ✅ تابع جدید
  const handleStartTrip = (orderId: string) => {
    navigate(`/driver/active-trip/${orderId}`);
  };
```

#### ✅ اضافه کردن onClick به دکمه:
```typescript
{order.status === OrderStatus.DRIVER_ASSIGNED && (
  <Button 
    className="gap-2" 
    onClick={() => handleStartTrip(order.id)} // ✅ اضافه شد
  >
    <Navigation className="h-4 w-4" />
    شروع مسیر
  </Button>
)}
```

---

### 2️⃣ `/pages/driver/DriverOrders.tsx`

#### ✅ Import useNavigate:
```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ اضافه شد
```

#### ✅ تعریف navigate:
```typescript
export const DriverOrders = () => {
  const navigate = useNavigate(); // ✅ اضافه شد
  const [activeTab, setActiveTab] = useState('available');
  ...
```

#### ✅ تغییر handleStartNavigation:
**قبل**:
```typescript
const handleStartNavigation = (orderId: string) => {
  toast.success('مسیریابی شروع شد'); // ❌ فقط Toast
};
```

**بعد**:
```typescript
const handleStartNavigation = (orderId: string) => {
  navigate(`/driver/active-trip/${orderId}`); // ✅ Navigate به صفحه
};
```

---

## نتیجه

### ✅ کارهایی که حالا کار می‌کنند:

1. **در DriverDashboard**:
   - کلیک روی دکمه "شروع مسیر" → هدایت به `/driver/active-trip/o1`
   
2. **در DriverOrders**:
   - کلیک روی دکمه "شروع مسیریابی" → هدایت به `/driver/active-trip/{orderId}`

---

## نحوه تست

### 1️⃣ تست در DriverDashboard:

1. به `/driver` بروید
2. در لیست "سفارشات امروز" سفارش اول را پیدا کنید
3. این سفارش باید Badge آبی "اختصاص داده شده" داشته باشد
4. روی دکمه **"شروع مسیر"** کلیک کنید
5. ✅ باید به صفحه `/driver/active-trip/o1` منتقل شوید

### 2️⃣ تست در DriverOrders:

1. به `/driver/orders` بروید
2. در تب **"اختصاص داده شده"** سفارش‌ها را ببینید
3. روی دکمه **"شروع مسیریابی"** کلیک کنید
4. ✅ باید به صفحه مسیریابی فعال منتقل شوید

---

## Mock Data

سفارش `o1` در `mockTodayOrders` دارای وضعیت `DRIVER_ASSIGNED` است:

```typescript
{
  id: 'o1',
  orderNumber: 'BH-1234',
  customer: {
    name: 'علی محمدی',
    phone: '09123456789',
  },
  origin: 'تهران، منطقه 5، خیابان آزادی',
  destination: 'تهران، منطقه 2، خیابان ولیعصر',
  distance: 12.5,
  estimatedDuration: 45,
  scheduledTime: new Date('2024-11-08T10:00:00'),
  price: 1200000,
  status: OrderStatus.DRIVER_ASSIGNED, // ✅ این سفارش دکمه "شروع مسیر" دارد
}
```

---

## Flow کامل

```mermaid
graph LR
    A[DriverDashboard] --> B{Click شروع مسیر}
    B --> C[handleStartTrip('o1')]
    C --> D[navigate('/driver/active-trip/o1')]
    D --> E[ActiveTripNavigation]
    
    F[DriverOrders] --> G{Click شروع مسیریابی}
    G --> H[handleStartNavigation('o1')]
    H --> D
```

---

## فایل‌های تغییر یافته

- ✅ `/pages/driver/DriverDashboard.tsx`
- ✅ `/pages/driver/DriverOrders.tsx`

---

## وضعیت

✅ **مشکل برطرف شد!**

دکمه "شروع مسیر" حالا به درستی کار می‌کند و کاربر را به صفحه **ActiveTripNavigation** هدایت می‌کند.

---

## توجه

- اگر هنوز هم مشکل دارید، مطمئن شوید که:
  1. ✅ Route در `App.tsx` تعریف شده است
  2. ✅ سفارش دارای وضعیت `DRIVER_ASSIGNED` است
  3. ✅ Browser cache را پاک کرده‌اید (Ctrl+Shift+R)

---

**تاریخ رفع**: 2024-11-08
**وضعیت**: ✅ Complete

© 2024 Baha Barri
