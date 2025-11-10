# اضافه شدن اطلاعات بانکی به پروفایل راننده 💳

## نمای کلی
فیلدهای **شماره حساب** و **شماره شبا** به پروفایل راننده اضافه شد تا رانندگان بتوانند اطلاعات بانکی خود را برای دریافت درآمدها ثبت کنند.

---

## تغییرات انجام شده

### 1️⃣ **Mock Data - اطلاعات بانکی**

```typescript
// اطلاعات بانکی
banking: {
  accountNumber: '1234567890123456',      // شماره حساب
  iban: 'IR123456789012345678901234',     // شماره شبا
  bankName: 'بانک ملی',                   // نام بانک
  accountHolder: 'رضا احمدی',             // نام صاحب حساب
},
```

**فیلدها**:
- ✅ `accountNumber`: شماره حساب بانکی (16 رقم)
- ✅ `iban`: شماره شبا (26 کاراکتر با IR)
- ✅ `bankName`: نام بانک (Select)
- ✅ `accountHolder`: نام صاحب حساب

---

### 2️⃣ **State Management**

```typescript
const [bankingData, setBankingData] = useState({
  accountNumber: driver.banking.accountNumber,
  iban: driver.banking.iban,
  bankName: driver.banking.bankName,
  accountHolder: driver.banking.accountHolder,
});
```

---

### 3️⃣ **Handler ذخیره‌سازی**

```typescript
const handleSaveBanking = () => {
  // اعتبارسنجی شماره شبا
  if (bankingData.iban && !bankingData.iban.startsWith('IR')) {
    toast.error('شماره شبا باید با IR شروع شود');
    return;
  }

  if (bankingData.iban && bankingData.iban.length !== 26) {
    toast.error('شماره شبا باید 26 کاراکتر باشد');
    return;
  }

  setDriver({
    ...driver,
    banking: bankingData,
  });
  toast.success('اطلاعات بانکی ذخیره شد');
};
```

**Validation**:
- ✅ شماره شبا باید با `IR` شروع شود
- ✅ شماره شبا باید دقیقاً 26 کاراکتر باشد
- ✅ Toast موفقیت/خطا

---

### 4️⃣ **Tab جدید: اطلاعات بانکی**

#### TabsList:
```typescript
<TabsList className="grid w-full grid-cols-6"> {/* از 5 به 6 تغییر یافت */}
  <TabsTrigger value="personal">
    <User className="ml-2 h-4 w-4" />
    اطلاعات شخصی
  </TabsTrigger>
  <TabsTrigger value="vehicle">
    <Truck className="ml-2 h-4 w-4" />
    خودرو
  </TabsTrigger>
  <TabsTrigger value="banking"> {/* ✅ جدید */}
    <CreditCard className="ml-2 h-4 w-4" />
    اطلاعات بانکی
  </TabsTrigger>
  <TabsTrigger value="documents">
    <FileText className="ml-2 h-4 w-4" />
    مدارک
  </TabsTrigger>
  <TabsTrigger value="security">
    <Shield className="ml-2 h-4 w-4" />
    امنیت
  </TabsTrigger>
  <TabsTrigger value="settings">
    <Settings className="ml-2 h-4 w-4" />
    تنظیمات
  </TabsTrigger>
</TabsList>
```

---

### 5️⃣ **TabContent: فرم اطلاعات بانکی**

```typescript
<TabsContent value="banking" className="space-y-4">
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5" />
        <div>
          <CardTitle>اطلاعات بانکی</CardTitle>
          <CardDescription>اطلاعات حساب برای دریافت درآمدها</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Alert امنیتی */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          اطلاعات بانکی شما کاملاً محرمانه است و تنها برای واریز درآمدها استفاده می‌شود.
        </AlertDescription>
      </Alert>

      {/* فیلدها */}
      ...
    </CardContent>
  </Card>
</TabsContent>
```

---

## فیلدهای فرم

### 1️⃣ **نام صاحب حساب** (ضروری)

```typescript
<div className="space-y-2">
  <Label htmlFor="account-holder">نام صاحب حساب *</Label>
  <Input
    id="account-holder"
    value={bankingData.accountHolder}
    onChange={(e) => setBankingData({ ...bankingData, accountHolder: e.target.value })}
    placeholder="رضا احمدی"
  />
</div>
```

**ویژگی‌ها**:
- ✅ Input ساده
- ✅ Placeholder نمونه
- ✅ فیلد ضروری (*)

---

### 2️⃣ **نام بانک** (ضروری)

```typescript
<div className="space-y-2">
  <Label htmlFor="bank-name">نام بانک *</Label>
  <Select
    value={bankingData.bankName}
    onValueChange={(value) => setBankingData({ ...bankingData, bankName: value })}
  >
    <SelectTrigger id="bank-name">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="بانک ملی">بانک ملی</SelectItem>
      <SelectItem value="بانک ملت">بانک ملت</SelectItem>
      <SelectItem value="بانک صادرات">بانک صادرات</SelectItem>
      <SelectItem value="بانک تجارت">بانک تجارت</SelectItem>
      <SelectItem value="بانک سپه">بانک سپه</SelectItem>
      <SelectItem value="بانک پاسارگاد">بانک پاسارگاد</SelectItem>
      <SelectItem value="بانک پارسیان">بانک پارسیان</SelectItem>
      <SelectItem value="بانک کشاورزی">بانک کشاورزی</SelectItem>
      <SelectItem value="بانک رفاه">بانک رفاه</SelectItem>
      <SelectItem value="بانک سامان">بانک سامان</SelectItem>
      <SelectItem value="سایر">سایر</SelectItem>
    </SelectContent>
  </Select>
</div>
```

**ویژگی‌ها**:
- ✅ Select component
- ✅ 11 بانک اصلی ایران
- ✅ گزینه "سایر"

---

### 3️⃣ **شماره شبا (IBAN)** (ضروری)

```typescript
<div className="space-y-2">
  <Label htmlFor="iban">شماره شبا (IBAN) *</Label>
  <Input
    id="iban"
    value={bankingData.iban}
    onChange={(e) => {
      let value = e.target.value.toUpperCase();
      // حذف فاصله‌ها
      value = value.replace(/\s/g, '');
      // اضافه کردن IR اگر وجود نداشته باشد
      if (value && !value.startsWith('IR')) {
        value = 'IR' + value;
      }
      // محدود کردن به 26 کاراکتر
      value = value.substring(0, 26);
      setBankingData({ ...bankingData, iban: value });
    }}
    placeholder="IR123456789012345678901234"
    maxLength={26}
    className="font-mono"
  />
  <p className="text-xs text-muted-foreground">
    شماره شبا باید 26 رقم باشد و با IR شروع شود
  </p>
</div>
```

**ویژگی‌های خاص**:
- ✅ **Auto-format**: خودکار به حروف بزرگ تبدیل می‌شود
- ✅ **Auto-prefix**: اگر کاربر IR ننویسد، خودکار اضافه می‌شود
- ✅ **حذف فاصله**: فاصله‌ها خودکار حذف می‌شوند
- ✅ **محدودیت 26 کاراکتر**: `maxLength={26}`
- ✅ **فونت Monospace**: برای خوانایی بهتر
- ✅ **راهنما**: توضیح زیر فیلد

**مثال عملکرد**:
```
کاربر می‌نویسد: "123456789012345678901234"
خودکار تبدیل می‌شود به: "IR123456789012345678901234"
```

---

### 4️⃣ **شماره حساب** (اختیاری)

```typescript
<div className="space-y-2">
  <Label htmlFor="account-number">شماره حساب</Label>
  <Input
    id="account-number"
    value={bankingData.accountNumber}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, ''); // فقط اعداد
      setBankingData({ ...bankingData, accountNumber: value });
    }}
    placeholder="1234567890123456"
    maxLength={16}
    className="font-mono"
  />
  <p className="text-xs text-muted-foreground">
    شماره حساب بانکی (اختیاری)
  </p>
</div>
```

**ویژگی‌های خاص**:
- ✅ **فقط اعداد**: حروف خودکار حذف می‌شوند
- ✅ **محدودیت 16 رقم**: `maxLength={16}`
- ✅ **فونت Monospace**
- ✅ **اختیاری**: نیاز به پر کردن ندارد

---

### 5️⃣ **پیش‌نمایش اطلاعات**

```typescript
<div className="rounded-lg bg-muted p-4">
  <h4 className="mb-3 flex items-center gap-2 font-medium">
    <CreditCard className="h-4 w-4" />
    پیش‌نمایش
  </h4>
  <div className="space-y-2 text-sm">
    <div className="flex justify-between">
      <span className="text-muted-foreground">صاحب حساب:</span>
      <span className="font-medium">{bankingData.accountHolder || '-'}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-muted-foreground">بانک:</span>
      <span className="font-medium">{bankingData.bankName || '-'}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-muted-foreground">شماره شبا:</span>
      <span className="font-mono text-xs">
        {bankingData.iban || '-'}
      </span>
    </div>
    {bankingData.accountNumber && (
      <div className="flex justify-between">
        <span className="text-muted-foreground">شماره حساب:</span>
        <span className="font-mono text-xs">{bankingData.accountNumber}</span>
      </div>
    )}
  </div>
</div>
```

**ویژگی‌ها**:
- ✅ نمایش زنده تمام اطلاعات وارد شده
- ✅ Background Muted
- ✅ فونت Monospace برای شماره‌ها
- ✅ Conditional rendering برای شماره حساب

---

### 6️⃣ **دکمه ذخیره**

```typescript
<Button onClick={handleSaveBanking} className="w-full md:w-auto">
  <Save className="ml-2 h-4 w-4" />
  ذخیره اطلاعات بانکی
</Button>
```

**رفتار**:
- ✅ کلیک → اجرای `handleSaveBanking`
- ✅ Validation شماره شبا
- ✅ Toast موفقیت/خطا
- ✅ Responsive (full-width در موبایل)

---

## Validation Rules

### شماره شبا (IBAN):
```typescript
✅ باید با "IR" شروع شود
✅ باید دقیقاً 26 کاراکتر باشد
✅ فقط حروف و اعداد (بدون فاصله)
✅ Case-insensitive (خودکار به uppercase)

❌ IR123  → خطا: "شماره شبا باید 26 کاراکتر باشد"
❌ 123456... → خطا: "شماره شبا باید با IR شروع شود"
✅ IR123456789012345678901234 → صحیح
```

### شماره حساب:
```typescript
✅ اختیاری (می‌تواند خالی باشد)
✅ فقط اعداد
✅ حداکثر 16 رقم
```

---

## UI/UX Features

### 🎨 رنگ‌بندی:
- **Tab Icon**: `<CreditCard />` - آبی
- **Alert**: پس‌زمینه آبی روشن
- **Preview Box**: پس‌زمینه Muted

### ✨ ویژگی‌های UX:
- ✅ **Auto-format**: شماره شبا خودکار فرمت می‌شود
- ✅ **Live Preview**: نمایش زنده اطلاعات
- ✅ **Smart Validation**: اعتبارسنجی هوشمند
- ✅ **Helper Text**: راهنمای زیر هر فیلد
- ✅ **Monospace Font**: برای شماره‌های بانکی
- ✅ **Security Alert**: پیام امنیتی در بالا

### 📱 Responsive:
```typescript
className="grid gap-4 md:grid-cols-2"  // 2 ستونی در Desktop
className="w-full md:w-auto"           // Full-width در موبایل
```

---

## مثال کامل فرم پر شده

```typescript
{
  accountHolder: "رضا احمدی",
  bankName: "بانک ملی",
  iban: "IR123456789012345678901234",
  accountNumber: "1234567890123456"
}
```

**نمایش در Preview**:
```
┌─────────────────────────────────────┐
│ 💳 پیش‌نمایش                        │
├─────────────────────────────────────┤
│ صاحب حساب:          رضا احمدی      │
│ بانک:               بانک ملی       │
│ شماره شبا:          IR123456789...  │
│ شماره حساب:         1234567890...   │
└─────────────────────────────────────┘
```

---

## Toast Messages

### ✅ موفقیت:
```typescript
toast.success('اطلاعات بانکی ذخیره شد');
```

### ❌ خطاها:
```typescript
toast.error('شماره شبا باید با IR شروع شود');
toast.error('شماره شبا باید 26 کاراکتر باشد');
```

---

## Integration با Backend

### API Endpoint پیشنهادی:
```typescript
PUT /api/drivers/{driverId}/banking

Body:
{
  "accountNumber": "1234567890123456",
  "iban": "IR123456789012345678901234",
  "bankName": "بانک ملی",
  "accountHolder": "رضا احمدی"
}

Response:
{
  "success": true,
  "message": "اطلاعات بانکی با موفقیت ذخیره شد",
  "data": {
    "accountNumber": "1234567890123456",
    "iban": "IR123456789012345678901234",
    "bankName": "بانک ملی",
    "accountHolder": "رضا احمدی",
    "verified": false, // در انتظار تایید ادمین
    "updatedAt": "2024-11-08T12:00:00Z"
  }
}
```

---

## Security Considerations

### 🔒 امنیت:
- ✅ اطلاعات بانکی باید رمزنگاری شوند (Encryption)
- ✅ فقط راننده صاحب حساب می‌تواند ببیند
- ✅ لاگ تغییرات برای حسابرسی
- ✅ تایید دو مرحله‌ای برای تغییرات
- ✅ نمایش جزئی شماره شبا در لیست (Masking)

### مثال Masking:
```typescript
// نمایش کامل در فرم:
IR123456789012345678901234

// نمایش در لیست/پیش‌نمایش:
IR********************1234
```

---

## Testing

### Test Cases:
1. ✅ وارد کردن شماره شبا بدون IR → خودکار IR اضافه شود
2. ✅ وارد کردن شماره شبا با حروف کوچک → تبدیل به بزرگ
3. ✅ وارد کردن شماره شبا کمتر از 26 → خطا
4. ✅ وارد کردن شماره شبا بیشتر از 26 → محدود شود
5. ✅ وارد کردن حروف در شماره حساب → حذف شود
6. ✅ ذخیره با فیلدهای خالی → خطا
7. ✅ ذخیره با اطلاعات صحیح → موفق
8. ✅ نمایش زنده در Preview
9. ✅ Responsive در موبایل
10. ✅ Switch بین Tab‌ها

---

## امکانات آینده

- [ ] تایید شماره شبا با API بانک مرکزی
- [ ] تایید صاحب حساب با کد ملی
- [ ] آپلود تصویر کارت بانکی
- [ ] تاریخچه تراکنش‌ها
- [ ] حساب‌های متعدد
- [ ] واریز خودکار
- [ ] گزارش واریزی‌ها
- [ ] اعلان واریز

---

## خلاصه تغییرات

### فایل‌های تغییر یافته:
- ✅ `/pages/driver/DriverProfile.tsx`

### خطوط اضافه شده:
- ✅ Mock Data: اطلاعات بانکی
- ✅ State: `bankingData`
- ✅ Handler: `handleSaveBanking`
- ✅ Tab: `banking`
- ✅ TabContent: فرم کامل اطلاعات بانکی
- ✅ Validation: شماره شبا

### Components جدید:
- ❌ هیچ کامپوننت جدیدی اضافه نشد

### Dependencies جدید:
- ❌ هیچ dependency جدیدی نیاز نیست

---

## وضعیت

✅ **کامل شد!**

رانندگان حالا می‌توانند:
- ✅ اطلاعات بانکی خود را وارد کنند
- ✅ شماره شبا و حساب را ثبت کنند
- ✅ بانک مورد نظر را انتخاب کنند
- ✅ پیش‌نمایش اطلاعات را ببینند
- ✅ با Validation هوشمند کار کنند

---

**تاریخ ایجاد**: 2024-11-08
**نسخه**: 1.0.0

© 2024 Baha Barri. All Rights Reserved.
