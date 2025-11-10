# صفحه آدرس‌های مشتری - CustomerAddresses

## نمای کلی

صفحه **آدرس‌های من (CustomerAddresses)** یک صفحه کامل برای مدیریت آدرس‌های ذخیره شده مشتری است. این صفحه به کاربر امکان می‌دهد:
- لیست تمام آدرس‌های خود را ببیند
- آدرس جدید اضافه کند
- آدرس‌های موجود را ویرایش کند
- آدرس‌های غیرضروری را حذف کند
- یک آدرس را به عنوان پیش‌فرض تنظیم کند
- جستجو و فیلتر کند
- حالت نمایش Grid یا List را انتخاب کند

---

## ویژگی‌های اصلی

### 1️⃣ **نمایش آمار** 📊

کارت‌های آمار در بالای صفحه:
- **کل آدرس‌ها**: تعداد کل آدرس‌های ذخیره شده
- **منزل**: تعداد آدرس‌های منزل
- **محل کار**: تعداد آدرس‌های محل کار
- **پیش‌فرض**: نمایش تعداد (همیشه 1)

```tsx
<Card>
  <CardContent className="p-4">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        <MapPin className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">کل آدرس‌ها</p>
        <p className="text-2xl font-bold">{addresses.length}</p>
      </div>
    </div>
  </CardContent>
</Card>
```

---

### 2️⃣ **افزودن آدرس جدید** ➕

#### دیالوگ افزودن شامل:
- **عنوان آدرس**: منزل، محل کار، منزل جدید، انبار، سایر
- **استان و شهر**: انتخاب از لیست
- **منطقه**: ورودی آزاد
- **آدرس کامل**: Textarea برای آدرس دقیق
- **کدپستی**: 10 رقمی
- **جزئیات بیشتر**: طبقه، واحد، رنگ درب و...
- **انتخاب موقعیت**: دکمه برای انتخاب از نقشه

#### اعتبارسنجی:
```tsx
if (!formData.title || !formData.fullAddress) {
  toast.error('لطفاً عنوان و آدرس را وارد کنید');
  return;
}
```

#### فیلدهای الزامی:
- ✅ عنوان آدرس
- ✅ استان
- ✅ شهر
- ✅ آدرس کامل

#### فیلدهای اختیاری:
- منطقه
- کدپستی
- جزئیات بیشتر

---

### 3️⃣ **ویرایش آدرس** ✏️

#### نحوه باز کردن:
1. کلیک روی منوی سه نقطه
2. انتخاب "ویرایش"
3. دیالوگ با اطلاعات فعلی باز می‌شود

#### ویژگی‌ها:
- اطلاعات فعلی در فرم نمایش داده می‌شود
- تمام فیلدها قابل ویرایش هستند
- دکمه "ذخیره تغییرات" برای اعمال
- دکمه "انصراف" برای لغو

```tsx
const openEditDialog = (address: Address) => {
  setSelectedAddress(address);
  setFormData({
    title: address.title,
    fullAddress: address.fullAddress,
    // ...
  });
  setIsEditDialogOpen(true);
};
```

---

### 4️⃣ **حذف آدرس** 🗑️

#### محدودیت‌ها:
- ❌ نمی‌توان آدرس پیش‌فرض را حذف کرد
- ✅ سایر آدرس‌ها قابل حذف هستند

#### دیالوگ تایید:
```tsx
<AlertDialog>
  <AlertDialogHeader>
    <AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
    <AlertDialogDescription>
      این آدرس برای همیشه حذف خواهد شد. این عمل قابل بازگشت نیست.
    </AlertDialogDescription>
  </AlertDialogHeader>
  <AlertDialogFooter>
    <AlertDialogCancel>انصراف</AlertDialogCancel>
    <AlertDialogAction className="bg-red-600">حذف</AlertDialogAction>
  </AlertDialogFooter>
</AlertDialog>
```

#### بررسی قبل از حذف:
```tsx
const handleDeleteAddress = (id: string) => {
  if (id === defaultAddressId) {
    toast.error('نمی‌توانید آدرس پیش‌فرض را حذف کنید');
    return;
  }
  // حذف...
};
```

---

### 5️⃣ **تنظیم آدرس پیش‌فرض** ⭐

#### نحوه استفاده:
1. منوی سه نقطه را باز کنید
2. "تنظیم به عنوان پیش‌فرض" را انتخاب کنید
3. بادج "پیش‌فرض" روی آدرس نمایش داده می‌شود

#### ویژگی‌های بصری:
- **Border آبی**: آدرس پیش‌فرض border-primary دارد
- **Badge طلایی**: با آیکون ستاره
- **عدم حذف**: گزینه حذف برای آدرس پیش‌فرض نمایش داده نمی‌شود

```tsx
const isDefault = address.id === defaultAddressId;

<Card className={isDefault ? 'border-primary' : ''}>
  {isDefault && (
    <Badge variant="secondary">
      <Star className="ml-1 h-3 w-3" />
      پیش‌فرض
    </Badge>
  )}
</Card>
```

---

### 6️⃣ **جستجو و فیلتر** 🔍

#### فیلدهای قابل جستجو:
- عنوان آدرس (منزل، محل کار و...)
- آدرس کامل
- منطقه

```tsx
const filteredAddresses = addresses.filter(
  (address) =>
    address.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.fullAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.district.includes(searchQuery)
);
```

#### UI جستجو:
```tsx
<div className="relative flex-1">
  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
  <Input
    placeholder="جستجو در آدرس‌ها..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="pr-10"
  />
</div>
```

---

### 7️⃣ **حالت‌های نمایش** 👁️

#### Grid View (پیش‌فرض):
- نمایش کارت‌های مستطیلی
- 3 ستون در Desktop
- 2 ستون در Tablet
- 1 ستون در Mobile

#### List View:
- نمایش لیستی
- اطلاعات بیشتر در یک سطر
- مناسب برای آدرس‌های زیاد

#### تغییر حالت:
```tsx
<div className="flex gap-2">
  <Button
    variant={viewMode === 'grid' ? 'default' : 'outline'}
    size="sm"
    onClick={() => setViewMode('grid')}
  >
    <Grid3x3 className="h-4 w-4" />
  </Button>
  <Button
    variant={viewMode === 'list' ? 'default' : 'outline'}
    size="sm"
    onClick={() => setViewMode('list')}
  >
    <List className="h-4 w-4" />
  </Button>
</div>
```

---

### 8️⃣ **آیکون‌های هوشمند** 🏠

هر نوع آدرس آیکون مخصوص خود را دارد:

```tsx
const addressIcons: Record<string, any> = {
  'منزل': Home,
  'محل کار': Building2,
  'منزل جدید': Home,
  'default': MapPin,
};

const Icon = addressIcons[address.title] || addressIcons.default;
```

#### آیکون‌ها:
- 🏠 **منزل**: Home
- 🏢 **محل کار**: Building2
- 📍 **پیش‌فرض**: MapPin

---

### 9️⃣ **Dropdown Menu** 📋

#### گزینه‌ها:
1. **تنظیم به عنوان پیش‌فرض** (فقط برای غیر پیش‌فرض)
2. **ویرایش** (همیشه)
3. **حذف** (فقط برای غیر پیش‌فرض)

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" dir="rtl">
    {!isDefault && (
      <DropdownMenuItem onClick={() => handleSetDefault(address.id)}>
        <Star className="ml-2 h-4 w-4" />
        تنظیم به عنوان پیش‌فرض
      </DropdownMenuItem>
    )}
    <DropdownMenuItem onClick={() => openEditDialog(address)}>
      <Edit className="ml-2 h-4 w-4" />
      ویرایش
    </DropdownMenuItem>
    {!isDefault && (
      <DropdownMenuItem className="text-red-600">
        <Trash2 className="ml-2 h-4 w-4" />
        حذف
      </DropdownMenuItem>
    )}
  </DropdownMenuContent>
</DropdownMenu>
```

---

### 🔟 **Empty State** 📭

#### نمایش زمانی که:
- هیچ آدرسی وجود ندارد
- جستجو نتیجه‌ای ندارد

```tsx
{filteredAddresses.length === 0 && (
  <div className="flex flex-col items-center justify-center py-12">
    <MapPin className="mb-4 h-12 w-12 text-muted-foreground" />
    <h3 className="mb-2 text-lg font-medium">آدرسی یافت نشد</h3>
    <p className="mb-4 text-sm text-muted-foreground">
      {searchQuery 
        ? 'نتیجه‌ای برای جستجوی شما پیدا نشد' 
        : 'شما هنوز آدرسی اضافه نکرده‌اید'
      }
    </p>
    <Button onClick={() => setIsAddDialogOpen(true)}>
      <Plus className="ml-2 h-4 w-4" />
      افزودن اولین آدرس
    </Button>
  </div>
)}
```

---

## ساختار State

### States اصلی:
```typescript
const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
const [viewMode, setViewMode] = useState<ViewMode>('grid');
const [searchQuery, setSearchQuery] = useState('');
const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
const [deleteAddressId, setDeleteAddressId] = useState<string | null>(null);
const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
const [defaultAddressId, setDefaultAddressId] = useState<string>('a1');
```

### Form State:
```typescript
const [formData, setFormData] = useState({
  title: '',
  fullAddress: '',
  district: '',
  city: 'تهران',
  province: 'تهران',
  postalCode: '',
  details: '',
  lat: 0,
  lng: 0,
});
```

---

## Mock Data

### آدرس‌های نمونه:
```typescript
const mockAddresses: Address[] = [
  {
    id: 'a1',
    userId: 'c1',
    title: 'منزل',
    fullAddress: 'تهران، منطقه 5، خیابان آزادی، نبش کوچه نهم، پلاک 123',
    lat: 35.6892,
    lng: 51.3890,
    district: '5',
    city: 'تهران',
    province: 'تهران',
    postalCode: '1234567890',
    details: 'واحد 3، طبقه دوم، کدپستی درب سبز',
    createdAt: new Date('2024-01-15'),
  },
  // ...
];
```

---

## Functions کلیدی

### 1. افزودن آدرس:
```typescript
const handleAddAddress = () => {
  if (!formData.title || !formData.fullAddress) {
    toast.error('لطفاً عنوان و آدرس را وارد کنید');
    return;
  }

  const newAddress: Address = {
    id: `a${addresses.length + 1}`,
    userId: 'c1',
    // ... سایر فیلدها
    createdAt: new Date(),
  };

  setAddresses([...addresses, newAddress]);
  setIsAddDialogOpen(false);
  resetForm();
  toast.success('آدرس جدید با موفقیت اضافه شد');
};
```

### 2. ویرایش آدرس:
```typescript
const handleEditAddress = () => {
  if (!selectedAddress) return;

  const updatedAddresses = addresses.map((addr) =>
    addr.id === selectedAddress.id
      ? { ...addr, ...formData }
      : addr
  );

  setAddresses(updatedAddresses);
  setIsEditDialogOpen(false);
  toast.success('آدرس با موفقیت ویرایش شد');
};
```

### 3. حذف آدرس:
```typescript
const handleDeleteAddress = (id: string) => {
  if (id === defaultAddressId) {
    toast.error('نمی‌توانید آدرس پیش‌فرض را حذف کنید');
    return;
  }

  setAddresses(addresses.filter((addr) => addr.id !== id));
  setDeleteAddressId(null);
  toast.success('آدرس حذف شد');
};
```

### 4. تنظیم پیش‌فرض:
```typescript
const handleSetDefault = (id: string) => {
  setDefaultAddressId(id);
  toast.success('آدرس پیش‌فرض تغییر کرد');
};
```

### 5. Reset فرم:
```typescript
const resetForm = () => {
  setFormData({
    title: '',
    fullAddress: '',
    district: '',
    city: 'تهران',
    province: 'تهران',
    postalCode: '',
    details: '',
    lat: 0,
    lng: 0,
  });
};
```

---

## طراحی UI/UX

### رنگ‌بندی:
- **آدرس پیش‌فرض**: border-primary
- **آدرس منزل**: bg-green-100 (آیکون)
- **آدرس کار**: bg-blue-100 (آیکون)
- **آدرس عادی**: bg-primary/10 (آیکون)

### Badge‌ها:
- **پیش‌فرض**: Badge طلایی با ستاره
- **نوع آدرس**: تنوع در آیکون‌ها

### Responsive:
- Grid: md:grid-cols-2 lg:grid-cols-3
- List: Stack در موبایل
- Dialog: max-w-2xl

---

## Toast Messages

### پیام‌های موفقیت:
- "آدرس جدید با موفقیت اضافه شد"
- "آدرس با موفقیت ویرایش شد"
- "آدرس حذف شد"
- "آدرس پیش‌فرض تغییر کرد"
- "موقعیت انتخاب شد"

### پیام‌های خطا:
- "لطفاً عنوان و آدرس را وارد کنید"
- "نمی‌توانید آدرس پیش‌فرض را حذف کنید"

---

## Accessibility

### ARIA Labels:
- دکمه‌ها با Label واضح
- فرم‌ها با Label مناسب

### Keyboard Navigation:
- Tab برای حرکت بین فیلدها
- Enter برای ثبت فرم
- Escape برای بستن Dialog

### Screen Readers:
- متن‌های جایگزین برای آیکون‌ها
- توضیحات برای Actions

---

## Validation

### قوانین اعتبارسنجی:
1. **عنوان**: الزامی
2. **آدرس کامل**: الزامی
3. **کدپستی**: 10 رقم (اختیاری)
4. **استان و شهر**: الزامی

### نمایش خطا:
- Toast برای خطاهای کلی
- Inline برای خطاهای فیلد خاص

---

## Performance

### Optimization:
- فیلتر سمت Client
- State کمینه
- Memo برای کارت‌ها (در آینده)

### Lazy Loading:
- برای تعداد آدرس زیاد
- Pagination یا Infinite Scroll

---

## امکانات آینده

پیشنهاداتی برای نسخه‌های بعدی:

- [ ] نقشه واقعی برای انتخاب موقعیت (Neshan)
- [ ] تشخیص خودکار موقعیت (Geolocation)
- [ ] اعتبارسنجی کدپستی
- [ ] پیشنهاد آدرس هنگام تایپ
- [ ] دسته‌بندی بیشتر (خانواده، دوستان و...)
- [ ] اشتراک‌گذاری آدرس
- [ ] ذخیره آدرس‌های پرکاربرد
- [ ] Import/Export آدرس‌ها
- [ ] Bulk Actions (حذف دسته‌جمعی)
- [ ] History تغییرات
- [ ] Notes برای هر آدرس
- [ ] تصویر محل (عکس ساختمان)
- [ ] راهنمای دسترسی
- [ ] شماره تماس ثانویه
- [ ] زمان‌بندی دسترسی
- [ ] Favorite Addresses

---

## Integration با Backend

### API Endpoints:
```
GET    /api/addresses              // لیست آدرس‌ها
POST   /api/addresses              // افزودن آدرس
PUT    /api/addresses/{id}         // ویرایش آدرس
DELETE /api/addresses/{id}         // حذف آدرس
PUT    /api/addresses/{id}/default // تنظیم پیش‌فرض
```

### Request Example:
```typescript
// POST /api/addresses
{
  "title": "منزل",
  "fullAddress": "تهران، خیابان آزادی...",
  "lat": 35.6892,
  "lng": 51.3890,
  "district": "5",
  "city": "تهران",
  "province": "تهران",
  "postalCode": "1234567890",
  "details": "واحد 3"
}
```

---

## Testing

### Test Cases:
1. افزودن آدرس با داده‌های معتبر
2. افزودن آدرس بدون عنوان (خطا)
3. ویرایش آدرس
4. حذف آدرس عادی
5. حذف آدرس پیش‌فرض (خطا)
6. تنظیم آدرس پیش‌فرض
7. جستجو در آدرس‌ها
8. تغییر حالت نمایش
9. Responsive در موبایل
10. Empty State

---

## مجوز

این فایل بخشی از پروژه باربری بهار است.
© 2024 All Rights Reserved.
