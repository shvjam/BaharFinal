import { useState } from 'react';
import {
  MapPin,
  Home,
  Building2,
  Plus,
  Edit,
  Trash2,
  Star,
  Search,
  Grid3x3,
  List,
  Navigation,
  MoreVertical,
  Check,
  X,
  Phone,
  User,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
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
import { Address } from '../../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';

// Mock Data - آدرس‌های نمونه
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
  {
    id: 'a2',
    userId: 'c1',
    title: 'محل کار',
    fullAddress: 'تهران، منطقه 3، خیابان انقلاب، پلاک 456',
    lat: 35.7089,
    lng: 51.4011,
    district: '3',
    city: 'تهران',
    province: 'تهران',
    postalCode: '9876543210',
    details: 'ساختمان تجاری پارس، طبقه 5، واحد 502',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'a3',
    userId: 'c1',
    title: 'منزل جدید',
    fullAddress: 'تهران، منطقه 2، خیابان ولیعصر، کوچه شماره 12، پلاک 78',
    lat: 35.7219,
    lng: 51.4185,
    district: '2',
    city: 'تهران',
    province: 'تهران',
    postalCode: '1122334455',
    details: 'ساختمان مسکونی شماره 4، واحد 12',
    createdAt: new Date('2024-03-10'),
  },
];

type ViewMode = 'grid' | 'list';

const addressIcons: Record<string, any> = {
  'منزل': Home,
  'محل کار': Building2,
  'منزل جدید': Home,
  'default': MapPin,
};

export const CustomerAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteAddressId, setDeleteAddressId] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [defaultAddressId, setDefaultAddressId] = useState<string>('a1');

  // Form State
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

  // فیلتر آدرس‌ها
  const filteredAddresses = addresses.filter(
    (address) =>
      address.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.fullAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.district.includes(searchQuery)
  );

  const handleAddAddress = () => {
    if (!formData.title || !formData.fullAddress) {
      toast.error('لطفاً عنوان و آدرس را وارد کنید');
      return;
    }

    const newAddress: Address = {
      id: `a${addresses.length + 1}`,
      userId: 'c1',
      title: formData.title,
      fullAddress: formData.fullAddress,
      lat: formData.lat || 35.6892,
      lng: formData.lng || 51.3890,
      district: formData.district,
      city: formData.city,
      province: formData.province,
      postalCode: formData.postalCode,
      details: formData.details,
      createdAt: new Date(),
    };

    setAddresses([...addresses, newAddress]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('آدرس جدید با موفقیت اضافه شد');
  };

  const handleEditAddress = () => {
    if (!selectedAddress) return;

    if (!formData.title || !formData.fullAddress) {
      toast.error('لطفاً عنوان و آدرس را وارد کنید');
      return;
    }

    const updatedAddresses = addresses.map((addr) =>
      addr.id === selectedAddress.id
        ? {
            ...addr,
            title: formData.title,
            fullAddress: formData.fullAddress,
            district: formData.district,
            city: formData.city,
            province: formData.province,
            postalCode: formData.postalCode,
            details: formData.details,
          }
        : addr
    );

    setAddresses(updatedAddresses);
    setIsEditDialogOpen(false);
    setSelectedAddress(null);
    resetForm();
    toast.success('آدرس با موفقیت ویرایش شد');
  };

  const handleDeleteAddress = (id: string) => {
    if (id === defaultAddressId) {
      toast.error('نمی‌توانید آدرس پیش‌فرض را حذف کنید');
      return;
    }

    setAddresses(addresses.filter((addr) => addr.id !== id));
    setDeleteAddressId(null);
    toast.success('آدرس حذف شد');
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddressId(id);
    toast.success('آدرس پیش‌فرض تغییر کرد');
  };

  const openEditDialog = (address: Address) => {
    setSelectedAddress(address);
    setFormData({
      title: address.title,
      fullAddress: address.fullAddress,
      district: address.district,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode || '',
      details: address.details || '',
      lat: address.lat,
      lng: address.lng,
    });
    setIsEditDialogOpen(true);
  };

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

  const handleSelectLocation = () => {
    // شبیه‌سازی انتخاب موقعیت از نقشه
    const randomLat = 35.6 + Math.random() * 0.2;
    const randomLng = 51.3 + Math.random() * 0.2;
    setFormData({ ...formData, lat: randomLat, lng: randomLng });
    toast.success('موقعیت انتخاب شد');
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <MapPin className="h-8 w-8 text-primary" />
            آدرس‌های من
          </h1>
          <p className="text-muted-foreground">مدیریت آدرس‌های ذخیره شده</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="ml-2 h-4 w-4" />
              افزودن آدرس
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>افزودن آدرس جدید</DialogTitle>
              <DialogDescription>آدرس جدید خود را برای استفاده در سفارشات اضافه کنید</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 p-1">
                {/* عنوان */}
                <div className="grid gap-2">
                  <Label htmlFor="title">عنوان آدرس *</Label>
                  <Select value={formData.title} onValueChange={(value) => setFormData({ ...formData, title: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب کنید..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="منزل">منزل</SelectItem>
                      <SelectItem value="محل کار">محل کار</SelectItem>
                      <SelectItem value="منزل جدید">منزل جدید</SelectItem>
                      <SelectItem value="انبار">انبار</SelectItem>
                      <SelectItem value="سایر">سایر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* استان و شهر */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="province">استان *</Label>
                    <Select value={formData.province} onValueChange={(value) => setFormData({ ...formData, province: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="تهران">تهران</SelectItem>
                        <SelectItem value="البرز">البرز</SelectItem>
                        <SelectItem value="اصفهان">اصفهان</SelectItem>
                        <SelectItem value="فارس">فارس</SelectItem>
                        <SelectItem value="خراسان رضوی">خراسان رضوی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="city">شهر *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="مثلاً تهران"
                    />
                  </div>
                </div>

                {/* منطقه */}
                <div className="grid gap-2">
                  <Label htmlFor="district">منطقه</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="مثلاً منطقه 5"
                  />
                </div>

                {/* آدرس کامل */}
                <div className="grid gap-2">
                  <Label htmlFor="fullAddress">آدرس کامل *</Label>
                  <Textarea
                    id="fullAddress"
                    value={formData.fullAddress}
                    onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                    placeholder="خیابان، کوچه، پلاک..."
                    rows={3}
                  />
                </div>

                {/* کدپستی */}
                <div className="grid gap-2">
                  <Label htmlFor="postalCode">کد پستی (10 رقم)</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="1234567890"
                    maxLength={10}
                  />
                </div>

                {/* جزئیات */}
                <div className="grid gap-2">
                  <Label htmlFor="details">جزئیات بیشتر (اختیاری)</Label>
                  <Textarea
                    id="details"
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder="طبقه، واحد، رنگ درب و ..."
                    rows={2}
                  />
                </div>

                <Separator />

                {/* انتخاب موقعیت */}
                <div className="grid gap-2">
                  <Label>موقعیت روی نقشه</Label>
                  <div className="space-y-3">
                    <Button type="button" variant="outline" className="w-full gap-2" onClick={handleSelectLocation}>
                      <Navigation className="h-4 w-4" />
                      انتخاب از روی نقشه
                    </Button>
                    {formData.lat !== 0 && formData.lng !== 0 && (
                      <Alert>
                        <Check className="h-4 w-4" />
                        <AlertDescription>
                          موقعیت انتخاب شد: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                انصراف
              </Button>
              <Button onClick={handleAddAddress}>
                <Plus className="ml-2 h-4 w-4" />
                افزودن آدرس
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* آمار */}
      <div className="grid gap-4 md:grid-cols-4">
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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Home className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">منزل</p>
                <p className="text-2xl font-bold">
                  {addresses.filter((a) => a.title.includes('منزل')).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">محل کار</p>
                <p className="text-2xl font-bold">
                  {addresses.filter((a) => a.title.includes('کار')).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">پیش‌فرض</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* جستجو و نمایش */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="جستجو در آدرس‌ها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
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
          </div>
        </CardHeader>
        <CardContent>
          {filteredAddresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MapPin className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">آدرسی یافت نشد</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {searchQuery ? 'نتیجه‌ای برای جستجوی شما پیدا نشد' : 'شما هنوز آدرسی اضافه نکرده‌اید'}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="ml-2 h-4 w-4" />
                افزودن اولین آدرس
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAddresses.map((address) => {
                const Icon = addressIcons[address.title] || addressIcons.default;
                const isDefault = address.id === defaultAddressId;

                return (
                  <Card key={address.id} className={isDefault ? 'border-primary' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{address.title}</CardTitle>
                            {isDefault && (
                              <Badge variant="secondary" className="mt-1">
                                <Star className="ml-1 h-3 w-3" />
                                پیش‌فرض
                              </Badge>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" dir="rtl">
                            {!isDefault && (
                              <>
                                <DropdownMenuItem onClick={() => handleSetDefault(address.id)}>
                                  <Star className="ml-2 h-4 w-4" />
                                  تنظیم به عنوان پیش‌فرض
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            <DropdownMenuItem onClick={() => openEditDialog(address)}>
                              <Edit className="ml-2 h-4 w-4" />
                              ویرایش
                            </DropdownMenuItem>
                            {!isDefault && (
                              <DropdownMenuItem
                                onClick={() => setDeleteAddressId(address.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="ml-2 h-4 w-4" />
                                حذف
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                          <p className="line-clamp-2">{address.fullAddress}</p>
                        </div>
                        {address.district && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <p className="text-muted-foreground">منطقه {address.district}</p>
                          </div>
                        )}
                        {address.postalCode && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">کدپستی:</span>
                            <span className="font-mono text-xs">{address.postalCode}</span>
                          </div>
                        )}
                      </div>
                      {address.details && (
                        <>
                          <Separator />
                          <p className="text-xs text-muted-foreground">{address.details}</p>
                        </>
                      )}
                      <Separator />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          افزوده شده در{' '}
                          {new Date(address.createdAt).toLocaleDateString('fa-IR', {
                            year: 'numeric',
                            month: 'long',
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAddresses.map((address) => {
                const Icon = addressIcons[address.title] || addressIcons.default;
                const isDefault = address.id === defaultAddressId;

                return (
                  <Card key={address.id} className={isDefault ? 'border-primary' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-1 items-start gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h4>{address.title}</h4>
                              {isDefault && (
                                <Badge variant="secondary">
                                  <Star className="ml-1 h-3 w-3" />
                                  پیش‌فرض
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{address.fullAddress}</p>
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                              {address.district && (
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  منطقه {address.district}
                                </span>
                              )}
                              {address.postalCode && (
                                <span className="flex items-center gap-1 font-mono">
                                  کدپستی: {address.postalCode}
                                </span>
                              )}
                              <span>
                                {new Date(address.createdAt).toLocaleDateString('fa-IR', {
                                  year: 'numeric',
                                  month: 'long',
                                })}
                              </span>
                            </div>
                            {address.details && (
                              <p className="text-xs text-muted-foreground">{address.details}</p>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" dir="rtl">
                            {!isDefault && (
                              <>
                                <DropdownMenuItem onClick={() => handleSetDefault(address.id)}>
                                  <Star className="ml-2 h-4 w-4" />
                                  تنظیم به عنوان پیش‌فرض
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            <DropdownMenuItem onClick={() => openEditDialog(address)}>
                              <Edit className="ml-2 h-4 w-4" />
                              ویرایش
                            </DropdownMenuItem>
                            {!isDefault && (
                              <DropdownMenuItem
                                onClick={() => setDeleteAddressId(address.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="ml-2 h-4 w-4" />
                                حذف
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* دیالوگ ویرایش */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>ویرایش آدرس</DialogTitle>
            <DialogDescription>تغییرات خود را اعمال کنید</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 p-1">
              {/* فرم مشابه افزودن آدرس */}
              <div className="grid gap-2">
                <Label htmlFor="edit-title">عنوان آدرس *</Label>
                <Select value={formData.title} onValueChange={(value) => setFormData({ ...formData, title: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب کنید..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="منزل">منزل</SelectItem>
                    <SelectItem value="محل کار">محل کار</SelectItem>
                    <SelectItem value="منزل جدید">منزل جدید</SelectItem>
                    <SelectItem value="انبار">انبار</SelectItem>
                    <SelectItem value="سایر">سایر</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="edit-province">استان *</Label>
                  <Select value={formData.province} onValueChange={(value) => setFormData({ ...formData, province: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="تهران">تهران</SelectItem>
                      <SelectItem value="البرز">البرز</SelectItem>
                      <SelectItem value="اصفهان">اصفهان</SelectItem>
                      <SelectItem value="فارس">فارس</SelectItem>
                      <SelectItem value="خراسان رضوی">خراسان رضوی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-city">شهر *</Label>
                  <Input
                    id="edit-city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-district">منطقه</Label>
                <Input
                  id="edit-district"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="مثلاً منطقه 5"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-fullAddress">آدرس کامل *</Label>
                <Textarea
                  id="edit-fullAddress"
                  value={formData.fullAddress}
                  onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-postalCode">کد پستی</Label>
                <Input
                  id="edit-postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  maxLength={10}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-details">جزئیات بیشتر</Label>
                <Textarea
                  id="edit-details"
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedAddress(null);
                resetForm();
              }}
            >
              انصراف
            </Button>
            <Button onClick={handleEditAddress}>
              <Check className="ml-2 h-4 w-4" />
              ذخیره تغییرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* دیالوگ حذف */}
      <AlertDialog open={deleteAddressId !== null} onOpenChange={() => setDeleteAddressId(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
            <AlertDialogDescription>
              این آدرس برای همیشه حذف خواهد شد. این عمل قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteAddressId(null)}>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteAddressId && handleDeleteAddress(deleteAddressId)}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
