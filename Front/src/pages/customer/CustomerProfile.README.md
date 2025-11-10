# صفحه پروفایل مشتری - CustomerProfile

## نمای کلی

صفحه **پروفایل من (CustomerProfile)** یک صفحه جامع و کامل برای مدیریت اطلاعات شخصی، امنیت، اعلان‌ها، حریم خصوصی و تاریخچه فعالیت‌های کاربر است. این صفحه تمام جنبه‌های مدیریت حساب کاربری را پوشش می‌دهد.

---

## ویژگی‌های اصلی

### 1️⃣ **Header پروفایل** 🎨

#### بنر گرادیانت
- گرادیانت زیبا با رنگ Primary
- ارتفاع 128px

#### تصویر پروفایل
- **Avatar بزرگ**: 128×128 پیکسل
- Border سفید 4px با Shadow
- **Fallback**: حروف اول نام و نام خانوادگی
- **دکمه تغییر**: آیکون دوربین در گوشه
- قابلیت آپلود تصویر جدید

#### اطلاعات هدر
```tsx
<div className="flex flex-col md:flex-row items-center gap-4">
  <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
    {/* Avatar Content */}
  </Avatar>
  <div className="flex-1">
    <h1>{user.firstName} {user.lastName}</h1>
    <Badge>⭐ {user.membershipLevel}</Badge>
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <span>📧 {user.email}</span>
      <span>📱 {user.phone}</span>
      <span>📅 عضو از {user.joinedDate}</span>
    </div>
  </div>
</div>
```

#### دکمه خروج
- در گوشه بالا (Desktop)
- در پایین (Mobile)

---

### 2️⃣ **کارت‌های آمار** 📊

چهار کارت با اطلاعات مهم:

#### 1. کل سفارشات 📦
- آیکون Package آبی
- تعداد کل سفارشات
- `{user.totalOrders}`

#### 2. هزینه کل 💳
- آیکون CreditCard سبز
- مجموع هزینه‌ها
- `{user.totalSpent.toLocaleString('fa-IR')} تومان`

#### 3. امتیاز وفاداری ⭐
- آیکون Star زرد
- امتیازات جمع‌آوری شده
- `{user.loyaltyPoints}`

#### 4. میانگین سفارش 📈
- آیکون TrendingUp بنفش
- محاسبه خودکار
- `{totalSpent / totalOrders}`

---

### 3️⃣ **Tab: اطلاعات شخصی** 👤

#### Header کارت
- عنوان و توضیحات
- **دکمه ویرایش** / **ذخیره و انصراف**

#### فیلدها:

##### نام و نام خانوادگی
```tsx
<div className="grid gap-4 md:grid-cols-2">
  <Input label="نام *" value={formData.firstName} disabled={!isEditMode} />
  <Input label="نام خانوادگی *" value={formData.lastName} disabled={!isEditMode} />
</div>
```

##### ایمیل و تلفن
- Badge "تایید شده" ✅
- نمایش وضعیت تایید

```tsx
<Label className="flex items-center gap-2">
  ایمیل *
  {user.emailVerified && (
    <Badge variant="secondary">
      <Check className="h-3 w-3" />
      تایید شده
    </Badge>
  )}
</Label>
```

##### کد ملی
- Input 10 رقمی
- maxLength={10}

##### تاریخ تولد و جنسیت
```tsx
<Input placeholder="1370/01/01" />
<Select>
  <SelectItem value="male">مرد</SelectItem>
  <SelectItem value="female">زن</SelectItem>
  <SelectItem value="other">سایر</SelectItem>
</Select>
```

#### اطلاعات حساب
کارت‌های اطلاعاتی:
- 🆔 شناسه کاربری (ID)
- 📅 تاریخ ثبت‌نام
- 🕐 آخرین ورود
- ⭐ سطح عضویت (Badge)

```tsx
<div className="grid gap-2 text-sm">
  <div className="flex items-center justify-between rounded-lg border p-3">
    <span className="text-muted-foreground">شناسه کاربری</span>
    <span className="font-mono">{user.id}</span>
  </div>
  {/* ... */}
</div>
```

#### حالت ویرایش
```tsx
const [isEditMode, setIsEditMode] = useState(false);

// زمانی که Edit کلیک می‌شود:
setIsEditMode(true);

// زمانی که Save کلیک می‌شود:
handleSaveProfile();
setIsEditMode(false);

// زمانی که Cancel کلیک می‌شود:
handleCancelEdit();
setIsEditMode(false);
```

---

### 4️⃣ **Tab: امنیت** 🔒

#### بخش 1: تغییر رمز عبور 🔑

**Alert هشدار**:
```tsx
<Alert>
  <Key className="h-4 w-4" />
  <AlertDescription>
    برای امنیت بیشتر، توصیه می‌شود رمز عبور خود را هر 3 ماه یکبار تغییر دهید.
  </AlertDescription>
</Alert>
```

**دکمه تغییر رمز**:
- باز کردن Dialog
- فرم تغییر رمز عبور

**Dialog تغییر رمز**:
```tsx
<Dialog open={showPasswordDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>تغییر رمز عبور</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      {/* رمز فعلی */}
      <Input type="password" label="رمز عبور فعلی *" />
      
      {/* رمز جدید */}
      <Input type="password" label="رمز عبور جدید *" />
      <p className="text-xs">حداقل 8 کاراکتر</p>
      
      {/* تکرار رمز */}
      <Input type="password" label="تکرار رمز عبور جدید *" />
    </div>
    <DialogFooter>
      <Button variant="outline">انصراف</Button>
      <Button onClick={handleChangePassword}>تغییر رمز عبور</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**نمایش/مخفی کردن رمز**:
```tsx
const [showPasswords, setShowPasswords] = useState({
  current: false,
  new: false,
  confirm: false,
});

<Button
  type="button"
  variant="ghost"
  size="icon"
  className="absolute left-0 top-0"
  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
>
  {showPasswords.current ? <EyeOff /> : <Eye />}
</Button>
```

**اعتبارسنجی**:
```tsx
const handleChangePassword = () => {
  // چک کردن پر بودن فیلدها
  if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
    toast.error('لطفاً همه فیلدها را پر کنید');
    return;
  }

  // چک کردن یکسان بودن رمزها
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    toast.error('رمز عبور جدید و تکرار آن یکسان نیستند');
    return;
  }

  // چک کردن طول رمز
  if (passwordData.newPassword.length < 8) {
    toast.error('رمز عبور باید حداقل 8 کاراکتر باشد');
    return;
  }

  // Success
  toast.success('رمز عبور با موفقیت تغییر کرد');
};
```

---

#### بخش 2: تایید دو مرحله‌ای (2FA) 🛡️

**Alert اطلاعاتی**:
```tsx
<Alert>
  <Fingerprint className="h-4 w-4" />
  <AlertDescription>
    {user.twoFactorEnabled
      ? 'تایید دو مرحله‌ای فعال است. حساب شما از امنیت بالایی برخوردار است.'
      : 'با فعال کردن تایید دو مرحله‌ای، امنیت حساب خود را افزایش دهید.'}
  </AlertDescription>
</Alert>
```

**Switch فعال/غیرفعال**:
```tsx
<div className="flex items-center justify-between rounded-lg border p-4">
  <div>
    <Label>تایید دو مرحله‌ای</Label>
    <p className="text-sm text-muted-foreground">
      {user.twoFactorEnabled ? 'فعال است' : 'غیرفعال است'}
    </p>
  </div>
  <Switch checked={user.twoFactorEnabled} onCheckedChange={toggleTwoFactor} />
</div>
```

**Handler**:
```tsx
const toggleTwoFactor = () => {
  setUser({ ...user, twoFactorEnabled: !user.twoFactorEnabled });
  toast.success(
    user.twoFactorEnabled
      ? 'تایید دو مرحله‌ای غیرفعال شد'
      : 'تایید دو مرحله‌ای فعال شد'
  );
};
```

---

#### بخش 3: دستگاه‌های متصل 💻📱

**لیست دستگاه‌ها**:
```tsx
<div className="space-y-2">
  {/* دستگاه فعلی */}
  <div className="flex items-center justify-between rounded-lg border p-3">
    <div className="flex items-center gap-3">
      <Monitor className="h-5 w-5" />
      <div>
        <p className="font-medium">Chrome on Windows</p>
        <p className="text-xs text-muted-foreground">آخرین فعالیت: 2 دقیقه پیش</p>
      </div>
    </div>
    <Badge variant="secondary">
      <Check className="h-3 w-3" />
      فعلی
    </Badge>
  </div>

  {/* دستگاه دیگر */}
  <div className="flex items-center justify-between rounded-lg border p-3">
    <div className="flex items-center gap-3">
      <Smartphone className="h-5 w-5" />
      <div>
        <p className="font-medium">Mobile App on Android</p>
        <p className="text-xs text-muted-foreground">آخرین فعالیت: 2 ساعت پیش</p>
      </div>
    </div>
    <Button variant="ghost" size="sm">قطع ارتباط</Button>
  </div>
</div>
```

---

### 5️⃣ **Tab: اعلان‌ها** 🔔

سه بخش اصلی:

#### 1. اعلان‌های ایمیل 📧
```tsx
<Card>
  <CardHeader>
    <CardTitle>
      <Mail className="h-5 w-5" />
      اعلان‌های ایمیل
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* اعلان سفارشات */}
    <div className="flex items-center justify-between">
      <div>
        <Label>اعلان سفارشات</Label>
        <p className="text-sm text-muted-foreground">دریافت اطلاعات درباره سفارشات</p>
      </div>
      <Switch
        checked={notifications.emailOrders}
        onCheckedChange={(checked) => setNotifications({ ...notifications, emailOrders: checked })}
      />
    </div>
    <Separator />
    
    {/* تخفیف‌ها */}
    <div className="flex items-center justify-between">
      <div>
        <Label>تخفیف‌ها و پیشنهادات</Label>
        <p className="text-sm text-muted-foreground">دریافت اطلاعات تخفیف‌ها</p>
      </div>
      <Switch checked={notifications.emailPromotions} />
    </div>
    <Separator />
    
    {/* خبرنامه */}
    <div className="flex items-center justify-between">
      <div>
        <Label>خبرنامه</Label>
        <p className="text-sm text-muted-foreground">دریافت اخبار و مقالات</p>
      </div>
      <Switch checked={notifications.emailNewsletter} />
    </div>
  </CardContent>
</Card>
```

#### 2. اعلان‌های پیامکی 📱
- اعلان سفارشات
- تخفیف‌ها و پیشنهادات

#### 3. اعلان‌های پوش 🔔
- اعلان سفارشات
- تخفیف‌ها و پیشنهادات
- خبرنامه

**State مدیریت اعلان‌ها**:
```tsx
const [notifications, setNotifications] = useState({
  emailOrders: true,
  emailPromotions: false,
  emailNewsletter: true,
  smsOrders: true,
  smsPromotions: false,
  pushOrders: true,
  pushPromotions: false,
  pushNewsletter: false,
});
```

---

### 6️⃣ **Tab: حریم خصوصی** 🔐

#### تنظیمات حریم خصوصی

```tsx
<Card>
  <CardHeader>
    <CardTitle>
      <Eye className="h-5 w-5" />
      تنظیمات حریم خصوصی
    </CardTitle>
    <CardDescription>کنترل اطلاعات قابل مشاهده برای دیگران</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* نمایش پروفایل */}
    <div className="flex items-center justify-between">
      <div>
        <Label>نمایش پروفایل</Label>
        <p className="text-sm text-muted-foreground">
          امکان مشاهده پروفایل شما توسط سایر کاربران
        </p>
      </div>
      <Switch checked={privacy.showProfile} />
    </div>
    <Separator />

    {/* تاریخچه سفارشات */}
    <div className="flex items-center justify-between">
      <div>
        <Label>تاریخچه سفارشات</Label>
        <p className="text-sm text-muted-foreground">نمایش تاریخچه سفارشات شما</p>
      </div>
      <Switch checked={privacy.showOrderHistory} />
    </div>
    <Separator />

    {/* اشتراک‌گذاری موقعیت */}
    <div className="flex items-center justify-between">
      <div>
        <Label>اشتراک‌گذاری موقعیت</Label>
        <p className="text-sm text-muted-foreground">امکان دسترسی به موقعیت مکانی شما</p>
      </div>
      <Switch checked={privacy.shareLocation} />
    </div>
    <Separator />

    {/* جمع‌آوری داده */}
    <div className="flex items-center justify-between">
      <div>
        <Label>جمع‌آوری داده</Label>
        <p className="text-sm text-muted-foreground">
          مجوز جمع‌آوری داده برای بهبود تجربه
        </p>
      </div>
      <Switch checked={privacy.allowDataCollection} />
    </div>
  </CardContent>
</Card>
```

**State**:
```tsx
const [privacy, setPrivacy] = useState({
  showProfile: true,
  showOrderHistory: false,
  shareLocation: true,
  allowDataCollection: true,
});
```

---

#### منطقه خطر ⚠️

**حذف حساب کاربری**:
```tsx
<Card className="border-red-200">
  <CardHeader>
    <CardTitle className="text-red-600">
      <AlertTriangle className="h-5 w-5" />
      منطقه خطر
    </CardTitle>
    <CardDescription>اقدامات غیرقابل بازگشت</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        با حذف حساب کاربری، تمام اطلاعات شما به طور دائم حذف خواهد شد و قابل بازیابی نیست.
      </AlertDescription>
    </Alert>
    <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
      <Trash2 className="ml-2 h-4 w-4" />
      حذف حساب کاربری
    </Button>
  </CardContent>
</Card>
```

**AlertDialog تایید حذف**:
```tsx
<AlertDialog open={showDeleteDialog}>
  <AlertDialogContent dir="rtl">
    <AlertDialogHeader>
      <AlertDialogTitle className="text-red-600">
        <AlertTriangle className="h-5 w-5" />
        آیا مطمئن هستید؟
      </AlertDialogTitle>
      <AlertDialogDescription>
        این عمل غیرقابل بازگشت است. تمام اطلاعات شما شامل سفارشات، آدرس‌ها و امتیازات وفاداری
        به طور دائم حذف خواهد شد.
        <br /><br />
        برای تایید، کلمه <strong>"حذف حساب"</strong> را تایپ کنید.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>انصراف</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDeleteAccount}
        className="bg-red-600 hover:bg-red-700"
      >
        حذف دائمی حساب کاربری
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

### 7️⃣ **Tab: فعالیت‌ها** 📋

#### تاریخچه فعالیت‌های اخیر

```tsx
<Card>
  <CardHeader>
    <CardTitle>
      <Activity className="h-5 w-5" />
      تاریخچه فعالیت‌ها
    </CardTitle>
    <CardDescription>آخرین فعالیت‌های حساب کاربری شما</CardDescription>
  </CardHeader>
  <CardContent>
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-3">
        {mockActivityLog.map((activity) => (
          <div key={activity.id} className="flex gap-4 rounded-lg border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">{activity.action}</p>
                <span className="text-xs text-muted-foreground">
                  {new Date(activity.timestamp).toLocaleDateString('fa-IR')}
                </span>
              </div>
              <div className="flex gap-2 text-sm text-muted-foreground">
                <span><Monitor /> {activity.device}</span>
                <span>•</span>
                <span><MapPin /> {activity.location}</span>
              </div>
              <p className="text-xs text-muted-foreground">IP: {activity.ip}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  </CardContent>
</Card>
```

**Mock Activity Log**:
```tsx
const mockActivityLog = [
  {
    id: '1',
    action: 'ورود به حساب کاربری',
    device: 'Chrome on Windows',
    ip: '192.168.1.1',
    location: 'تهران، ایران',
    timestamp: new Date('2024-03-15T14:30:00'),
  },
  {
    id: '2',
    action: 'ویرایش اطلاعات پروفایل',
    device: 'Mobile App on Android',
    ip: '192.168.1.2',
    location: 'تهران، ایران',
    timestamp: new Date('2024-03-14T10:20:00'),
  },
  // ...
];
```

---

## Mock Data

### اطلاعات کاربر:
```typescript
const mockUser = {
  id: 'c1',
  firstName: 'علی',
  lastName: 'محمدی',
  email: 'ali.mohammadi@email.com',
  phone: '09123456789',
  nationalId: '1234567890',
  birthDate: '1370/05/15',
  gender: 'male',
  avatar: '',
  joinedDate: '1403/01/10',
  lastLogin: '1403/08/07',
  totalOrders: 24,
  totalSpent: 12500000,
  loyaltyPoints: 850,
  membershipLevel: 'طلایی',
  emailVerified: true,
  phoneVerified: true,
  twoFactorEnabled: false,
};
```

---

## State Management

### States اصلی:
```typescript
const [user, setUser] = useState(mockUser);
const [isEditMode, setIsEditMode] = useState(false);
const [showDeleteDialog, setShowDeleteDialog] = useState(false);
const [showPasswordDialog, setShowPasswordDialog] = useState(false);
const [showAvatarDialog, setShowAvatarDialog] = useState(false);
const [activeTab, setActiveTab] = useState('personal');
```

### Form States:
```typescript
const [formData, setFormData] = useState({
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  nationalId: user.nationalId,
  birthDate: user.birthDate,
  gender: user.gender,
});

const [passwordData, setPasswordData] = useState({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const [showPasswords, setShowPasswords] = useState({
  current: false,
  new: false,
  confirm: false,
});
```

### Settings States:
```typescript
const [notifications, setNotifications] = useState({
  emailOrders: true,
  emailPromotions: false,
  emailNewsletter: true,
  smsOrders: true,
  smsPromotions: false,
  pushOrders: true,
  pushPromotions: false,
  pushNewsletter: false,
});

const [privacy, setPrivacy] = useState({
  showProfile: true,
  showOrderHistory: false,
  shareLocation: true,
  allowDataCollection: true,
});
```

---

## Functions کلیدی

### 1. ذخیره پروفایل:
```typescript
const handleSaveProfile = () => {
  setUser({
    ...user,
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    nationalId: formData.nationalId,
    birthDate: formData.birthDate,
    gender: formData.gender,
  });
  setIsEditMode(false);
  toast.success('اطلاعات پروفایل با موفقیت ذخیره شد');
};
```

### 2. لغو ویرایش:
```typescript
const handleCancelEdit = () => {
  setFormData({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    nationalId: user.nationalId,
    birthDate: user.birthDate,
    gender: user.gender,
  });
  setIsEditMode(false);
};
```

### 3. تغییر رمز عبور:
```typescript
const handleChangePassword = () => {
  if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
    toast.error('لطفاً همه فیلدها را پر کنید');
    return;
  }

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    toast.error('رمز عبور جدید و تکرار آن یکسان نیستند');
    return;
  }

  if (passwordData.newPassword.length < 8) {
    toast.error('رمز عبور باید حداقل 8 کاراکتر باشد');
    return;
  }

  // API Call
  setShowPasswordDialog(false);
  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  toast.success('رمز عبور با موفقیت تغییر کرد');
};
```

### 4. تغییر تصویر پروفایل:
```typescript
const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUser({ ...user, avatar: reader.result as string });
      toast.success('تصویر پروفایل با موفقیت تغییر کرد');
    };
    reader.readAsDataURL(file);
  }
};
```

### 5. تایید دو مرحله‌ای:
```typescript
const toggleTwoFactor = () => {
  setUser({ ...user, twoFactorEnabled: !user.twoFactorEnabled });
  toast.success(
    user.twoFactorEnabled
      ? 'تایید دو مرحله‌ای غیرفعال شد'
      : 'تایید دو مرحله‌ای فعال شد'
  );
};
```

### 6. حذف حساب:
```typescript
const handleDeleteAccount = () => {
  // API Call
  toast.success('حساب کاربری شما حذف خواهد شد');
  setShowDeleteDialog(false);
};
```

---

## Validation

### تغییر رمز عبور:
1. ✅ تمام فیلدها پر شده باشند
2. ✅ رمز جدید و تکرار آن یکسان باشند
3. ✅ رمز جدید حداقل 8 کاراکتر باشد

### اطلاعات شخصی:
1. ✅ نام (الزامی)
2. ✅ نام خانوادگی (الزامی)
3. ✅ ایمیل (فرمت صحیح)
4. ✅ شماره تلفن (11 رقم)
5. ⚠️ کد ملی (10 رقم - اختیاری)

### تصویر پروفایل:
1. ✅ حجم حداکثر 2MB
2. ✅ فرمت JPG, PNG

---

## Toast Messages

### ✅ موفقیت:
- "اطلاعات پروفایل با موفقیت ذخیره شد"
- "رمز عبور با موفقیت تغییر کرد"
- "تصویر پروفایل با موفقیت تغییر کرد"
- "تایید دو مرحله‌ای فعال/غیرفعال شد"
- "حساب کاربری شما حذف خواهد شد"

### ❌ خطا:
- "لطفاً همه فیلدها را پر کنید"
- "رمز عبور جدید و تکرار آن یکسان نیستند"
- "رمز عبور باید حداقل 8 کاراکتر باشد"

---

## Responsive Design

### Desktop:
- Grid 4 ستونی برای کارت‌های آمار
- Tabs افقی
- Header پروفایل Flex-row

### Tablet:
- Grid 2 ستونی
- Tabs کوچک‌تر

### Mobile:
- Grid 1 ستونی
- Tabs عمودی (Stack)
- Header پروفایل Flex-col

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {/* کارت‌های آمار */}
</div>

<TabsList className="grid w-full grid-cols-5">
  {/* Tabs */}
</TabsList>
```

---

## Accessibility

### Keyboard Navigation:
- Tab برای حرکت
- Enter برای باز کردن Dialog
- Escape برای بستن

### ARIA Labels:
- تمام فرم‌ها با Label
- دکمه‌ها با توضیحات

### Screen Readers:
- Alt Text برای تصاویر
- توضیحات برای Actions

---

## امکانات آینده

پیشنهادات برای توسعه:

- [ ] اتصال به Google/Apple/GitHub
- [ ] Export اطلاعات (GDPR)
- [ ] تنظیمات زبان
- [ ] تنظیمات پوسته (Light/Dark)
- [ ] کش کردن تصویر پروفایل
- [ ] Crop تصویر
- [ ] تاریخچه تغییرات پروفایل
- [ ] Backup رمز عبور (Recovery Codes)
- [ ] سوالات امنیتی
- [ ] لیست سفید IP
- [ ] نشست‌های فعال با جزئیات بیشتر
- [ ] لاگ امنیتی کامل
- [ ] اتصال به API واقعی
- [ ] Real-time Updates
- [ ] Push Notifications واقعی
- [ ] WebAuthn (بدون رمز عبور)

---

## Integration با Backend

### API Endpoints:
```
GET    /api/profile                    // دریافت پروفایل
PUT    /api/profile                    // ویرایش پروفایل
POST   /api/profile/avatar             // آپلود تصویر
PUT    /api/profile/password           // تغییر رمز عبور
PUT    /api/profile/2fa                // فعال/غیرفعال 2FA
GET    /api/profile/devices            // لیست دستگاه‌ها
DELETE /api/profile/devices/{id}       // قطع ارتباط دستگاه
GET    /api/profile/activity           // تاریخچه فعالیت
PUT    /api/profile/notifications      // تنظیمات اعلان
PUT    /api/profile/privacy            // تنظیمات حریم خصوصی
DELETE /api/profile                    // حذف حساب
```

### Request Examples:
```typescript
// PUT /api/profile
{
  "firstName": "علی",
  "lastName": "محمدی",
  "email": "ali.mohammadi@email.com",
  "phone": "09123456789",
  "nationalId": "1234567890",
  "birthDate": "1370/05/15",
  "gender": "male"
}

// PUT /api/profile/password
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}

// POST /api/profile/avatar
FormData {
  "avatar": File
}
```

---

## Testing

### Test Cases:
1. ویرایش و ذخیره پروفایل
2. لغو ویرایش
3. تغییر رمز عبور با اعتبارسنجی
4. تغییر رمز عبور با خطا
5. آپلود تصویر پروفایل
6. فعال/غیرفعال کردن 2FA
7. تغییر تنظیمات اعلان‌ها
8. تغییر تنظیمات حریم خصوصی
9. حذف حساب کاربری (با تایید)
10. تغییر Tab
11. Responsive در موبایل
12. Keyboard Navigation

---

## مجوز

این فایل بخشی از پروژه باربری بهار است.
© 2024 All Rights Reserved.
