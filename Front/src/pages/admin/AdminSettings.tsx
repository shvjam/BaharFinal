import { useState } from 'react';
import {
  Settings,
  Globe,
  DollarSign,
  Bell,
  Map,
  CreditCard,
  Shield,
  Palette,
  Mail,
  Database,
  Search as SearchIcon,
  Upload,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  X,
  Info,
  AlertCircle,
  Phone,
  MessageSquare,
  Clock,
  Users,
  Package,
  Percent,
  Key,
  Lock,
  Server,
  FileText,
  Image,
  Code,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';
import { Switch } from '../../components/ui/switch';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '../../components/ui/alert';
import { ScrollArea } from '../../components/ui/scroll-area';
import { toast } from 'sonner@2.0.3';

interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  workingHours: string;
  logoUrl: string;
  faviconUrl: string;
  instagram: string;
  telegram: string;
  whatsapp: string;
  supportPhone: string;
}

interface PricingSettings {
  basePrice: number;
  pricePerKm: number;
  minPrice: number;
  maxPrice: number;
  taxPercentage: number;
  commissionPercentage: number;
  workerPricePerHour: number;
  packingMaterialMarkup: number;
  peakHourMultiplier: number;
  weekendMultiplier: number;
}

interface NotificationSettings {
  smsEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsApiKey: string;
  smsUsername: string;
  smsPassword: string;
  orderConfirmationSms: boolean;
  orderAssignedSms: boolean;
  orderCompletedSms: boolean;
  orderCancelledSms: boolean;
}

interface MapSettings {
  mapApiKey: string;
  mapProvider: 'neshan' | 'google' | 'mapbox';
  defaultZoom: number;
  serviceRadius: number;
  enableGeofencing: boolean;
  defaultLatitude: number;
  defaultLongitude: number;
}

interface PaymentSettings {
  zarinpalEnabled: boolean;
  zarinpalMerchantId: string;
  parsianEnabled: boolean;
  parsianPin: string;
  mellatEnabled: boolean;
  mellatTerminalId: string;
  allowCashPayment: boolean;
  allowWalletPayment: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  ipWhitelistEnabled: boolean;
  ipWhitelist: string[];
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  rtl: boolean;
}

interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smtpSecure: boolean;
  fromEmail: string;
  fromName: string;
}

interface BackupSettings {
  autoBackupEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupTime: string;
  retentionDays: number;
  cloudBackupEnabled: boolean;
  cloudProvider: string;
}

interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  robotsTxt: string;
  sitemapEnabled: boolean;
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // تنظیمات عمومی
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    siteName: 'باربری بهار',
    siteDescription: 'سیستم هوشمند مدیریت باربری و اسباب‌کشی',
    contactPhone: '021-88776655',
    contactEmail: 'info@baharbarbari.ir',
    address: 'تهران، خیابان آزادی، پلاک 123',
    workingHours: 'شنبه تا پنجشنبه: 8 صبح تا 8 شب',
    logoUrl: '',
    faviconUrl: '',
    instagram: '@baharbarbari',
    telegram: '@baharbarbari',
    whatsapp: '09121234567',
    supportPhone: '021-88776655',
  });

  // تنظیمات قیمت‌گذاری
  const [pricingSettings, setPricingSettings] = useState<PricingSettings>({
    basePrice: 500000,
    pricePerKm: 50000,
    minPrice: 800000,
    maxPrice: 10000000,
    taxPercentage: 9,
    commissionPercentage: 15,
    workerPricePerHour: 300000,
    packingMaterialMarkup: 20,
    peakHourMultiplier: 1.5,
    weekendMultiplier: 1.3,
  });

  // تنظیمات اعلانات
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    smsEnabled: true,
    emailEnabled: true,
    pushEnabled: true,
    smsApiKey: 'YOUR_SMS_API_KEY',
    smsUsername: 'baharbarbari',
    smsPassword: '••••••••',
    orderConfirmationSms: true,
    orderAssignedSms: true,
    orderCompletedSms: true,
    orderCancelledSms: true,
  });

  // تنظیمات نقشه
  const [mapSettings, setMapSettings] = useState<MapSettings>({
    mapApiKey: 'YOUR_MAP_API_KEY',
    mapProvider: 'neshan',
    defaultZoom: 13,
    serviceRadius: 50,
    enableGeofencing: true,
    defaultLatitude: 35.6892,
    defaultLongitude: 51.3890,
  });

  // تنظیمات پرداخت
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    zarinpalEnabled: true,
    zarinpalMerchantId: 'YOUR_MERCHANT_ID',
    parsianEnabled: false,
    parsianPin: '',
    mellatEnabled: false,
    mellatTerminalId: '',
    allowCashPayment: true,
    allowWalletPayment: true,
  });

  // تنظیمات امنیتی
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    ipWhitelistEnabled: false,
    ipWhitelist: [],
  });

  // تنظیمات ظاهری
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    theme: 'light',
    primaryColor: '#2563eb',
    secondaryColor: '#7c3aed',
    fontFamily: 'IRANSans',
    rtl: true,
  });

  // تنظیمات ایمیل
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: 'your-email@gmail.com',
    smtpPassword: '••••••••',
    smtpSecure: true,
    fromEmail: 'noreply@baharbarbari.ir',
    fromName: 'باربری بهار',
  });

  // تنظیمات پشتیبان‌گیری
  const [backupSettings, setBackupSettings] = useState<BackupSettings>({
    autoBackupEnabled: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    retentionDays: 30,
    cloudBackupEnabled: false,
    cloudProvider: '',
  });

  // تنظیمات سئو
  const [seoSettings, setSeoSettings] = useState<SeoSettings>({
    metaTitle: 'باربری بهار - سیستم هوشمند اسباب‌کشی',
    metaDescription: 'بهترین خدمات باربری و اسباب‌کشی در تهران با قیمت مناسب',
    metaKeywords: 'باربری، اسباب‌کشی، باربری تهران، حمل بار',
    googleAnalyticsId: 'G-XXXXXXXXXX',
    googleTagManagerId: 'GTM-XXXXXXX',
    robotsTxt: 'User-agent: *\nDisallow:',
    sitemapEnabled: true,
  });

  const handleSaveSettings = (section: string) => {
    toast.success(`تنظیمات ${section} با موفقیت ذخیره شد`);
    setHasUnsavedChanges(false);
  };

  const handleResetSettings = (section: string) => {
    toast.info(`تنظیمات ${section} بازنشانی شد`);
  };

  const handleTestSms = () => {
    toast.success('پیام آزمایشی ارسال شد');
  };

  const handleTestEmail = () => {
    toast.success('ایمیل آزمایشی ارسال شد');
  };

  const handleBackupNow = () => {
    toast.success('پشتیبان‌گیری شروع شد');
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <Settings className="h-8 w-8" />
            تنظیمات سیستم
          </h1>
          <p className="text-muted-foreground">مدیریت تنظیمات عمومی و پیکربندی سیستم</p>
        </div>
        {hasUnsavedChanges && (
          <Alert className="w-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>تغییرات ذخیره نشده دارید</AlertDescription>
          </Alert>
        )}
      </div>

      {/* تب‌ها */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <ScrollArea className="w-full">
          <TabsList className="inline-flex h-auto flex-wrap">
            <TabsTrigger value="general" className="gap-2">
              <Globe className="h-4 w-4" />
              عمومی
            </TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2">
              <DollarSign className="h-4 w-4" />
              قیمت‌گذاری
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              اعلانات
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <Map className="h-4 w-4" />
              نقشه
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-2">
              <CreditCard className="h-4 w-4" />
              پرداخت
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              امنیت
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              ظاهر
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2">
              <Mail className="h-4 w-4" />
              ایمیل
            </TabsTrigger>
            <TabsTrigger value="backup" className="gap-2">
              <Database className="h-4 w-4" />
              پشتیبان
            </TabsTrigger>
            <TabsTrigger value="seo" className="gap-2">
              <SearchIcon className="h-4 w-4" />
              سئو
            </TabsTrigger>
          </TabsList>
        </ScrollArea>

        {/* تنظیمات عمومی */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                اطلاعات عمومی سایت
              </CardTitle>
              <CardDescription>
                تنظیمات پایه و اطلاعات تماس سایت
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">نام سایت</Label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) => {
                      setGeneralSettings({ ...generalSettings, siteName: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">تلفن تماس</Label>
                  <Input
                    id="contactPhone"
                    value={generalSettings.contactPhone}
                    onChange={(e) => {
                      setGeneralSettings({ ...generalSettings, contactPhone: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">ایمیل تماس</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => {
                      setGeneralSettings({ ...generalSettings, contactEmail: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supportPhone">تلفن پشتیبانی</Label>
                  <Input
                    id="supportPhone"
                    value={generalSettings.supportPhone}
                    onChange={(e) => {
                      setGeneralSettings({ ...generalSettings, supportPhone: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">توضیحات سایت</Label>
                <Textarea
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) => {
                    setGeneralSettings({ ...generalSettings, siteDescription: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">آدرس</Label>
                <Textarea
                  id="address"
                  value={generalSettings.address}
                  onChange={(e) => {
                    setGeneralSettings({ ...generalSettings, address: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workingHours">ساعات کاری</Label>
                <Input
                  id="workingHours"
                  value={generalSettings.workingHours}
                  onChange={(e) => {
                    setGeneralSettings({ ...generalSettings, workingHours: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              <Separator />

              <div>
                <h4 className="mb-4 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  شبکه‌های اجتماعی
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">اینستاگرام</Label>
                    <Input
                      id="instagram"
                      placeholder="@username"
                      value={generalSettings.instagram}
                      onChange={(e) => {
                        setGeneralSettings({ ...generalSettings, instagram: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telegram">تلگرام</Label>
                    <Input
                      id="telegram"
                      placeholder="@username"
                      value={generalSettings.telegram}
                      onChange={(e) => {
                        setGeneralSettings({ ...generalSettings, telegram: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">واتساپ</Label>
                    <Input
                      id="whatsapp"
                      placeholder="09121234567"
                      value={generalSettings.whatsapp}
                      onChange={(e) => {
                        setGeneralSettings({ ...generalSettings, whatsapp: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-4 flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  لوگو و آیکون
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">لوگوی سایت</Label>
                    <div className="flex gap-2">
                      <Input
                        id="logoUrl"
                        placeholder="URL لوگو"
                        value={generalSettings.logoUrl}
                        onChange={(e) => {
                          setGeneralSettings({ ...generalSettings, logoUrl: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                      />
                      <Button variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="faviconUrl">فاویکون</Label>
                    <div className="flex gap-2">
                      <Input
                        id="faviconUrl"
                        placeholder="URL فاویکون"
                        value={generalSettings.faviconUrl}
                        onChange={(e) => {
                          setGeneralSettings({ ...generalSettings, faviconUrl: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                      />
                      <Button variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleResetSettings('عمومی')}>
              <RefreshCw className="ml-2 h-4 w-4" />
              بازنشانی
            </Button>
            <Button onClick={() => handleSaveSettings('عمومی')}>
              <Save className="ml-2 h-4 w-4" />
              ذخیره تغییرات
            </Button>
          </div>
        </TabsContent>

        {/* تنظیمات قیمت‌گذاری */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                تنظیمات قیمت‌گذاری
              </CardTitle>
              <CardDescription>
                مدیریت قیمت‌ها، مالیات و کمیسیون‌ها
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="mb-4 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  قیمت‌های پایه
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="basePrice">قیمت پایه (تومان)</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      value={pricingSettings.basePrice}
                      onChange={(e) => {
                        setPricingSettings({
                          ...pricingSettings,
                          basePrice: Number(e.target.value),
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      قیمت ثابت شروع هر سفارش
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricePerKm">قیمت هر کیلومتر (تومان)</Label>
                    <Input
                      id="pricePerKm"
                      type="number"
                      value={pricingSettings.pricePerKm}
                      onChange={(e) => {
                        setPricingSettings({
                          ...pricingSettings,
                          pricePerKm: Number(e.target.value),
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minPrice">حداقل قیمت (تومان)</Label>
                    <Input
                      id="minPrice"
                      type="number"
                      value={pricingSettings.minPrice}
                      onChange={(e) => {
                        setPricingSettings({
                          ...pricingSettings,
                          minPrice: Number(e.target.value),
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxPrice">حداکثر قیمت (تومان)</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      value={pricingSettings.maxPrice}
                      onChange={(e) => {
                        setPricingSettings({
                          ...pricingSettings,
                          maxPrice: Number(e.target.value),
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workerPricePerHour">قیمت کارگر در ساعت (تومان)</Label>
                    <Input
                      id="workerPricePerHour"
                      type="number"
                      value={pricingSettings.workerPricePerHour}
                      onChange={(e) => {
                        setPricingSettings({
                          ...pricingSettings,
                          workerPricePerHour: Number(e.target.value),
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-4 flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  درصدها و ضرایب
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="taxPercentage">مالیات (%)</Label>
                    <Input
                      id="taxPercentage"
                      type="number"
                      value={pricingSettings.taxPercentage}
                      onChange={(e) => {
                        setPricingSettings({
                          ...pricingSettings,
                          taxPercentage: Number(e.target.value),
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commissionPercentage">کمیسیون راننده (%)</Label>
                    <Input
                      id="commissionPercentage"
                      type="number"
                      value={pricingSettings.commissionPercentage}
                      onChange={(e) => {
                        setPricingSettings({
                          ...pricingSettings,
                          commissionPercentage: Number(e.target.value),
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="packingMaterialMarkup">درصد سود بسته‌بندی (%)</Label>
                    <Input
                      id="packingMaterialMarkup"
                      type="number"
                      value={pricingSettings.packingMaterialMarkup}
                      onChange={(e) => {
                        setPricingSettings({
                          ...pricingSettings,
                          packingMaterialMarkup: Number(e.target.value),
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="peakHourMultiplier">ضریب ساعت شلوغی</Label>
                    <Input
                      id="peakHourMultiplier"
                      type="number"
                      step="0.1"
                      value={pricingSettings.peakHourMultiplier}
                      onChange={(e) => {
                        setPricingSettings({
                          ...pricingSettings,
                          peakHourMultiplier: Number(e.target.value),
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weekendMultiplier">ضریب آخر هفته</Label>
                    <Input
                      id="weekendMultiplier"
                      type="number"
                      step="0.1"
                      value={pricingSettings.weekendMultiplier}
                      onChange={(e) => {
                        setPricingSettings({
                          ...pricingSettings,
                          weekendMultiplier: Number(e.target.value),
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>توجه</AlertTitle>
                <AlertDescription>
                  تغییر این مقادیر بر روی قیمت‌گذاری تمام سفارشات جدید تاثیر می‌گذارد
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleResetSettings('قیمت‌گذاری')}>
              <RefreshCw className="ml-2 h-4 w-4" />
              بازنشانی
            </Button>
            <Button onClick={() => handleSaveSettings('قیمت‌گذاری')}>
              <Save className="ml-2 h-4 w-4" />
              ذخیره تغییرات
            </Button>
          </div>
        </TabsContent>

        {/* تنظیمات اعلانات */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                تنظیمات اعلانات
              </CardTitle>
              <CardDescription>
                مدیریت پیامک، ایمیل و اعلان‌های سیستم
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="mb-4">وضعیت کانال‌های اعلان</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsEnabled">پیامک (SMS)</Label>
                      <p className="text-sm text-muted-foreground">
                        ارسال پیامک برای اعلان‌های مهم
                      </p>
                    </div>
                    <Switch
                      id="smsEnabled"
                      checked={notificationSettings.smsEnabled}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({ ...notificationSettings, smsEnabled: checked });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailEnabled">ایمیل</Label>
                      <p className="text-sm text-muted-foreground">
                        ارسال ایمیل برای اطلاع‌رسانی
                      </p>
                    </div>
                    <Switch
                      id="emailEnabled"
                      checked={notificationSettings.emailEnabled}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({ ...notificationSettings, emailEnabled: checked });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushEnabled">اعلان Push</Label>
                      <p className="text-sm text-muted-foreground">
                        اعلان‌های فوری در مرورگر و اپلیکیشن
                      </p>
                    </div>
                    <Switch
                      id="pushEnabled"
                      checked={notificationSettings.pushEnabled}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({ ...notificationSettings, pushEnabled: checked });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-4 flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  تنظیمات پنل پیامک
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smsUsername">نام کاربری</Label>
                    <Input
                      id="smsUsername"
                      value={notificationSettings.smsUsername}
                      onChange={(e) => {
                        setNotificationSettings({
                          ...notificationSettings,
                          smsUsername: e.target.value,
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smsPassword">رمز عبور</Label>
                    <div className="relative">
                      <Input
                        id="smsPassword"
                        type={showApiKeys ? 'text' : 'password'}
                        value={notificationSettings.smsPassword}
                        onChange={(e) => {
                          setNotificationSettings({
                            ...notificationSettings,
                            smsPassword: e.target.value,
                          });
                          setHasUnsavedChanges(true);
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute left-1 top-1 h-7 w-7 p-0"
                        onClick={() => setShowApiKeys(!showApiKeys)}
                      >
                        {showApiKeys ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="smsApiKey">کلید API</Label>
                    <div className="relative">
                      <Input
                        id="smsApiKey"
                        type={showApiKeys ? 'text' : 'password'}
                        value={notificationSettings.smsApiKey}
                        onChange={(e) => {
                          setNotificationSettings({
                            ...notificationSettings,
                            smsApiKey: e.target.value,
                          });
                          setHasUnsavedChanges(true);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="mt-4" onClick={handleTestSms}>
                  ارسال پیامک آزمایشی
                </Button>
              </div>

              <Separator />

              <div>
                <h4 className="mb-4">رویدادهای پیامکی</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="orderConfirmationSms">تایید سفارش</Label>
                    <Switch
                      id="orderConfirmationSms"
                      checked={notificationSettings.orderConfirmationSms}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({
                          ...notificationSettings,
                          orderConfirmationSms: checked,
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="orderAssignedSms">اختصاص راننده</Label>
                    <Switch
                      id="orderAssignedSms"
                      checked={notificationSettings.orderAssignedSms}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({
                          ...notificationSettings,
                          orderAssignedSms: checked,
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="orderCompletedSms">تکمیل سفارش</Label>
                    <Switch
                      id="orderCompletedSms"
                      checked={notificationSettings.orderCompletedSms}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({
                          ...notificationSettings,
                          orderCompletedSms: checked,
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="orderCancelledSms">لغو سفارش</Label>
                    <Switch
                      id="orderCancelledSms"
                      checked={notificationSettings.orderCancelledSms}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({
                          ...notificationSettings,
                          orderCancelledSms: checked,
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleResetSettings('اعلانات')}>
              <RefreshCw className="ml-2 h-4 w-4" />
              بازنشانی
            </Button>
            <Button onClick={() => handleSaveSettings('اعلانات')}>
              <Save className="ml-2 h-4 w-4" />
              ذخیره تغییرات
            </Button>
          </div>
        </TabsContent>

        {/* تنظیمات نقشه */}
        <TabsContent value="map" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                تنظیمات نقشه و مسیریابی
              </CardTitle>
              <CardDescription>
                پیکربندی سرویس نقشه و محدوده سرویس‌دهی
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mapProvider">ارائه‌دهنده نقشه</Label>
                  <Select
                    value={mapSettings.mapProvider}
                    onValueChange={(value: any) => {
                      setMapSettings({ ...mapSettings, mapProvider: value });
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neshan">نشان</SelectItem>
                      <SelectItem value="google">Google Maps</SelectItem>
                      <SelectItem value="mapbox">Mapbox</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mapApiKey">کلید API نقشه</Label>
                  <div className="relative">
                    <Input
                      id="mapApiKey"
                      type={showApiKeys ? 'text' : 'password'}
                      value={mapSettings.mapApiKey}
                      onChange={(e) => {
                        setMapSettings({ ...mapSettings, mapApiKey: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultZoom">زوم پیش‌فرض</Label>
                  <Input
                    id="defaultZoom"
                    type="number"
                    min="1"
                    max="20"
                    value={mapSettings.defaultZoom}
                    onChange={(e) => {
                      setMapSettings({ ...mapSettings, defaultZoom: Number(e.target.value) });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceRadius">شعاع سرویس‌دهی (کیلومتر)</Label>
                  <Input
                    id="serviceRadius"
                    type="number"
                    value={mapSettings.serviceRadius}
                    onChange={(e) => {
                      setMapSettings({ ...mapSettings, serviceRadius: Number(e.target.value) });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultLatitude">عرض جغرافیایی مرکز</Label>
                  <Input
                    id="defaultLatitude"
                    type="number"
                    step="0.0001"
                    value={mapSettings.defaultLatitude}
                    onChange={(e) => {
                      setMapSettings({ ...mapSettings, defaultLatitude: Number(e.target.value) });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultLongitude">طول جغرافیایی مرکز</Label>
                  <Input
                    id="defaultLongitude"
                    type="number"
                    step="0.0001"
                    value={mapSettings.defaultLongitude}
                    onChange={(e) => {
                      setMapSettings({ ...mapSettings, defaultLongitude: Number(e.target.value) });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="enableGeofencing">فعال‌سازی Geofencing</Label>
                  <p className="text-sm text-muted-foreground">
                    محدود کردن سرویس به محدوده جغرافیایی مشخص
                  </p>
                </div>
                <Switch
                  id="enableGeofencing"
                  checked={mapSettings.enableGeofencing}
                  onCheckedChange={(checked) => {
                    setMapSettings({ ...mapSettings, enableGeofencing: checked });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>راهنما</AlertTitle>
                <AlertDescription>
                  برای دریافت کلید API، به پنل توسعه‌دهندگان {mapSettings.mapProvider} مراجعه کنید
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleResetSettings('نقشه')}>
              <RefreshCw className="ml-2 h-4 w-4" />
              بازنشانی
            </Button>
            <Button onClick={() => handleSaveSettings('نقشه')}>
              <Save className="ml-2 h-4 w-4" />
              ذخیره تغییرات
            </Button>
          </div>
        </TabsContent>

        {/* تنظیمات پرداخت */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                تنظیمات درگاه‌های پرداخت
              </CardTitle>
              <CardDescription>
                مدیریت درگاه‌های پرداخت و روش‌های قبول شده
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* زرین‌پال */}
              <div className="space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4>زرین‌پال</h4>
                      <p className="text-sm text-muted-foreground">درگاه پرداخت آنلاین</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentSettings.zarinpalEnabled}
                    onCheckedChange={(checked) => {
                      setPaymentSettings({ ...paymentSettings, zarinpalEnabled: checked });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
                {paymentSettings.zarinpalEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="zarinpalMerchantId">Merchant ID</Label>
                    <Input
                      id="zarinpalMerchantId"
                      type={showApiKeys ? 'text' : 'password'}
                      value={paymentSettings.zarinpalMerchantId}
                      onChange={(e) => {
                        setPaymentSettings({
                          ...paymentSettings,
                          zarinpalMerchantId: e.target.value,
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* پارسیان */}
              <div className="space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4>پارسیان</h4>
                      <p className="text-sm text-muted-foreground">بانک پارسیان</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentSettings.parsianEnabled}
                    onCheckedChange={(checked) => {
                      setPaymentSettings({ ...paymentSettings, parsianEnabled: checked });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
                {paymentSettings.parsianEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="parsianPin">PIN کد</Label>
                    <Input
                      id="parsianPin"
                      type={showApiKeys ? 'text' : 'password'}
                      value={paymentSettings.parsianPin}
                      onChange={(e) => {
                        setPaymentSettings({ ...paymentSettings, parsianPin: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* ملت */}
              <div className="space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                      <CreditCard className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h4>ملت</h4>
                      <p className="text-sm text-muted-foreground">بانک ملت</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentSettings.mellatEnabled}
                    onCheckedChange={(checked) => {
                      setPaymentSettings({ ...paymentSettings, mellatEnabled: checked });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
                {paymentSettings.mellatEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="mellatTerminalId">شماره ترمینال</Label>
                    <Input
                      id="mellatTerminalId"
                      type={showApiKeys ? 'text' : 'password'}
                      value={paymentSettings.mellatTerminalId}
                      onChange={(e) => {
                        setPaymentSettings({
                          ...paymentSettings,
                          mellatTerminalId: e.target.value,
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h4 className="mb-4">روش‌های پرداخت</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowCashPayment">پرداخت نقدی</Label>
                    <Switch
                      id="allowCashPayment"
                      checked={paymentSettings.allowCashPayment}
                      onCheckedChange={(checked) => {
                        setPaymentSettings({ ...paymentSettings, allowCashPayment: checked });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowWalletPayment">پرداخت از کیف پول</Label>
                    <Switch
                      id="allowWalletPayment"
                      checked={paymentSettings.allowWalletPayment}
                      onCheckedChange={(checked) => {
                        setPaymentSettings({ ...paymentSettings, allowWalletPayment: checked });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleResetSettings('پرداخت')}>
              <RefreshCw className="ml-2 h-4 w-4" />
              بازنشانی
            </Button>
            <Button onClick={() => handleSaveSettings('پرداخت')}>
              <Save className="ml-2 h-4 w-4" />
              ذخیره تغییرات
            </Button>
          </div>
        </TabsContent>

        {/* تنظیمات امنیتی */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                تنظیمات امنیتی
              </CardTitle>
              <CardDescription>
                مدیریت احراز هویت و امنیت سیستم
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="mb-4">احراز هویت</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactorEnabled">احراز هویت دو مرحله‌ای</Label>
                      <p className="text-sm text-muted-foreground">
                        فعال‌سازی 2FA برای ادمین‌ها
                      </p>
                    </div>
                    <Switch
                      id="twoFactorEnabled"
                      checked={securitySettings.twoFactorEnabled}
                      onCheckedChange={(checked) => {
                        setSecuritySettings({ ...securitySettings, twoFactorEnabled: checked });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-4">تنظیمات نشست</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">مدت زمان نشست (دقیقه)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => {
                        setSecuritySettings({
                          ...securitySettings,
                          sessionTimeout: Number(e.target.value),
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">حداکثر تلاش ناموفق ورود</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => {
                        setSecuritySettings({
                          ...securitySettings,
                          maxLoginAttempts: Number(e.target.value),
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-4">سیاست رمز عبور</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="passwordMinLength">حداقل طول رمز عبور</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={securitySettings.passwordMinLength}
                      onChange={(e) => {
                        setSecuritySettings({
                          ...securitySettings,
                          passwordMinLength: Number(e.target.value),
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireUppercase">حروف بزرگ الزامی</Label>
                    <Switch
                      id="requireUppercase"
                      checked={securitySettings.requireUppercase}
                      onCheckedChange={(checked) => {
                        setSecuritySettings({ ...securitySettings, requireUppercase: checked });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireNumbers">اعداد الزامی</Label>
                    <Switch
                      id="requireNumbers"
                      checked={securitySettings.requireNumbers}
                      onCheckedChange={(checked) => {
                        setSecuritySettings({ ...securitySettings, requireNumbers: checked });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireSpecialChars">کاراکترهای خاص الزامی</Label>
                    <Switch
                      id="requireSpecialChars"
                      checked={securitySettings.requireSpecialChars}
                      onCheckedChange={(checked) => {
                        setSecuritySettings({
                          ...securitySettings,
                          requireSpecialChars: checked,
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-4">محدودیت IP</h4>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="ipWhitelistEnabled">فعال‌سازی لیست سفید IP</Label>
                    <p className="text-sm text-muted-foreground">
                      محدود کردن دسترسی به IP های مشخص
                    </p>
                  </div>
                  <Switch
                    id="ipWhitelistEnabled"
                    checked={securitySettings.ipWhitelistEnabled}
                    onCheckedChange={(checked) => {
                      setSecuritySettings({ ...securitySettings, ipWhitelistEnabled: checked });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
              </div>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>هشدار</AlertTitle>
                <AlertDescription>
                  تغییرات امنیتی می‌تواند بر دسترسی کاربران تاثیر بگذارد
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleResetSettings('امنیتی')}>
              <RefreshCw className="ml-2 h-4 w-4" />
              بازنشانی
            </Button>
            <Button onClick={() => handleSaveSettings('امنیتی')}>
              <Save className="ml-2 h-4 w-4" />
              ذخیره تغییرات
            </Button>
          </div>
        </TabsContent>

        {/* تنظیمات ظاهری */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                تنظیمات ظاهری
              </CardTitle>
              <CardDescription>
                سفارشی‌سازی ظاهر و تم سایت
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="theme">تم</Label>
                  <Select
                    value={appearanceSettings.theme}
                    onValueChange={(value: any) => {
                      setAppearanceSettings({ ...appearanceSettings, theme: value });
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">روشن</SelectItem>
                      <SelectItem value="dark">تاریک</SelectItem>
                      <SelectItem value="auto">خودکار</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontFamily">فونت</Label>
                  <Select
                    value={appearanceSettings.fontFamily}
                    onValueChange={(value) => {
                      setAppearanceSettings({ ...appearanceSettings, fontFamily: value });
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IRANSans">ایران‌سنس</SelectItem>
                      <SelectItem value="Vazir">وزیر</SelectItem>
                      <SelectItem value="Samim">صمیم</SelectItem>
                      <SelectItem value="Yekan">یکان</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryColor">رنگ اصلی</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={appearanceSettings.primaryColor}
                      onChange={(e) => {
                        setAppearanceSettings({
                          ...appearanceSettings,
                          primaryColor: e.target.value,
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="h-10 w-20"
                    />
                    <Input
                      value={appearanceSettings.primaryColor}
                      onChange={(e) => {
                        setAppearanceSettings({
                          ...appearanceSettings,
                          primaryColor: e.target.value,
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">رنگ ثانویه</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={appearanceSettings.secondaryColor}
                      onChange={(e) => {
                        setAppearanceSettings({
                          ...appearanceSettings,
                          secondaryColor: e.target.value,
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="h-10 w-20"
                    />
                    <Input
                      value={appearanceSettings.secondaryColor}
                      onChange={(e) => {
                        setAppearanceSettings({
                          ...appearanceSettings,
                          secondaryColor: e.target.value,
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="rtl">راست‌چین (RTL)</Label>
                  <p className="text-sm text-muted-foreground">
                    جهت راست به چپ برای زبان فارسی
                  </p>
                </div>
                <Switch
                  id="rtl"
                  checked={appearanceSettings.rtl}
                  onCheckedChange={(checked) => {
                    setAppearanceSettings({ ...appearanceSettings, rtl: checked });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>نکته</AlertTitle>
                <AlertDescription>
                  تغییرات ظاهری ممکن است نیاز به بارگذاری مجدد صفحه داشته باشد
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleResetSettings('ظاهری')}>
              <RefreshCw className="ml-2 h-4 w-4" />
              بازنشانی
            </Button>
            <Button onClick={() => handleSaveSettings('ظاهری')}>
              <Save className="ml-2 h-4 w-4" />
              ذخیره تغییرات
            </Button>
          </div>
        </TabsContent>

        {/* تنظیمات ایمیل */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                تنظیمات سرور ایمیل
              </CardTitle>
              <CardDescription>
                پیکربندی SMTP و ارسال ایمیل
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">سرور SMTP</Label>
                  <Input
                    id="smtpHost"
                    value={emailSettings.smtpHost}
                    onChange={(e) => {
                      setEmailSettings({ ...emailSettings, smtpHost: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPort">پورت</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) => {
                      setEmailSettings({ ...emailSettings, smtpPort: Number(e.target.value) });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">نام کاربری</Label>
                  <Input
                    id="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={(e) => {
                      setEmailSettings({ ...emailSettings, smtpUsername: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">رمز عبور</Label>
                  <Input
                    id="smtpPassword"
                    type={showApiKeys ? 'text' : 'password'}
                    value={emailSettings.smtpPassword}
                    onChange={(e) => {
                      setEmailSettings({ ...emailSettings, smtpPassword: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromEmail">ایمیل فرستنده</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => {
                      setEmailSettings({ ...emailSettings, fromEmail: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromName">نام فرستنده</Label>
                  <Input
                    id="fromName"
                    value={emailSettings.fromName}
                    onChange={(e) => {
                      setEmailSettings({ ...emailSettings, fromName: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="smtpSecure">اتصال امن (SSL/TLS)</Label>
                  <p className="text-sm text-muted-foreground">
                    استفاده از رمزنگاری برای ارسال ایمیل
                  </p>
                </div>
                <Switch
                  id="smtpSecure"
                  checked={emailSettings.smtpSecure}
                  onCheckedChange={(checked) => {
                    setEmailSettings({ ...emailSettings, smtpSecure: checked });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              <Button variant="outline" onClick={handleTestEmail}>
                ارسال ایمیل آزمایشی
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleResetSettings('ایمیل')}>
              <RefreshCw className="ml-2 h-4 w-4" />
              بازنشانی
            </Button>
            <Button onClick={() => handleSaveSettings('ایمیل')}>
              <Save className="ml-2 h-4 w-4" />
              ذخیره تغییرات
            </Button>
          </div>
        </TabsContent>

        {/* تنظیمات پشتیبان‌گیری */}
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                پشتیبان‌گیری و بازیابی
              </CardTitle>
              <CardDescription>
                مدیریت پشتیبان‌گیری خودکار و دستی
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="autoBackupEnabled">پشتیبان‌گیری خودکار</Label>
                  <p className="text-sm text-muted-foreground">
                    ایجاد خودکار فایل پشتیبان در زمان‌های مشخص
                  </p>
                </div>
                <Switch
                  id="autoBackupEnabled"
                  checked={backupSettings.autoBackupEnabled}
                  onCheckedChange={(checked) => {
                    setBackupSettings({ ...backupSettings, autoBackupEnabled: checked });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              {backupSettings.autoBackupEnabled && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">دوره تناوب</Label>
                      <Select
                        value={backupSettings.backupFrequency}
                        onValueChange={(value: any) => {
                          setBackupSettings({ ...backupSettings, backupFrequency: value });
                          setHasUnsavedChanges(true);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">روزانه</SelectItem>
                          <SelectItem value="weekly">هفتگی</SelectItem>
                          <SelectItem value="monthly">ماهانه</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="backupTime">زمان پشتیبان‌گیری</Label>
                      <Input
                        id="backupTime"
                        type="time"
                        value={backupSettings.backupTime}
                        onChange={(e) => {
                          setBackupSettings({ ...backupSettings, backupTime: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="retentionDays">مدت نگهداری (روز)</Label>
                      <Input
                        id="retentionDays"
                        type="number"
                        value={backupSettings.retentionDays}
                        onChange={(e) => {
                          setBackupSettings({
                            ...backupSettings,
                            retentionDays: Number(e.target.value),
                          });
                          setHasUnsavedChanges(true);
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="cloudBackupEnabled">پشتیبان ابری</Label>
                  <p className="text-sm text-muted-foreground">
                    ذخیره فایل‌های پشتیبان در فضای ابری
                  </p>
                </div>
                <Switch
                  id="cloudBackupEnabled"
                  checked={backupSettings.cloudBackupEnabled}
                  onCheckedChange={(checked) => {
                    setBackupSettings({ ...backupSettings, cloudBackupEnabled: checked });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              {backupSettings.cloudBackupEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="cloudProvider">سرویس ابری</Label>
                  <Select
                    value={backupSettings.cloudProvider}
                    onValueChange={(value) => {
                      setBackupSettings({ ...backupSettings, cloudProvider: value });
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب سرویس..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google-drive">Google Drive</SelectItem>
                      <SelectItem value="dropbox">Dropbox</SelectItem>
                      <SelectItem value="aws-s3">AWS S3</SelectItem>
                      <SelectItem value="azure">Azure Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Separator />

              <div className="space-y-3">
                <h4>پشتیبان‌گیری دستی</h4>
                <Button onClick={handleBackupNow} className="w-full">
                  <Database className="ml-2 h-4 w-4" />
                  ایجاد پشتیبان الان
                </Button>
                <p className="text-xs text-muted-foreground">
                  آخرین پشتیبان: امروز ساعت 02:00
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleResetSettings('پشتیبان‌گیری')}>
              <RefreshCw className="ml-2 h-4 w-4" />
              بازنشانی
            </Button>
            <Button onClick={() => handleSaveSettings('پشتیبان‌گیری')}>
              <Save className="ml-2 h-4 w-4" />
              ذخیره تغییرات
            </Button>
          </div>
        </TabsContent>

        {/* تنظیمات سئو */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SearchIcon className="h-5 w-5" />
                تنظیمات سئو و بهینه‌سازی
              </CardTitle>
              <CardDescription>
                مدیریت متاتگ‌ها و ابزارهای وب‌مستر
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">عنوان متا (Meta Title)</Label>
                <Input
                  id="metaTitle"
                  value={seoSettings.metaTitle}
                  onChange={(e) => {
                    setSeoSettings({ ...seoSettings, metaTitle: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  {seoSettings.metaTitle.length} / 60 کاراکتر
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">توضیحات متا (Meta Description)</Label>
                <Textarea
                  id="metaDescription"
                  value={seoSettings.metaDescription}
                  onChange={(e) => {
                    setSeoSettings({ ...seoSettings, metaDescription: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {seoSettings.metaDescription.length} / 160 کاراکتر
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords">کلمات کلیدی (Keywords)</Label>
                <Textarea
                  id="metaKeywords"
                  value={seoSettings.metaKeywords}
                  onChange={(e) => {
                    setSeoSettings({ ...seoSettings, metaKeywords: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  rows={2}
                  placeholder="کلمات کلیدی را با کاما جدا کنید"
                />
              </div>

              <Separator />

              <div>
                <h4 className="mb-4 flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  ابزارهای وب‌مستر
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                    <Input
                      id="googleAnalyticsId"
                      placeholder="G-XXXXXXXXXX"
                      value={seoSettings.googleAnalyticsId}
                      onChange={(e) => {
                        setSeoSettings({ ...seoSettings, googleAnalyticsId: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="googleTagManagerId">Google Tag Manager ID</Label>
                    <Input
                      id="googleTagManagerId"
                      placeholder="GTM-XXXXXXX"
                      value={seoSettings.googleTagManagerId}
                      onChange={(e) => {
                        setSeoSettings({ ...seoSettings, googleTagManagerId: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-4">robots.txt</h4>
                <Textarea
                  value={seoSettings.robotsTxt}
                  onChange={(e) => {
                    setSeoSettings({ ...seoSettings, robotsTxt: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="sitemapEnabled">فعال‌سازی Sitemap</Label>
                  <p className="text-sm text-muted-foreground">
                    ایجاد خودکار فایل sitemap.xml
                  </p>
                </div>
                <Switch
                  id="sitemapEnabled"
                  checked={seoSettings.sitemapEnabled}
                  onCheckedChange={(checked) => {
                    setSeoSettings({ ...seoSettings, sitemapEnabled: checked });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleResetSettings('سئو')}>
              <RefreshCw className="ml-2 h-4 w-4" />
              بازنشانی
            </Button>
            <Button onClick={() => handleSaveSettings('سئو')}>
              <Save className="ml-2 h-4 w-4" />
              ذخیره تغییرات
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { AdminSettings };
