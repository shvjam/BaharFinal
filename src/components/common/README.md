# Common Components

این فولدر شامل کامپوننت‌های عمومی و مشترک است که در سراسر اپلیکیشن استفاده می‌شوند.

## ImageUpload

کامپوننت آپلود تصویر با قابلیت Drag & Drop و پیش‌نمایش.

### ویژگی‌ها:
- ✅ آپلود با کلیک یا Drag & Drop
- ✅ پیش‌نمایش تصویر
- ✅ اعتبارسنجی فرمت فایل (JPG, PNG, WEBP)
- ✅ اعتبارسنجی حجم فایل
- ✅ تبدیل به Base64 برای ذخیره‌سازی
- ✅ امکان حذف و تغییر تصویر
- ✅ UI/UX حرفه‌ای با Hover Effects

### استفاده:

```tsx
import { ImageUpload } from './components/common/ImageUpload';

function MyComponent() {
  const [image, setImage] = useState<string | undefined>();

  return (
    <ImageUpload
      value={image}
      onChange={setImage}
      label="تصویر محصول"
      description="فایل JPG، PNG یا WEBP با حداکثر حجم 2 مگابایت"
      maxSizeMB={2}
    />
  );
}
```

### Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| undefined` | - | مقدار تصویر (Base64 یا URL) |
| `onChange` | `(value: string \| undefined) => void` | - | تابع برای تغییر مقدار |
| `label` | `string` | `'تصویر'` | برچسب فیلد |
| `description` | `string` | فرمت‌های مجاز | توضیحات زیر فیلد |
| `maxSizeMB` | `number` | `5` | حداکثر حجم فایل (مگابایت) |

---

## ProtectedRoute

کامپوننت محافظت از مسیرها بر اساس نقش کاربر.

### استفاده:

```tsx
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { UserRole } from './types';

<ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
  <AdminDashboard />
</ProtectedRoute>
```
