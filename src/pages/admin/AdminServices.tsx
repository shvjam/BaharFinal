import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Package,
  DollarSign,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  Settings,
  Upload,
  Download,
  Image as ImageIcon,
  BarChart3,
  Calendar,
  Users,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Switch } from '../../components/ui/switch';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { ScrollArea } from '../../components/ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { ImageUpload } from '../../components/common/ImageUpload';
import { SERVICE_CATEGORIES } from '../../constants';

// ============================================
// TYPES
// ============================================

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  icon: string;
  imageUrl?: string;
  
  // قیمت‌گذاری
  basePrice: number;
  pricePerKm?: number;
  discountPercentage?: number;
  
  // ویژگی‌ها
  features: string[];
  
  // تنظیمات
  isActive: boolean;
  isFeatured: boolean;
  order: number; // ترتیب نمایش
  minPrice?: number;
  maxPrice?: number;
  
  // آمار
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  averageRating: number;
  
  // ویرایش
  createdAt: Date;
  updatedAt?: Date;
  adminNote?: string;
}

// Mock data
const mockServices: Service[] = [
  {
    id: '1',
    name: 'اسباب‌کشی سریع، مطمئن و آسان',
    slug: 'moving-service',
    description: 'خدمات اسباب‌کشی حرفه‌ای با بهترین کیفیت و قیمت مناسب. تیم ما با تجربه و تجهیزات کامل آماده خدمت‌رسانی به شماست.',
    shortDescription: 'خدمات اسباب‌کشی حرفه‌ای',
    icon: '🚚',
    imageUrl: '',
    basePrice: 2000000,
    pricePerKm: 15000,
    discountPercentage: 0,
    features: [
      'بسته‌بندی اصولی و حرفه‌ای',
      'بیمه کامل کالا',
      'رانندگان مجرب و حرفه‌ای',
      'ماشین‌آلات مدرن',
      'پشتیبانی ۲۴ ساعته',
      'تضمین سلامت کالا',
    ],
    isActive: true,
    isFeatured: true,
    order: 1,
    minPrice: 1500000,
    maxPrice: 10000000,
    totalOrders: 1250,
    completedOrders: 1180,
    totalRevenue: 3500000000,
    averageRating: 4.8,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-11-08'),
  },
  {
    id: '2',
    name: 'کارگر',
    slug: 'worker-service',
    description: 'خدمات کارگر حرفه‌ای برای جابجایی، بارگیری و تخلیه اثاثیه منزل و اداری. کارگران ما با تجربه و آموزش دیده هستند.',
    shortDescription: 'خدمات کارگر حرفه‌ای',
    icon: '👷',
    imageUrl: '',
    basePrice: 900000,
    discountPercentage: 0,
    features: [
      'کارگران مجرب و آموزش دیده',
      'بیمه کارگران',
      'نظارت کامل',
      'انعطاف در ساعات کاری',
      'تضمین کیفیت کار',
    ],
    isActive: true,
    isFeatured: true,
    order: 2,
    minPrice: 900000,
    maxPrice: 5000000,
    totalOrders: 850,
    completedOrders: 820,
    totalRevenue: 1200000000,
    averageRating: 4.7,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-11-05'),
  },
  {
    id: '3',
    name: 'بسته‌بند یا فنی یا کارگر حمل خالی',
    slug: 'packing-worker',
    description: 'خدمات تخصصی بسته‌بندی و کارگر فنی برای حمل‌ونقل لوازم خانه و اداری. تیم متخصص ما با دقت و مهارت کالاها را بسته‌بندی می‌کنند.',
    shortDescription: 'خدمات بسته‌بندی تخصصی',
    icon: '📦',
    imageUrl: '',
    basePrice: 1200000,
    discountPercentage: 5,
    features: [
      'بسته‌بندی اصولی با مواد مرغوب',
      'کارگران فنی متخصص',
      'سرعت بالا در انجام کار',
      'تضمین سلامت کالا',
      'قیمت مناسب',
    ],
    isActive: true,
    isFeatured: false,
    order: 3,
    minPrice: 800000,
    maxPrice: 4000000,
    totalOrders: 620,
    completedOrders: 595,
    totalRevenue: 950000000,
    averageRating: 4.6,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-11-02'),
  },
  {
    id: '4',
    name: 'محصولات بسته‌بندی',
    slug: 'packing-products',
    description: 'فروش انواع لوازم و محصولات بسته‌بندی با کیفیت عالی و قیمت مناسب. کارتن، چسب، پلاستیک حبابدار و سایر لوازم بسته‌بندی.',
    shortDescription: 'فروش لوازم بسته‌بندی',
    icon: '🛒',
    imageUrl: '',
    basePrice: 50000,
    discountPercentage: 10,
    features: [
      'کیفیت عالی محصولات',
      'قیمت مناسب',
      'ارسال رایگان بالای ۵۰۰ هزار تومان',
      'تنوع بالا',
      'ضمانت بازگشت',
    ],
    isActive: true,
    isFeatured: false,
    order: 4,
    minPrice: 25000,
    maxPrice: 500000,
    totalOrders: 450,
    completedOrders: 445,
    totalRevenue: 180000000,
    averageRating: 4.5,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-10-28'),
  },
  {
    id: '5',
    name: 'انبار',
    slug: 'warehouse',
    description: 'خدمات اجاره انبار و نگهداری اثاثیه با امکانات کامل و امنیت بالا. انبارهای ما در موقعیت‌های مختلف شهر قرار دارند.',
    shortDescription: 'اجاره انبار و نگهداری',
    icon: '🏢',
    imageUrl: '',
    basePrice: 5000000,
    discountPercentage: 0,
    features: [
      'امنیت ۲۴ ساعته',
      'دوربین مداربسته',
      'بیمه کالا',
      'دسترسی آسان',
      'فضاهای مختلف',
      'قیمت مناسب',
    ],
    isActive: true,
    isFeatured: false,
    order: 5,
    minPrice: 2000000,
    maxPrice: 20000000,
    totalOrders: 180,
    completedOrders: 175,
    totalRevenue: 1100000000,
    averageRating: 4.4,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-11-01'),
  },
  {
    id: '6',
    name: 'خرده‌بار',
    slug: 'small-cargo',
    description: 'حمل بارهای خرده و کوچک با سرعت و دقت بالا. مناسب برای حمل اقلام کم حجم و ارزشمند.',
    shortDescription: 'حمل بارهای خرده',
    icon: '📦',
    imageUrl: '',
    basePrice: 800000,
    pricePerKm: 12000,
    discountPercentage: 0,
    features: [
      'ارسال سریع',
      'بیمه کالا',
      'پیگیری آنلاین',
      'بسته‌بندی رایگان',
      'قیمت مناسب',
    ],
    isActive: true,
    isFeatured: false,
    order: 6,
    minPrice: 500000,
    maxPrice: 3000000,
    totalOrders: 520,
    completedOrders: 505,
    totalRevenue: 650000000,
    averageRating: 4.3,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-10-25'),
  },
  {
    id: '7',
    name: 'یک یا دو قلم جنس بیشتر ندارم',
    slug: 'single-item',
    description: 'حمل یک یا دو قطعه اثاثیه با قیمت ویژه و خدمات کامل. مناسب برای جابجایی تکی وسایل.',
    shortDescription: 'حمل تکی اثاثیه',
    icon: '📦',
    imageUrl: '',
    basePrice: 600000,
    pricePerKm: 10000,
    discountPercentage: 0,
    features: [
      'قیمت ویژه',
      'سرعت بالا',
      'بدون نیاز به کارگر اضافی',
      'مناسب برای یک یا دو قطعه',
      'پیگیری آنلاین',
    ],
    isActive: true,
    isFeatured: false,
    order: 7,
    minPrice: 400000,
    maxPrice: 2000000,
    totalOrders: 720,
    completedOrders: 695,
    totalRevenue: 580000000,
    averageRating: 4.6,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-11-03'),
  },
];

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'featured'>('all');
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // فرم خدمت
  const [serviceForm, setServiceForm] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    icon: '📦',
    imageUrl: '',
    basePrice: 0,
    pricePerKm: 0,
    discountPercentage: 0,
    features: [''],
    isActive: true,
    isFeatured: false,
    order: 1,
    minPrice: 0,
    maxPrice: 0,
    adminNote: '',
  });

  // فیلتر خدمات
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && service.isActive) ||
      (statusFilter === 'inactive' && !service.isActive) ||
      (statusFilter === 'featured' && service.isFeatured);

    return matchesSearch && matchesStatus;
  });

  // محاسبه آمار
  const stats = {
    total: services.length,
    active: services.filter((s) => s.isActive).length,
    inactive: services.filter((s) => !s.isActive).length,
    featured: services.filter((s) => s.isFeatured).length,
    totalOrders: services.reduce((sum, s) => sum + s.totalOrders, 0),
    totalRevenue: services.reduce((sum, s) => sum + s.totalRevenue, 0),
    averageRating: services.reduce((sum, s) => sum + s.averageRating, 0) / services.length,
  };

  // Handlers
  const handleAddService = () => {
    setServiceForm({
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      icon: '📦',
      imageUrl: '',
      basePrice: 0,
      pricePerKm: 0,
      discountPercentage: 0,
      features: [''],
      isActive: true,
      isFeatured: false,
      order: services.length + 1,
      minPrice: 0,
      maxPrice: 0,
      adminNote: '',
    });
    setIsAddDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setServiceForm({
      name: service.name,
      slug: service.slug,
      description: service.description,
      shortDescription: service.shortDescription || '',
      icon: service.icon,
      imageUrl: service.imageUrl || '',
      basePrice: service.basePrice,
      pricePerKm: service.pricePerKm || 0,
      discountPercentage: service.discountPercentage || 0,
      features: service.features.length > 0 ? service.features : [''],
      isActive: service.isActive,
      isFeatured: service.isFeatured,
      order: service.order,
      minPrice: service.minPrice || 0,
      maxPrice: service.maxPrice || 0,
      adminNote: service.adminNote || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteService = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleViewDetails = (service: Service) => {
    setSelectedService(service);
    setIsDetailsDialogOpen(true);
  };

  const handleSaveService = () => {
    if (isEditDialogOpen && selectedService) {
      setServices(
        services.map((s) =>
          s.id === selectedService.id
            ? {
                ...s,
                name: serviceForm.name,
                slug: serviceForm.slug,
                description: serviceForm.description,
                shortDescription: serviceForm.shortDescription,
                icon: serviceForm.icon,
                imageUrl: serviceForm.imageUrl,
                basePrice: serviceForm.basePrice,
                pricePerKm: serviceForm.pricePerKm,
                discountPercentage: serviceForm.discountPercentage,
                features: serviceForm.features.filter((f) => f.trim() !== ''),
                isActive: serviceForm.isActive,
                isFeatured: serviceForm.isFeatured,
                order: serviceForm.order,
                minPrice: serviceForm.minPrice,
                maxPrice: serviceForm.maxPrice,
                adminNote: serviceForm.adminNote,
                updatedAt: new Date(),
              }
            : s
        )
      );
      toast.success('خدمت با موفقیت ویرایش شد');
      setIsEditDialogOpen(false);
    } else {
      const newService: Service = {
        id: `service-${Date.now()}`,
        name: serviceForm.name,
        slug: serviceForm.slug,
        description: serviceForm.description,
        shortDescription: serviceForm.shortDescription,
        icon: serviceForm.icon,
        imageUrl: serviceForm.imageUrl,
        basePrice: serviceForm.basePrice,
        pricePerKm: serviceForm.pricePerKm,
        discountPercentage: serviceForm.discountPercentage,
        features: serviceForm.features.filter((f) => f.trim() !== ''),
        isActive: serviceForm.isActive,
        isFeatured: serviceForm.isFeatured,
        order: serviceForm.order,
        minPrice: serviceForm.minPrice,
        maxPrice: serviceForm.maxPrice,
        totalOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
        averageRating: 0,
        createdAt: new Date(),
        adminNote: serviceForm.adminNote,
      };
      setServices([...services, newService]);
      toast.success('خدمت جدید با موفقیت افزوده شد');
      setIsAddDialogOpen(false);
    }
  };

  const confirmDeleteService = () => {
    if (selectedService) {
      setServices(services.filter((s) => s.id !== selectedService.id));
      toast.success('خدمت با موفقیت حذف شد');
      setIsDeleteDialogOpen(false);
      setSelectedService(null);
    }
  };

  const toggleServiceStatus = (serviceId: string) => {
    setServices(
      services.map((s) =>
        s.id === serviceId ? { ...s, isActive: !s.isActive, updatedAt: new Date() } : s
      )
    );
    toast.success('وضعیت خدمت تغییر یافت');
  };

  const toggleFeaturedStatus = (serviceId: string) => {
    setServices(
      services.map((s) =>
        s.id === serviceId ? { ...s, isFeatured: !s.isFeatured, updatedAt: new Date() } : s
      )
    );
    toast.success('وضعیت ویژه تغییر یافت');
  };

  const addFeature = () => {
    setServiceForm({ ...serviceForm, features: [...serviceForm.features, ''] });
  };

  const removeFeature = (index: number) => {
    setServiceForm({
      ...serviceForm,
      features: serviceForm.features.filter((_, i) => i !== index),
    });
  };

  const updateFeature = (index: number, value: string) => {
    setServiceForm({
      ...serviceForm,
      features: serviceForm.features.map((f, i) => (i === index ? value : f)),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">مدیریت خدمات</h1>
          <p className="text-muted-foreground mt-1">
            مدیریت کامل خدمات و قیمت‌گذاری‌ها
          </p>
        </div>
        <Button onClick={handleAddService}>
          <Plus className="ml-2 h-4 w-4" />
          افزودن خدمت جدید
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">کل خدمات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} فعال، {stats.inactive} غیرفعال
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">خدمات ویژه</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.featured}</div>
            <p className="text-xs text-muted-foreground">
              در صفحه اصلی نمایش داده می‌شود
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">کل سفارشات</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalOrders.toLocaleString('fa-IR')}</div>
            <p className="text-xs text-muted-foreground">از تمام خدمات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">کل درآمد</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {(stats.totalRevenue / 1000000).toLocaleString('fa-IR')} م
            </div>
            <p className="text-xs text-muted-foreground">
              میانگین امتیاز: {stats.averageRating.toFixed(1)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>فیلتر و جستجو</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="جستجو بر اساس نام، توضیحات یا slug..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه خدمات</SelectItem>
                <SelectItem value="active">فعال</SelectItem>
                <SelectItem value="inactive">غیرفعال</SelectItem>
                <SelectItem value="featured">ویژه</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>لیست خدمات ({filteredServices.length})</CardTitle>
          <CardDescription>مدیریت و ویرایش خدمات موجود</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">خدمت</TableHead>
                  <TableHead className="text-right">قیمت پایه</TableHead>
                  <TableHead className="text-right">آمار</TableHead>
                  <TableHead className="text-right">امتیاز</TableHead>
                  <TableHead className="text-right">درآمد</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      خدمتی یافت نشد
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredServices
                    .sort((a, b) => a.order - b.order)
                    .map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-2xl">
                              {service.icon}
                            </div>
                            <div>
                              <div>{service.name}</div>
                              <div className="text-xs text-muted-foreground">{service.slug}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div>{(service.basePrice / 1000000).toFixed(1)} میلیون</div>
                            {service.discountPercentage > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {service.discountPercentage}% تخفیف
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div>{service.totalOrders} سفارش</div>
                            <div className="text-xs text-muted-foreground">
                              {service.completedOrders} تکمیل شده
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span>{service.averageRating.toFixed(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{(service.totalRevenue / 1000000).toLocaleString('fa-IR')} م</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant={service.isActive ? 'default' : 'secondary'}>
                              {service.isActive ? 'فعال' : 'غیرفعال'}
                            </Badge>
                            {service.isFeatured && (
                              <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                                ویژه
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewDetails(service)}>
                                <Eye className="ml-2 h-4 w-4" />
                                مشاهده جزئیات
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditService(service)}>
                                <Edit className="ml-2 h-4 w-4" />
                                ویرایش
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleServiceStatus(service.id)}>
                                {service.isActive ? (
                                  <>
                                    <XCircle className="ml-2 h-4 w-4" />
                                    غیرفعال کردن
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="ml-2 h-4 w-4" />
                                    فعال کردن
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleFeaturedStatus(service.id)}>
                                {service.isFeatured ? 'حذف از ویژه' : 'افزودن به ویژه'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteService(service)}
                                className="text-red-600"
                              >
                                <Trash2 className="ml-2 h-4 w-4" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {isEditDialogOpen ? 'ویرایش خدمت' : 'افزودن خدمت جدید'}
            </DialogTitle>
            <DialogDescription>
              {isEditDialogOpen
                ? 'اطلاعات خدمت را ویرایش کنید'
                : 'اطلاعات خدمت جدید را وارد کنید'}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" dir="rtl">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">اطلاعات پایه</TabsTrigger>
              <TabsTrigger value="pricing">قیمت‌گذاری</TabsTrigger>
              <TabsTrigger value="features">ویژگی‌ها</TabsTrigger>
              <TabsTrigger value="settings">تنظیمات</TabsTrigger>
            </TabsList>

            {/* اطلاعات پایه */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">نام خدمت *</Label>
                  <Input
                    id="name"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    placeholder="اسباب‌کشی سریع، مطمئن و آسان"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={serviceForm.slug}
                    onChange={(e) => setServiceForm({ ...serviceForm, slug: e.target.value })}
                    placeholder="moving-service"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">آیکون *</Label>
                  <Input
                    id="icon"
                    value={serviceForm.icon}
                    onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                    placeholder="🚚"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="shortDescription">توضیحات کوتاه</Label>
                  <Input
                    id="shortDescription"
                    value={serviceForm.shortDescription}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, shortDescription: e.target.value })
                    }
                    placeholder="خدمات اسباب‌کشی حرفه‌ای"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">توضیحات کامل *</Label>
                  <Textarea
                    id="description"
                    value={serviceForm.description}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, description: e.target.value })
                    }
                    placeholder="توضیحات کامل خدمت..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>تصویر خدمت</Label>
                  <ImageUpload
                    currentImage={serviceForm.imageUrl}
                    onImageChange={(url) => setServiceForm({ ...serviceForm, imageUrl: url })}
                    onImageRemove={() => setServiceForm({ ...serviceForm, imageUrl: '' })}
                  />
                </div>
              </div>
            </TabsContent>

            {/* قیمت‌گذاری */}
            <TabsContent value="pricing" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">قیمت پایه (تومان) *</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    value={serviceForm.basePrice}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, basePrice: parseInt(e.target.value) || 0 })
                    }
                    placeholder="2000000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricePerKm">قیمت هر کیلومتر (تومان)</Label>
                  <Input
                    id="pricePerKm"
                    type="number"
                    value={serviceForm.pricePerKm}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, pricePerKm: parseInt(e.target.value) || 0 })
                    }
                    placeholder="15000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountPercentage">درصد تخفیف (%)</Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={serviceForm.discountPercentage}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        discountPercentage: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">ترتیب نمایش</Label>
                  <Input
                    id="order"
                    type="number"
                    value={serviceForm.order}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, order: parseInt(e.target.value) || 1 })
                    }
                    placeholder="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minPrice">حداقل قیمت (تومان)</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    value={serviceForm.minPrice}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, minPrice: parseInt(e.target.value) || 0 })
                    }
                    placeholder="1500000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPrice">حداکثر قیمت (تومان)</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    value={serviceForm.maxPrice}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, maxPrice: parseInt(e.target.value) || 0 })
                    }
                    placeholder="10000000"
                  />
                </div>
              </div>
            </TabsContent>

            {/* ویژگی‌ها */}
            <TabsContent value="features" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>ویژگی‌های خدمت</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                    <Plus className="ml-2 h-4 w-4" />
                    افزودن ویژگی
                  </Button>
                </div>

                <div className="space-y-2">
                  {serviceForm.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="مثال: بیمه کامل کالا"
                      />
                      {serviceForm.features.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeFeature(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {serviceForm.features.filter((f) => f.trim() !== '').length > 0 && (
                  <div className="mt-4 rounded-lg border bg-muted p-4">
                    <p className="mb-2 text-sm">پیش‌نمایش ویژگی‌ها:</p>
                    <ul className="list-inside list-disc space-y-1">
                      {serviceForm.features
                        .filter((f) => f.trim() !== '')
                        .map((feature, index) => (
                          <li key={index} className="text-sm">
                            {feature}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* تنظیمات */}
            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>وضعیت فعال/غیرفعال</Label>
                    <p className="text-sm text-muted-foreground">
                      خدمت برای مشتریان قابل مشاهده باشد
                    </p>
                  </div>
                  <Switch
                    checked={serviceForm.isActive}
                    onCheckedChange={(checked) =>
                      setServiceForm({ ...serviceForm, isActive: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>خدمت ویژه</Label>
                    <p className="text-sm text-muted-foreground">
                      نمایش در صفحه اصلی و جایگاه ویژه
                    </p>
                  </div>
                  <Switch
                    checked={serviceForm.isFeatured}
                    onCheckedChange={(checked) =>
                      setServiceForm({ ...serviceForm, isFeatured: checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminNote">یادداشت ادمین</Label>
                  <Textarea
                    id="adminNote"
                    value={serviceForm.adminNote}
                    onChange={(e) => setServiceForm({ ...serviceForm, adminNote: e.target.value })}
                    placeholder="یادداشت‌های داخلی درباره خدمت..."
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
              }}
            >
              انصراف
            </Button>
            <Button onClick={handleSaveService}>
              {isEditDialogOpen ? 'ذخیره تغییرات' : 'افزودن خدمت'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف خدمت</DialogTitle>
            <DialogDescription>
              آیا مطمئن هستید که می‌خواهید خدمت "{selectedService?.name}" را حذف کنید؟ این عمل
              قابل بازگشت نیست.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              انصراف
            </Button>
            <Button variant="destructive" onClick={confirmDeleteService}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>جزئیات خدمت</DialogTitle>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-4xl">
                  {selectedService.icon}
                </div>
                <div className="flex-1 space-y-1">
                  <h3>{selectedService.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedService.slug}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedService.isActive ? 'default' : 'secondary'}>
                      {selectedService.isActive ? 'فعال' : 'غیرفعال'}
                    </Badge>
                    {selectedService.isFeatured && (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                        ویژه
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Stats */}
              <div>
                <h4 className="mb-4">آمار عملکرد</h4>
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">کل سفارشات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl">{selectedService.totalOrders}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">تکمیل شده</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl">{selectedService.completedOrders}</div>
                      <p className="text-xs text-muted-foreground">
                        {((selectedService.completedOrders / selectedService.totalOrders) * 100).toFixed(
                          1
                        )}
                        % نرخ تکمیل
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">امتیاز</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{selectedService.averageRating.toFixed(1)}</span>
                        <span className="text-yellow-500">⭐</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">کل درآمد</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl">
                        {(selectedService.totalRevenue / 1000000).toFixed(1)} م
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* توضیحات */}
              <div>
                <h4 className="mb-2">توضیحات</h4>
                <p className="text-sm text-muted-foreground">{selectedService.description}</p>
              </div>

              <Separator />

              {/* قیمت‌گذاری */}
              <div>
                <h4 className="mb-4">قیمت‌گذاری</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">قیمت پایه</div>
                    <div>{(selectedService.basePrice / 1000000).toFixed(1)} میلیون تومان</div>
                  </div>

                  {selectedService.pricePerKm && selectedService.pricePerKm > 0 && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">قیمت هر کیلومتر</div>
                      <div>{selectedService.pricePerKm.toLocaleString('fa-IR')} تومان</div>
                    </div>
                  )}

                  {selectedService.discountPercentage && selectedService.discountPercentage > 0 && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">تخفیف</div>
                      <div>{selectedService.discountPercentage}%</div>
                    </div>
                  )}

                  {selectedService.minPrice && selectedService.minPrice > 0 && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">حداقل قیمت</div>
                      <div>{(selectedService.minPrice / 1000000).toFixed(1)} میلیون تومان</div>
                    </div>
                  )}

                  {selectedService.maxPrice && selectedService.maxPrice > 0 && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">حداکثر قیمت</div>
                      <div>{(selectedService.maxPrice / 1000000).toFixed(1)} میلیون تومان</div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* ویژگی‌ها */}
              {selectedService.features.length > 0 && (
                <>
                  <div>
                    <h4 className="mb-4">ویژگی‌ها</h4>
                    <ul className="list-inside list-disc space-y-2">
                      {selectedService.features.map((feature, index) => (
                        <li key={index} className="text-sm">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Separator />
                </>
              )}

              {/* یادداشت ادمین */}
              {selectedService.adminNote && (
                <div>
                  <h4 className="mb-2">یادداشت ادمین</h4>
                  <p className="rounded-lg bg-muted p-3 text-sm">{selectedService.adminNote}</p>
                </div>
              )}

              {/* تاریخ‌ها */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">تاریخ ایجاد</div>
                  <div>{new Date(selectedService.createdAt).toLocaleDateString('fa-IR')}</div>
                </div>
                {selectedService.updatedAt && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">آخرین بروزرسانی</div>
                    <div>{new Date(selectedService.updatedAt).toLocaleDateString('fa-IR')}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
