# صفحه مسیریابی فعال راننده - ActiveTripNavigation

## نمای کلی

صفحه **مسیریابی فعال (Active Trip Navigation)** یک صفحه تمام‌صفحه و Real-time برای مدیریت و ردیابی سفر فعال راننده است. این صفحه شامل نقشه زنده، آمار لحظه‌ای، مراحل سفر، و تمام ابزارهای لازم برای مدیریت سفر می‌باشد.

---

## ویژگی‌های اصلی

### 1️⃣ **Header ثابت** 📌

Header همیشه در بالای صفحه ثابت است:

```tsx
<div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Navigation className="h-5 w-5" />
      <div>
        <h2>سفر فعال</h2>
        <Badge>{isPaused ? 'متوقف' : 'در حال انجام'}</Badge>
      </div>
    </div>
    <Button onClick={handlePauseResume}>
      {isPaused ? 'ادامه' : 'توقف'}
    </Button>
  </div>
</div>
```

**ویژگی‌ها**:
- Sticky positioning
- Backdrop blur effect
- Badge وضعیت (در حال انجام / متوقف)
- دکمه توقف/ادامه سفر
- نمایش شماره سفارش

---

### 2️⃣ **نقشه تعاملی** 🗺️

نقشه با نسبت 16:9 و انیمیشن زنده:

```tsx
<Card className="overflow-hidden">
  <div className="relative aspect-[16/9] bg-gradient-to-br from-blue-50 to-blue-100">
    {/* Simulated Map */}
    <div className="absolute inset-0">
      {/* Origin */}
      <div className="absolute left-0">
        <Home className="h-6 w-6 text-white" />
        <p>مبدا</p>
      </div>

      {/* Route Line with Current Position */}
      <div className="absolute left-12 right-12 bg-gradient-to-r from-green-500 via-blue-500 to-red-500">
        <div style={{ left: `${distanceProgress}%` }} className="animate-pulse">
          <Truck className="h-4 w-4" />
        </div>
      </div>

      {/* Destination */}
      <div className="absolute right-0">
        <Target className="h-6 w-6 text-white" />
        <p>مقصد</p>
      </div>
    </div>
  </div>
</Card>
```

**عناصر نقشه**:

#### 🟢 مبدا (Origin):
- آیکون خانه سبز
- نمایش موقعیت شروع

#### 🔴 مقصد (Destination):
- آیکون هدف قرمز
- نمایش موقعیت پایان

#### 🚚 موقعیت فعلی:
- آیکون کامیون آبی
- انیمیشن Pulse
- حرکت خودکار روی خط مسیر
- محاسبه position بر اساس `distanceProgress`

#### 📊 Overlay‌ها:

**سمت چپ بالا**:
```tsx
<div className="absolute left-4 top-4 space-y-2">
  {/* سرعت فعلی */}
  <div className="rounded-lg bg-background/90 backdrop-blur">
    <Gauge /> {tripStats.currentSpeed} km/h
  </div>
  
  {/* زمان سپری شده */}
  <div className="rounded-lg bg-background/90 backdrop-blur">
    <Clock /> {tripStats.elapsedTime} دقیقه
  </div>
</div>
```

**سمت راست بالا**:
```tsx
<div className="absolute right-4 top-4">
  <div className="rounded-lg bg-background/90 backdrop-blur">
    <p className="text-3xl font-bold">{tripStats.remainingDistance}</p>
    <p className="text-xs">کیلومتر باقیمانده</p>
  </div>
</div>
```

**پایین وسط - ETA**:
```tsx
<div className="absolute bottom-4 left-1/2 -translate-x-1/2">
  <div className="rounded-lg bg-background/90 backdrop-blur">
    <p>زمان رسیدن تقریبی</p>
    <p className="text-xl font-bold">{formatTime(tripStats.remainingTime)}</p>
  </div>
</div>
```

---

### 3️⃣ **آمار لحظه‌ای** 📊

4 کارت آمار با به‌روزرسانی Real-time:

```tsx
const [tripStats, setTripStats] = useState({
  elapsedTime: 25,        // زمان سپری شده (دقیقه)
  remainingDistance: 6.8, // مسافت باقیمانده (کیلومتر)
  remainingTime: 20,      // زمان باقیمانده (دقیقه)
  currentSpeed: 42,       // سرعت فعلی (km/h)
  avgSpeed: 38,           // میانگین سرعت
  distanceCovered: 5.7,   // مسافت طی شده
});
```

#### کارت‌های آمار:

**1. مسافت طی شده** 📍:
```tsx
<Card>
  <div className="flex items-center gap-2">
    <MapPin className="h-5 w-5 text-blue-600" />
    <div>
      <p>طی شده</p>
      <p className="font-bold">{tripStats.distanceCovered.toFixed(1)} km</p>
    </div>
  </div>
</Card>
```

**2. زمان سپری شده** ⏰:
- آیکون ساعت سبز
- نمایش به صورت "25 دقیقه" یا "1س 25د"

**3. میانگین سرعت** 📈:
- آیکون Activity بنفش
- نمایش به km/h

**4. کمیسیون** 💰:
- آیکون دلار زرد
- نمایش به صورت "180K" (180,000 تومان)

---

### 4️⃣ **به‌روزرسانی Real-time** ⚡

استفاده از `useEffect` برای شبیه‌سازی داده‌های زنده:

```tsx
useEffect(() => {
  if (!isPaused && isTracking) {
    const interval = setInterval(() => {
      setTripStats((prev) => ({
        ...prev,
        elapsedTime: prev.elapsedTime + 0.016,           // +1 second
        remainingDistance: Math.max(0, prev.remainingDistance - 0.01),
        remainingTime: Math.max(0, prev.remainingTime - 0.016),
        currentSpeed: Math.floor(Math.random() * 20) + 35, // 35-55 km/h
        distanceCovered: prev.distanceCovered + 0.01,
      }));
    }, 1000); // هر 1 ثانیه

    return () => clearInterval(interval);
  }
}, [isPaused, isTracking]);
```

**منطق**:
- هر 1 ثانیه آپدیت می‌شود
- فقط زمانی که سفر متوقف نباشد
- سرعت به صورت رندوم بین 35-55 km/h
- مسافت به تدریج کاهش می‌یابد

---

### 5️⃣ **مراحل سفر (Trip Stages)** 🎯

8 مرحله با Progress Bar و Timeline:

```tsx
const tripStages = [
  { id: 1, key: 'started', label: 'شروع سفر', icon: Play },
  { id: 2, key: 'en-route-origin', label: 'در مسیر مبدا', icon: Navigation },
  { id: 3, key: 'arrived-origin', label: 'رسیدن به مبدا', icon: MapPin },
  { id: 4, key: 'loading', label: 'بارگیری', icon: Package },
  { id: 5, key: 'en-route-destination', label: 'در مسیر مقصد', icon: Truck },
  { id: 6, key: 'arrived-destination', label: 'رسیدن به مقصد', icon: Target },
  { id: 7, key: 'unloading', label: 'تخلیه بار', icon: Package },
  { id: 8, key: 'completed', label: 'اتمام سفر', icon: Flag },
];
```

#### Progress Bar:
```tsx
const progressPercentage = (currentStage / tripStages.length) * 100;

<Progress value={progressPercentage} className="h-3" />
```

#### Timeline:
```tsx
{tripStages.map((stage, index) => {
  const isCompleted = index < currentStage - 1;
  const isActive = index === currentStage - 1;
  
  return (
    <div className={`flex items-center gap-3 p-3 ${
      isActive ? 'border-primary bg-primary/5' : ''
    }`}>
      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
        isCompleted ? 'bg-green-100' :
        isActive ? 'bg-primary' : 'bg-muted'
      }`}>
        {isCompleted ? (
          <CheckCircle2 className="text-green-600" />
        ) : (
          <stage.icon />
        )}
      </div>
      <span>{stage.label}</span>
      {isActive && <Badge>فعال</Badge>}
    </div>
  );
})}
```

**حالت‌های مرحله**:
- ✅ **تکمیل شده** (Completed): آیکون چک مارک سبز
- 🔵 **فعال** (Active): رنگ Primary، Badge "فعال"
- ⚪ **در انتظار** (Pending): رنگ خاکستری

#### دکمه مرحله بعد:
```tsx
<Button onClick={handleNextStage} disabled={isPaused}>
  <CheckCircle2 />
  مرحله بعد
  <ChevronRight />
</Button>
```

**رفتار**:
- کلیک → رفتن به مرحله بعدی
- Toast موفقیت
- وقتی به مرحله آخر رسید → باز کردن Dialog تکمیل سفر

---

### 6️⃣ **اطلاعات مشتری** 👤

```tsx
<Card>
  <CardHeader>
    <CardTitle>اطلاعات مشتری</CardTitle>
    <Button onClick={() => setShowCustomerInfoDialog(true)}>
      جزئیات بیشتر
    </Button>
  </CardHeader>
  <CardContent>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={customer.avatar} />
          <AvatarFallback>{customer.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{customer.name}</p>
          <p className="text-sm text-muted-foreground">{customer.phone}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={() => handleCallCustomer(phone)}>
          <Phone />
        </Button>
        <Button variant="outline" size="icon">
          <MessageSquare />
        </Button>
      </div>
    </div>

    {/* Notes Alert */}
    {notes && (
      <Alert>
        <AlertCircle />
        <AlertDescription>{notes}</AlertDescription>
      </Alert>
    )}
  </CardContent>
</Card>
```

**دکمه‌ها**:
- 📞 **تماس**: باز کردن Dialer با `tel:` URI
- 💬 **پیام**: باز کردن پیام‌رسان
- 📋 **جزئیات بیشتر**: باز کردن Dialog کامل

---

### 7️⃣ **اطلاعات مسیر** 📍

دو کارت برای مبدا و مقصد:

```tsx
<div className="grid gap-3 md:grid-cols-2">
  {/* مبدا */}
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <div className="bg-green-100 rounded-full">
          <div className="h-2 w-2 rounded-full bg-green-600" />
        </div>
        مبدا
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="font-medium">{origin.address}</p>
      <div className="text-xs text-muted-foreground">
        <span>طبقه {origin.floor}</span>
        <span>•</span>
        <span>{origin.elevator ? 'آسانسور دارد' : 'بدون آسانسور'}</span>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <span>تماس:</span>
        <Button variant="link" onClick={() => handleCallCustomer(origin.contactPhone)}>
          {origin.contactPhone}
        </Button>
      </div>
    </CardContent>
  </Card>

  {/* مقصد - مشابه */}
</div>
```

**اطلاعات نمایش داده شده**:
- 📍 آدرس کامل
- 🏢 شماره طبقه
- 🛗 وجود/عدم وجود آسانسور
- 📞 شماره تماس (کلیک برای تماس)

---

### 8️⃣ **دکمه‌های اقدام** ⚙️

3 دکمه اصلی:

```tsx
<div className="grid gap-3 md:grid-cols-3">
  {/* گزارش مشکل */}
  <Button variant="outline" onClick={() => setShowIssueDialog(true)}>
    <AlertCircle />
    گزارش مشکل
  </Button>

  {/* ثبت عکس */}
  <Button variant="outline">
    <Camera />
    ثبت عکس
  </Button>

  {/* مسیریابی خارجی */}
  <Button variant="outline" onClick={handleOpenExternalMap}>
    <Navigation />
    مسیریابی خارجی
  </Button>
</div>
```

---

### 9️⃣ **Dialog: جزئیات کامل** 📋

```tsx
<Dialog open={showCustomerInfoDialog}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>جزئیات کامل سفارش</DialogTitle>
    </DialogHeader>
    <ScrollArea className="max-h-[600px]">
      <div className="space-y-4">
        {/* کارت مشتری */}
        <Card>
          <CardHeader>مشتری</CardHeader>
          <CardContent>
            <Avatar />
            <p>{customer.name}</p>
            <p>{customer.phone}</p>
          </CardContent>
        </Card>

        {/* کارت جزئیات خدمت */}
        <Card>
          <CardHeader>جزئیات خدمت</CardHeader>
          <CardContent>
            <div>نوع خدمت: {serviceType}</div>
            <div>تعداد کارگر: {workers}</div>
            <div>مسافت کل: {totalDistance}</div>
            <div>زمان تخمینی: {estimatedDuration}</div>
          </CardContent>
        </Card>

        {/* کارت لوازم */}
        <Card>
          <CardHeader>لوازم حمل</CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {items.map(item => (
                <Badge variant="secondary">{item}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* کارت مالی */}
        <Card>
          <CardHeader>اطلاعات مالی</CardHeader>
          <CardContent>
            <div>کرایه کل: {price.toLocaleString('fa-IR')}</div>
            <div>کمیسیون شما (15%): {commission.toLocaleString('fa-IR')}</div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  </DialogContent>
</Dialog>
```

---

### 🔟 **Dialog: تکمیل سفر** ✅

```tsx
<Dialog open={showCompleteDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>
        <CheckCircle2 className="text-green-600" />
        تکمیل سفر
      </DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      {/* Alert کمیسیون */}
      <Alert>
        <DollarSign />
        <AlertDescription>
          کمیسیون شما: <strong>{commission.toLocaleString('fa-IR')} تومان</strong>
        </AlertDescription>
      </Alert>

      {/* یادداشت */}
      <div>
        <Label>یادداشت (اختیاری)</Label>
        <Textarea
          value={completionNotes}
          onChange={(e) => setCompletionNotes(e.target.value)}
          placeholder="توضیحات تکمیلی درباره سفر..."
          rows={3}
        />
      </div>
    </div>
    <DialogFooter>
      <Button variant="outline">انصراف</Button>
      <Button onClick={handleCompleteTrip}>
        <CheckCircle2 />
        تکمیل سفر
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**رفتار**:
- نمایش کمیسیون نهایی
- امکان افزودن یادداشت
- تایید نهایی
- Toast موفقیت
- هدایت به صفحه درآمدها یا داشبورد

---

### 1️⃣1️⃣ **Dialog: گزارش مشکل** ⚠️

```tsx
<Dialog open={showIssueDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>
        <AlertCircle className="text-red-600" />
        گزارش مشکل
      </DialogTitle>
    </DialogHeader>
    <div>
      <Label>شرح مشکل *</Label>
      <Textarea
        value={issueDescription}
        onChange={(e) => setIssueDescription(e.target.value)}
        placeholder="لطفاً مشکل را با جزئیات توضیح دهید..."
        rows={4}
      />
    </div>
    <DialogFooter>
      <Button variant="outline">انصراف</Button>
      <Button variant="destructive" onClick={handleReportIssue}>
        <AlertCircle />
        ثبت گزارش
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Functions کلیدی

### 1. مدیریت مراحل:
```typescript
const handleNextStage = () => {
  if (currentStage < tripStages.length) {
    setCurrentStage(currentStage + 1);
    toast.success(`مرحله ${tripStages[currentStage].label} تکمیل شد`);
    
    if (currentStage === tripStages.length - 1) {
      setShowCompleteDialog(true);
      setIsTracking(false);
    }
  }
};
```

### 2. توقف/ادامه سفر:
```typescript
const handlePauseResume = () => {
  setIsPaused(!isPaused);
  toast.info(isPaused ? 'سفر از سر گرفته شد' : 'سفر متوقف شد');
};
```

### 3. تکمیل سفر:
```typescript
const handleCompleteTrip = () => {
  toast.success('سفر با موفقیت تکمیل شد');
  setShowCompleteDialog(false);
  // Navigate to earnings or dashboard
};
```

### 4. تماس با مشتری:
```typescript
const handleCallCustomer = (phone: string) => {
  window.location.href = `tel:${phone}`;
};
```

### 5. باز کردن نقشه خارجی:
```typescript
const handleOpenExternalMap = () => {
  const lat = mockActiveTrip.destination.lat;
  const lng = mockActiveTrip.destination.lng;
  window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
};
```

### 6. فرمت زمان:
```typescript
const formatTime = (minutes: number) => {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  return hrs > 0 ? `${hrs}س ${mins}د` : `${mins} دقیقه`;
};
```

---

## State Management

```typescript
// مرحله فعلی (1-8)
const [currentStage, setCurrentStage] = useState(5);

// وضعیت توقف
const [isPaused, setIsPaused] = useState(false);

// وضعیت ردیابی
const [isTracking, setIsTracking] = useState(true);

// Dialogs
const [showCompleteDialog, setShowCompleteDialog] = useState(false);
const [showIssueDialog, setShowIssueDialog] = useState(false);
const [showCustomerInfoDialog, setShowCustomerInfoDialog] = useState(false);

// Forms
const [completionNotes, setCompletionNotes] = useState('');
const [issueDescription, setIssueDescription] = useState('');

// آمار Real-time
const [tripStats, setTripStats] = useState({
  elapsedTime: 25,
  remainingDistance: 6.8,
  remainingTime: 20,
  currentSpeed: 42,
  avgSpeed: 38,
  distanceCovered: 5.7,
});
```

---

## Mock Data Structure

```typescript
const mockActiveTrip = {
  id: 'trip-001',
  orderNumber: 'BH-1234',
  
  customer: {
    name: 'علی محمدی',
    phone: '09123456789',
    avatar: '',
    rating: 4.5,
  },
  
  origin: {
    address: 'تهران، منطقه 5، خیابان آزادی، پلاک 123',
    lat: 35.6892,
    lng: 51.3890,
    floor: 3,
    elevator: true,
    contactPerson: 'علی محمدی',
    contactPhone: '09123456789',
  },
  
  destination: {
    address: 'تهران، منطقه 2، خیابان ولیعصر، پلاک 456',
    lat: 35.7219,
    lng: 51.4185,
    floor: 2,
    elevator: false,
    contactPerson: 'زهرا محمدی',
    contactPhone: '09121234567',
  },
  
  totalDistance: 12.5,
  estimatedDuration: 45,
  startTime: new Date('2024-11-08T10:00:00'),
  price: 1200000,
  commission: 180000,
  serviceType: 'اسباب‌کشی منزل',
  items: ['یخچال', 'ماشین لباسشویی', 'مبل راحتی', 'میز ناهارخوری'],
  notes: 'لطفاً دقیق باشید، لوازم شکستنی داریم',
  workers: 2,
};
```

---

## Responsive Design

### Desktop:
- Grid 2 ستونی برای مبدا/مقصد
- Grid 3 ستونی برای دکمه‌های اقدام
- Grid 4 ستونی برای کارت‌های آمار
- Sidebar برای Timeline

### Mobile:
- تمام کارت‌ها Full-width
- Header ثابت
- ScrollArea برای محتوا
- دکمه‌های Stack شده

```tsx
<div className="grid gap-3 md:grid-cols-2"> {/* مبدا/مقصد */}
<div className="grid gap-3 md:grid-cols-3"> {/* دکمه‌ها */}
<div className="grid gap-3 md:grid-cols-4"> {/* آمار */}
```

---

## Toast Messages

### ✅ موفقیت:
- "مرحله [نام مرحله] تکمیل شد"
- "سفر با موفقیت تکمیل شد"
- "مشکل گزارش شد"

### ℹ️ اطلاع:
- "سفر از سر گرفته شد"
- "سفر متوقف شد"

---

## Integration با Backend

### API Endpoints:
```
GET    /api/trips/{tripId}              // دریافت اطلاعات سفر
PUT    /api/trips/{tripId}/stage        // به‌روزرسانی مرحله
PUT    /api/trips/{tripId}/pause        // توقف سفر
PUT    /api/trips/{tripId}/resume       // ادامه سفر
POST   /api/trips/{tripId}/complete     // تکمیل سفر
POST   /api/trips/{tripId}/issues       // گزارش مشکل
GET    /api/trips/{tripId}/location     // دریافت موقعیت زنده
PUT    /api/trips/{tripId}/location     // ارسال موقعیت فعلی
```

### WebSocket برای Real-time:
```typescript
// اتصال به WebSocket
const ws = new WebSocket('wss://api.bahabarri.com/trips/live');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  setTripStats(data);
};

// ارسال موقعیت هر 5 ثانیه
setInterval(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      ws.send(JSON.stringify({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        speed: position.coords.speed,
      }));
    });
  }
}, 5000);
```

---

## Geolocation API

برای دریافت موقعیت واقعی راننده:

```typescript
useEffect(() => {
  if (navigator.geolocation && isTracking) {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed } = position.coords;
        
        // ارسال به سرور
        updateDriverLocation(latitude, longitude, speed);
        
        // محاسبه مسافت باقیمانده
        const remaining = calculateDistance(
          latitude,
          longitude,
          destination.lat,
          destination.lng
        );
        
        setTripStats(prev => ({
          ...prev,
          remainingDistance: remaining,
          currentSpeed: speed * 3.6, // m/s to km/h
        }));
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }
}, [isTracking]);
```

---

## امکانات آینده

- [ ] نقشه واقعی با Leaflet یا Google Maps
- [ ] ردیابی موقعیت واقعی با GPS
- [ ] نمایش ترافیک و مسیرهای جایگزین
- [ ] دریافت اعلان‌های Push
- [ ] چت زنده با مشتری
- [ ] ضبط صدا برای یادداشت
- [ ] آپلود عکس به صورت زنده
- [ ] نمایش پیش‌بینی زمان رسیدن دقیق‌تر
- [ ] محاسبه مصرف سوخت
- [ ] تشخیص خودکار رسیدن به مقصد
- [ ] یادآور برای مراحل
- [ ] حالت آفلاین با سینک بعدی
- [ ] نقشه حرارتی ترافیک
- [ ] پیشنهاد بهترین مسیر
- [ ] تاریخچه سرعت و مسیر

---

## Testing

### Test Cases:
1. شروع سفر و نمایش اطلاعات
2. به‌روزرسانی Real-time آمار
3. رفتن به مرحله بعدی
4. توقف و ادامه سفر
5. تکمیل تمام مراحل
6. گزارش مشکل
7. تماس با مشتری
8. باز کردن نقشه خارجی
9. نمایش جزئیات کامل
10. Responsive در موبایل

---

## مجوز

این فایل بخشی از پروژه باربری بهار است.
© 2024 All Rights Reserved.
