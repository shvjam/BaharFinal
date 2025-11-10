import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { 
  Package, 
  Users, 
  Truck, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MapPin,
  Star,
  ArrowLeft,
  Plus,
  Activity
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { mockOrders, mockDrivers, mockCustomers, mockDashboardStats } from '../../services/mockData';
import { OrderStatus, VehicleType } from '../../types';
import { useNavigate } from 'react-router-dom';
import { SERVICE_CATEGORIES } from '../../constants';

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
};

// Helper function to get Persian date
const formatPersianDate = (date: Date) => {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Helper function to get order status badge
const getOrderStatusBadge = (status: OrderStatus) => {
  const statusConfig = {
    [OrderStatus.DRAFT]: { label: 'پیش‌نویس', variant: 'secondary' as const, icon: Clock },
    [OrderStatus.PENDING]: { label: 'در انتظار', variant: 'secondary' as const, icon: Clock },
    [OrderStatus.REVIEWING]: { label: 'در حال بررسی', variant: 'default' as const, icon: Activity },
    [OrderStatus.CONFIRMED]: { label: 'تایید شده', variant: 'default' as const, icon: CheckCircle2 },
    [OrderStatus.DRIVER_ASSIGNED]: { label: 'راننده تخصیص داده شده', variant: 'default' as const, icon: Truck },
    [OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN]: { label: 'راننده در راه', variant: 'default' as const, icon: MapPin },
    [OrderStatus.PACKING_IN_PROGRESS]: { label: 'بسته‌بندی', variant: 'default' as const, icon: Package },
    [OrderStatus.LOADING_IN_PROGRESS]: { label: 'بارگیری', variant: 'default' as const, icon: Activity },
    [OrderStatus.IN_TRANSIT]: { label: 'در حال حمل', variant: 'default' as const, icon: Truck },
    [OrderStatus.ARRIVED_AT_DESTINATION]: { label: 'رسیده به مقصد', variant: 'default' as const, icon: MapPin },
    [OrderStatus.COMPLETED]: { label: 'تکمیل شده', variant: 'default' as const, icon: CheckCircle2 },
    [OrderStatus.CANCELLED]: { label: 'لغو شده', variant: 'destructive' as const, icon: XCircle },
  };

  const config = statusConfig[status];
  if (!config) {
    return (
      <Badge variant="secondary" className="gap-1">
        <AlertCircle className="w-3 h-3" />
        نامشخص
      </Badge>
    );
  }

  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
};

export const AdminDashboard = () => {
  const navigate = useNavigate();

  // Calculate stats
  const todayOrders = mockOrders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  }).length;

  const thisMonthRevenue = mockOrders
    .filter(order => {
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      return orderDate.getMonth() === today.getMonth() && 
             orderDate.getFullYear() === today.getFullYear();
    })
    .reduce((sum, order) => sum + (order.finalPrice || order.estimatedPrice), 0);

  const onlineDrivers = mockDrivers.filter(d => d.isOnline && d.isActive).length;
  
  const recentOrders = mockOrders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Revenue chart data (last 7 days)
  const revenueData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayOrders = mockOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.toDateString() === date.toDateString();
    });
    const revenue = dayOrders.reduce((sum, order) => sum + (order.finalPrice || order.estimatedPrice), 0);
    
    return {
      name: new Intl.DateTimeFormat('fa-IR', { weekday: 'short' }).format(date),
      revenue: revenue / 1000000, // Convert to millions
      orders: dayOrders.length
    };
  });

  // Orders by status chart data
  const ordersByStatus = [
    { 
      name: 'در انتظار', 
      value: mockOrders.filter(o => 
        o.status === OrderStatus.PENDING || 
        o.status === OrderStatus.DRAFT || 
        o.status === OrderStatus.REVIEWING
      ).length, 
      color: '#94a3b8' 
    },
    { 
      name: 'تایید شده', 
      value: mockOrders.filter(o => 
        o.status === OrderStatus.CONFIRMED || 
        o.status === OrderStatus.DRIVER_ASSIGNED
      ).length, 
      color: '#3b82f6' 
    },
    { 
      name: 'در حال انجام', 
      value: mockOrders.filter(o => 
        o.status === OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN ||
        o.status === OrderStatus.PACKING_IN_PROGRESS ||
        o.status === OrderStatus.LOADING_IN_PROGRESS ||
        o.status === OrderStatus.IN_TRANSIT ||
        o.status === OrderStatus.ARRIVED_AT_DESTINATION
      ).length, 
      color: '#f59e0b' 
    },
    { 
      name: 'تکمیل شده', 
      value: mockOrders.filter(o => o.status === OrderStatus.COMPLETED).length, 
      color: '#10b981' 
    },
    { 
      name: 'لغو شده', 
      value: mockOrders.filter(o => o.status === OrderStatus.CANCELLED).length, 
      color: '#ef4444' 
    },
  ];

  // Orders by service type
  const ordersByService = mockOrders.reduce((acc, order) => {
    // Find service name from SERVICE_CATEGORIES
    const service = SERVICE_CATEGORIES.find(s => s.id === order.serviceCategoryId);
    const serviceName = service?.name || 'نامشخص';
    const existing = acc.find(item => item.name === serviceName);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: serviceName, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="mb-2">داشبورد مدیریت</h1>
          <p className="text-muted-foreground">
            خوش آمدید! اینجا می‌توانید وضعیت کلی سیستم را مشاهده کنید.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/admin/orders/new')} className="gap-2">
            <Plus className="w-4 h-4" />
            سفارش جدید
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">کل سفارشات</CardTitle>
            <Package className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mb-1">{mockDashboardStats.totalOrders}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span>{todayOrders} سفارش امروز</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">درآمد کل</CardTitle>
            <DollarSign className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mb-1">{formatCurrency(mockDashboardStats.totalRevenue)}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span>{formatCurrency(thisMonthRevenue)} این ماه</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Customers */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">مشتریان</CardTitle>
            <Users className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mb-1">{mockDashboardStats.totalCustomers}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="w-3 h-3 text-yellow-500" />
              <span>میانگین رضایت: {mockDashboardStats.avgRating}</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Drivers */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">رانندگان</CardTitle>
            <Truck className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mb-1">{mockDashboardStats.activeDrivers}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Activity className="w-3 h-3 text-green-500" />
              <span>{onlineDrivers} آنلاین</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>نمودار درآمد (۷ روز اخیر)</CardTitle>
            <CardDescription>درآمد به میلیون تومان</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)} میلیون تومان`, 'درآمد']}
                  labelStyle={{ direction: 'rtl' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="درآمد"
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>سفارشات بر اساس وضعیت</CardTitle>
            <CardDescription>توزیع سفارشات</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Orders by Service Type */}
      <Card>
        <CardHeader>
          <CardTitle>سفارشات بر اساس نوع خدمت</CardTitle>
          <CardDescription>تعداد سفارشات هر نوع خدمت</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersByService}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" name="تعداد سفارشات" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Orders & Online Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>آخرین سفارشات</CardTitle>
              <CardDescription>۵ سفارش اخیر</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/admin/orders')}
              className="gap-1"
            >
              مشاهده همه
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrders.map((order) => (
              <div 
                key={order.id} 
                className="flex items-start justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/admin/orders/${order.id}`)}
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">#{order.id}</span>
                    {getOrderStatusBadge(order.status)}
                  </div>
                  <p className="text-sm">
                    {SERVICE_CATEGORIES.find(s => s.id === order.serviceCategoryId)?.name || 'نامشخص'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPersianDate(new Date(order.createdAt))}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-sm">{formatCurrency(order.finalPrice || order.estimatedPrice)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Online Drivers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>رانندگان آنلاین</CardTitle>
              <CardDescription>{onlineDrivers} راننده فعال</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/admin/users?tab=drivers')}
              className="gap-1"
            >
              مشاهده همه
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockDrivers
              .filter(d => d.isOnline && d.isActive)
              .slice(0, 5)
              .map((driver) => (
                <div 
                  key={driver.id} 
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/users/${driver.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{driver.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">{driver.fullName}</p>
                      <p className="text-xs text-muted-foreground">{driver.licensePlate}</p>
                    </div>
                  </div>
                  <div className="text-left space-y-1">
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span>{driver.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-500">
                      <Activity className="w-3 h-3" />
                      <span>آنلاین</span>
                    </div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Active Orders Overview */}
      <Card>
        <CardHeader>
          <CardTitle>سفارشات فعال</CardTitle>
          <CardDescription>{mockDashboardStats.activeOrders} سفارش در حال انجام</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">در انتظار</span>
              </div>
              <p className="text-2xl">{mockOrders.filter(o => o.status === OrderStatus.PENDING).length}</p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">تایید شده</span>
              </div>
              <p className="text-2xl">{mockOrders.filter(o => o.status === OrderStatus.CONFIRMED).length}</p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">در حال انجام</span>
              </div>
              <p className="text-2xl">{mockOrders.filter(o => o.status === OrderStatus.IN_PROGRESS).length}</p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm text-muted-foreground">تکمیل شده</span>
              </div>
              <p className="text-2xl">{mockOrders.filter(o => o.status === OrderStatus.COMPLETED).length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
