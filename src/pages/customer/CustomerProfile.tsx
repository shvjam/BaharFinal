import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Save,
  Edit,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Smartphone,
  Monitor,
  Activity,
  Clock,
  CreditCard,
  Star,
  Package,
  TrendingUp,
  Settings,
  LogOut,
  Key,
  Fingerprint,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { ScrollArea } from '../../components/ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';

// Mock User Data
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

// Mock Activity Log
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
  {
    id: '3',
    action: 'ثبت سفارش جدید',
    device: 'Chrome on Windows',
    ip: '192.168.1.1',
    location: 'تهران، ایران',
    timestamp: new Date('2024-03-13T16:45:00'),
  },
  {
    id: '4',
    action: 'تغییر رمز عبور',
    device: 'Safari on iPhone',
    ip: '192.168.1.3',
    location: 'تهران، ایران',
    timestamp: new Date('2024-03-10T09:15:00'),
  },
];

export const CustomerProfile = () => {
  const [user, setUser] = useState(mockUser);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  // Form States
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

  // Notification Settings
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

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showOrderHistory: false,
    shareLocation: true,
    allowDataCollection: true,
  });

  // Handlers
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

    // API Call here
    setShowPasswordDialog(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    toast.success('رمز عبور با موفقیت تغییر کرد');
  };

  const handleDeleteAccount = () => {
    // API Call here
    toast.success('حساب کاربری شما حذف خواهد شد');
    setShowDeleteDialog(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // در اینجا می‌توان فایل را آپلود کرد
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, avatar: reader.result as string });
        toast.success('تصویر پروفایل با موفقیت تغییر کرد');
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTwoFactor = () => {
    setUser({ ...user, twoFactorEnabled: !user.twoFactorEnabled });
    toast.success(
      user.twoFactorEnabled
        ? 'تایید دو مرحله‌ای غیرفعال شد'
        : 'تایید دو مرحله‌ای فعال شد'
    );
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header با تصویر پروفایل */}
      <Card className="relative overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5" />
        <CardContent className="relative -mt-16 space-y-4">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-end">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback className="text-3xl">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-10 w-10 rounded-full shadow-lg"
                onClick={() => setShowAvatarDialog(true)}
              >
                <Camera className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 text-center md:text-right">
              <div className="flex flex-col items-center gap-2 md:flex-row md:items-center">
                <h1 className="flex items-center gap-2">
                  {user.firstName} {user.lastName}
                </h1>
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  {user.membershipLevel}
                </Badge>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground md:justify-start">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  عضو از {user.joinedDate}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <LogOut className="ml-2 h-4 w-4" />
                خروج
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* کارت‌های آمار */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">کل سفارشات</p>
                <p className="text-2xl font-bold">{user.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">هزینه کل</p>
                <p className="text-2xl font-bold">{user.totalSpent.toLocaleString('fa-IR')}</p>
                <p className="text-xs text-muted-foreground">تومان</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">امتیاز وفاداری</p>
                <p className="text-2xl font-bold">{user.loyaltyPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">میانگین سفارش</p>
                <p className="text-2xl font-bold">
                  {Math.round(user.totalSpent / user.totalOrders).toLocaleString('fa-IR')}
                </p>
                <p className="text-xs text-muted-foreground">تومان</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs اصلی */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">
            <User className="ml-2 h-4 w-4" />
            اطلاعات شخصی
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="ml-2 h-4 w-4" />
            امنیت
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="ml-2 h-4 w-4" />
            اعلان‌ها
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Eye className="ml-2 h-4 w-4" />
            حریم خصوصی
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="ml-2 h-4 w-4" />
            فعالیت‌ها
          </TabsTrigger>
        </TabsList>

        {/* Tab: اطلاعات شخصی */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>اطلاعات شخصی</CardTitle>
                <CardDescription>مدیریت اطلاعات حساب کاربری شما</CardDescription>
              </div>
              {!isEditMode ? (
                <Button onClick={() => setIsEditMode(true)}>
                  <Edit className="ml-2 h-4 w-4" />
                  ویرایش
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    <X className="ml-2 h-4 w-4" />
                    انصراف
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    <Save className="ml-2 h-4 w-4" />
                    ذخیره
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* نام و نام خانوادگی */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">نام *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">نام خانوادگی *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={!isEditMode}
                  />
                </div>
              </div>

              {/* ایمیل و تلفن */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    ایمیل *
                    {user.emailVerified && (
                      <Badge variant="secondary" className="gap-1">
                        <Check className="h-3 w-3" />
                        تایید شده
                      </Badge>
                    )}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    شماره تلفن *
                    {user.phoneVerified && (
                      <Badge variant="secondary" className="gap-1">
                        <Check className="h-3 w-3" />
                        تایید شده
                      </Badge>
                    )}
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditMode}
                  />
                </div>
              </div>

              {/* کد ملی */}
              <div className="space-y-2">
                <Label htmlFor="nationalId">کد ملی</Label>
                <Input
                  id="nationalId"
                  value={formData.nationalId}
                  onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                  disabled={!isEditMode}
                  maxLength={10}
                />
              </div>

              {/* تاریخ تولد و جنسیت */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">تاریخ تولد</Label>
                  <Input
                    id="birthDate"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    disabled={!isEditMode}
                    placeholder="1370/01/01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">جنسیت</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    disabled={!isEditMode}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">مرد</SelectItem>
                      <SelectItem value="female">زن</SelectItem>
                      <SelectItem value="other">سایر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* اطلاعات حساب */}
              <div className="space-y-3">
                <h4 className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  اطلاعات حساب
                </h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-muted-foreground">شناسه کاربری</span>
                    <span className="font-mono">{user.id}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-muted-foreground">تاریخ ثبت‌نام</span>
                    <span>{user.joinedDate}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-muted-foreground">آخرین ورود</span>
                    <span>{user.lastLogin}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-muted-foreground">سطح عضویت</span>
                    <Badge variant="secondary">{user.membershipLevel}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: امنیت */}
        <TabsContent value="security" className="space-y-4">
          {/* تغییر رمز عبور */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                رمز عبور
              </CardTitle>
              <CardDescription>مدیریت رمز عبور حساب کاربری</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  برای امنیت بیشتر، توصیه می‌شود رمز عبور خود را هر 3 ماه یکبار تغییر دهید.
                </AlertDescription>
              </Alert>
              <Button onClick={() => setShowPasswordDialog(true)} className="w-full md:w-auto">
                <Lock className="ml-2 h-4 w-4" />
                تغییر رمز عبور
              </Button>
            </CardContent>
          </Card>

          {/* تایید دو مرحله‌ای */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                تایید دو مرحله‌ای (2FA)
              </CardTitle>
              <CardDescription>افزایش امنیت حساب با تایید دو مرحله‌ای</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Fingerprint className="h-4 w-4" />
                <AlertDescription>
                  {user.twoFactorEnabled
                    ? 'تایید دو مرحله‌ای فعال است. حساب شما از امنیت بالایی برخوردار است.'
                    : 'با فعال کردن تایید دو مرحله‌ای، امنیت حساب خود را افزایش دهید.'}
                </AlertDescription>
              </Alert>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">تایید دو مرحله‌ای</Label>
                  <p className="text-sm text-muted-foreground">
                    {user.twoFactorEnabled ? 'فعال است' : 'غیرفعال است'}
                  </p>
                </div>
                <Switch id="two-factor" checked={user.twoFactorEnabled} onCheckedChange={toggleTwoFactor} />
              </div>
            </CardContent>
          </Card>

          {/* دستگاه‌های متصل */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                دستگاه‌های متصل
              </CardTitle>
              <CardDescription>دستگاه‌هایی که به حساب شما متصل هستند</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Chrome on Windows</p>
                      <p className="text-xs text-muted-foreground">آخرین فعالیت: 2 دقیقه پیش</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <Check className="h-3 w-3" />
                    فعلی
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Mobile App on Android</p>
                      <p className="text-xs text-muted-foreground">آخرین فعالیت: 2 ساعت پیش</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    قطع ارتباط
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: اعلان‌ها */}
        <TabsContent value="notifications" className="space-y-4">
          {/* اعلان‌های ایمیل */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                اعلان‌های ایمیل
              </CardTitle>
              <CardDescription>مدیریت اعلان‌های ایمیلی</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-orders">اعلان سفارشات</Label>
                  <p className="text-sm text-muted-foreground">دریافت اطلاعات درباره سفارشات</p>
                </div>
                <Switch
                  id="email-orders"
                  checked={notifications.emailOrders}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailOrders: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-promotions">تخفیف‌ها و پیشنهادات</Label>
                  <p className="text-sm text-muted-foreground">دریافت اطلاعات تخفیف‌ها</p>
                </div>
                <Switch
                  id="email-promotions"
                  checked={notifications.emailPromotions}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailPromotions: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-newsletter">خبرنامه</Label>
                  <p className="text-sm text-muted-foreground">دریافت اخبار و مقالات</p>
                </div>
                <Switch
                  id="email-newsletter"
                  checked={notifications.emailNewsletter}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailNewsletter: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* اعلان‌های پیامکی */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                اعلان‌های پیامکی
              </CardTitle>
              <CardDescription>مدیریت اعلان‌های پیامکی</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-orders">اعلان سفارشات</Label>
                  <p className="text-sm text-muted-foreground">دریافت پیامک درباره سفارشات</p>
                </div>
                <Switch
                  id="sms-orders"
                  checked={notifications.smsOrders}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, smsOrders: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-promotions">تخفیف‌ها و پیشنهادات</Label>
                  <p className="text-sm text-muted-foreground">دریافت پیامک تخفیف‌ها</p>
                </div>
                <Switch
                  id="sms-promotions"
                  checked={notifications.smsPromotions}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, smsPromotions: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* اعلان‌های پوش */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                اعلان‌های پوش
              </CardTitle>
              <CardDescription>مدیریت اعلان‌های Push</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-orders">اعلان سفارشات</Label>
                  <p className="text-sm text-muted-foreground">نمایش اعلان درباره سفارشات</p>
                </div>
                <Switch
                  id="push-orders"
                  checked={notifications.pushOrders}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, pushOrders: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-promotions">تخفیف‌ها و پیشنهادات</Label>
                  <p className="text-sm text-muted-foreground">نمایش اعلان تخفیف‌ها</p>
                </div>
                <Switch
                  id="push-promotions"
                  checked={notifications.pushPromotions}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, pushPromotions: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-newsletter">خبرنامه</Label>
                  <p className="text-sm text-muted-foreground">نمایش اعلان اخبار</p>
                </div>
                <Switch
                  id="push-newsletter"
                  checked={notifications.pushNewsletter}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, pushNewsletter: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: حریم خصوصی */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                تنظیمات حریم خصوصی
              </CardTitle>
              <CardDescription>کنترل اطلاعات قابل مشاهده برای دیگران</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-profile">نمایش پروفایل</Label>
                  <p className="text-sm text-muted-foreground">
                    امکان مشاهده پروفایل شما توسط سایر کاربران
                  </p>
                </div>
                <Switch
                  id="show-profile"
                  checked={privacy.showProfile}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, showProfile: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-orders">تاریخچه سفارشات</Label>
                  <p className="text-sm text-muted-foreground">نمایش تاریخچه سفارشات شما</p>
                </div>
                <Switch
                  id="show-orders"
                  checked={privacy.showOrderHistory}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, showOrderHistory: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="share-location">اشتراک‌گذاری موقعیت</Label>
                  <p className="text-sm text-muted-foreground">امکان دسترسی به موقعیت مکانی شما</p>
                </div>
                <Switch
                  id="share-location"
                  checked={privacy.shareLocation}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, shareLocation: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-collection">جمع‌آوری داده</Label>
                  <p className="text-sm text-muted-foreground">
                    مجوز جمع‌آوری داده برای بهبود تجربه
                  </p>
                </div>
                <Switch
                  id="data-collection"
                  checked={privacy.allowDataCollection}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, allowDataCollection: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* حذف حساب کاربری */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
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
        </TabsContent>

        {/* Tab: فعالیت‌ها */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                تاریخچه فعالیت‌ها
              </CardTitle>
              <CardDescription>آخرین فعالیت‌های حساب کاربری شما</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {mockActivityLog.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{activity.action}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleDateString('fa-IR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Monitor className="h-3 w-3" />
                            {activity.device}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {activity.location}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">IP: {activity.ip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog: تغییر تصویر پروفایل */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تغییر تصویر پروفایل</DialogTitle>
            <DialogDescription>یک تصویر جدید برای پروفایل خود انتخاب کنید</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback className="text-3xl">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar-upload">انتخاب تصویر</Label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <p className="text-xs text-muted-foreground">
                حداکثر حجم: 2MB - فرمت‌های مجاز: JPG, PNG
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAvatarDialog(false)}>
              بستن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: تغییر رمز عبور */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تغییر رمز عبور</DialogTitle>
            <DialogDescription>برای امنیت حساب، رمز عبور جدید خود را وارد کنید</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">رمز عبور فعلی *</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 top-0 h-full"
                  onClick={() =>
                    setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                  }
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">رمز عبور جدید *</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 top-0 h-full"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">حداقل 8 کاراکتر</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">تکرار رمز عبور جدید *</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 top-0 h-full"
                  onClick={() =>
                    setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                  }
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordDialog(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }}
            >
              انصراف
            </Button>
            <Button onClick={handleChangePassword}>
              <Check className="ml-2 h-4 w-4" />
              تغییر رمز عبور
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog: حذف حساب */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              آیا مطمئن هستید؟
            </AlertDialogTitle>
            <AlertDialogDescription>
              این عمل غیرقابل بازگشت است. تمام اطلاعات شما شامل سفارشات، آدرس‌ها و امتیازات وفاداری
              به طور دائم حذف خواهد شد.
              <br />
              <br />
              برای تایید، کلمه <strong>&quot;حذف حساب&quot;</strong> را تایپ کنید.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف دائمی حساب کاربری
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
