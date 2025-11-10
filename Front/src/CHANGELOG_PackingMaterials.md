# تغییرات: سیستم خرید مواد بسته‌بندی

## تاریخ: 7 نوامبر 2025

## خلاصه تغییرات

سیستم خرید مواد بسته‌بندی با دو حالت Auto و Manual پیاده‌سازی شد که به کاربران امکان می‌دهد:
1. **حالت Auto**: کارشناسان مواد مورد نیاز را تخمین زده و تهیه می‌کنند
2. **حالت Manual**: کاربر محصولات بسته‌بندی را به صورت دستی انتخاب و خریداری می‌کند

در حالت Manual، محصولات انتخاب شده به عنوان آیتم‌های جداگانه در فاکتور قیمت نمایش داده می‌شوند (نه در سبد خرید).

---

## فایل‌های تغییر یافته

### 1. `/types/index.ts`
**تغییرات:**
- اضافه شدن interface جدید `SelectedPackingProduct`:
  ```typescript
  export interface SelectedPackingProduct {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }
  ```

- آپدیت `OrderFormState`:
  - `packingMaterialsMode?: 'auto' | 'manual'` - حالت خرید مواد
  - `selectedPackingProducts?: SelectedPackingProduct[]` - محصولات انتخاب شده

- آپدیت `PackingService`:
  - `materialsMode?: 'auto' | 'manual'`
  - `packingProducts?: SelectedPackingProduct[]`

---

### 2. `/components/order/PackingStep.tsx`
**تغییرات اصلی:**

#### Props جدید:
- `packingMaterialsMode?: 'auto' | 'manual'`
- `selectedPackingProducts?: SelectedPackingProduct[]`

#### State Management:
- مدیریت حالت Auto/Manual با RadioGroup
- مدیریت تعداد محصولات با دکمه‌های +/-
- محاسبه خودکار قیمت کل محصولات

#### UI جدید:
1. **بخش انتخاب حالت (Materials Mode Selection)**
   - RadioGroup برای انتخاب بین Auto و Manual
   - نمایش توضیحات هر گزینه

2. **لیست محصولات بسته‌بندی (Products List)**
   - Grid layout برای نمایش محصولات
   - تصویر محصول با ImageWithFallback
   - دکمه‌های +/- برای تعداد
   - Highlight کردن محصولات انتخاب شده

3. **خلاصه محصولات انتخاب شده (Summary Card)**
   - لیست محصولات با تعداد و قیمت
   - جمع کل قیمت محصولات

#### توابع جدید:
```typescript
handleMaterialsModeChange(mode: 'auto' | 'manual')
handleProductQuantityChange(productId: string, change: number)
getProductQuantity(productId: string): number
```

---

### 3. `/components/order/PriceBreakdownCard.tsx`
**تغییرات:**

#### Props جدید:
- `packingProducts?: SelectedPackingProduct[]`

#### محاسبات:
- محاسبه جمع قیمت محصولات بسته‌بندی
- محاسبه جمع کل نهایی (قیمت سفارش + محصولات)

#### UI جدید:
- بخش جداگانه برای نمایش محصولات بسته‌بندی
- آیکون Package برای تشخیص بهتر
- نمایش تعداد × قیمت واحد
- جمع جداگانه برای محصولات

---

### 4. `/pages/public/OrderFormPage.tsx`
**تغییرات:**

#### Import:
- اضافه شدن `SelectedPackingProduct` به imports از types

#### PackingStep Integration:
```typescript
<PackingStep
  // ... props قبلی
  packingMaterialsMode={formState.packingMaterialsMode}
  selectedPackingProducts={formState.selectedPackingProducts}
  onUpdate={(data) => updateFormState(data)}
/>
```

#### PriceBreakdownCard Integration:
```typescript
<PriceBreakdownCard
  breakdown={formState.priceBreakdown || []}
  total={formState.estimatedPrice || 0}
  packingProducts={formState.selectedPackingProducts}
/>
```

#### useEffect Dependency:
- اضافه شدن `formState.packingMaterialsMode` و `formState.selectedPackingProducts` به dependencies برای recalculate قیمت

---

## جزئیات فنی

### Data Flow
1. کاربر در PackingStep checkbox "نیاز به خرید مواد بسته‌بندی" را فعال می‌کند
2. RadioGroup نمایش داده می‌شود با دو گزینه Auto و Manual
3. در صورت انتخاب Manual:
   - لیست محصولات از `mockPackingProducts` نمایش داده می‌شود
   - کاربر با دکمه‌های +/- تعداد را مشخص می‌کند
   - state `selectedPackingProducts` آپدیت می‌شود
4. در PriceBreakdownCard:
   - محصولات به صورت جداگانه نمایش داده می‌شوند
   - جمع محصولات به جمع کل اضافه می‌شود

### Validation
- Checkbox برای کلیک روی کل کارت غیرفعال شده (preventDefault)
- تعداد محصولات نمی‌تواند کمتر از 0 باشد
- در حالت Auto، لیست محصولات خالی می‌شود

### UX Improvements
1. ✅ کلیک روی کل کارت → انتخاب آیتم (بدون نیاز به کلیک روی checkbox)
2. ✅ Highlight محصولات انتخاب شده با border-primary
3. ✅ نمایش تصویر محصولات
4. ✅ خلاصه محصولات انتخاب شده در کارت جداگانه
5. ✅ نمایش جداگانه محصولات در فاکتور قیمت

---

## تست‌های مورد نیاز

### Manual Testing Checklist:
- [ ] انتخاب "نیاز به خرید مواد بسته‌بندی"
- [ ] تغییر بین حالت Auto و Manual
- [ ] افزودن محصول با دکمه +
- [ ] کاهش محصول با دکمه -
- [ ] حذف محصول (رسیدن به 0)
- [ ] نمایش صحیح در PriceBreakdownCard
- [ ] محاسبه صحیح قیمت کل
- [ ] ذخیره state در OrderFormContext

### Edge Cases:
- [ ] تغییر از Manual به Auto (پاک شدن محصولات)
- [ ] غیرفعال کردن checkbox (پاک شدن تمام اطلاعات)
- [ ] تغییر packingType (حفظ محصولات انتخاب شده)

---

## نکات برای توسعه بعدی

1. **Backend Integration:**
   - ارسال `selectedPackingProducts` به API
   - اضافه کردن به order items در database

2. **Stock Management:**
   - چک کردن موجودی محصولات
   - نمایش warning در صورت کمبود موجودی

3. **Pricing:**
   - اعمال تخفیف روی محصولات
   - قیمت‌گذاری پویا بر اساس تعداد

4. **Analytics:**
   - ترک محصولات پرفروش
   - تحلیل رفتار کاربران در انتخاب محصولات
