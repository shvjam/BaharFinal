import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { 
  Pencil, 
  Save, 
  DollarSign, 
  Truck, 
  Users, 
  Building2,
  Package,
  Box,
  MapPin,
  Clock,
  Settings
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { VehicleType } from '../../types';
import { 
  SERVICE_CATEGORIES, 
  VEHICLE_TYPES, 
  HEAVY_ITEMS,
  PACKING_PRODUCTS_DATA,
  DEFAULT_PRICING
} from '../../constants';

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
};

export const AdminPricing = () => {
  // State for pricing config
  const [pricingConfig, setPricingConfig] = useState(DEFAULT_PRICING);
  const [servicePrices, setServicePrices] = useState(
    SERVICE_CATEGORIES.map((service, index) => ({
      ...service,
      basePrice: 1000000 + (index * 500000),
      isActive: true
    }))
  );
  const [heavyItemPrices, setHeavyItemPrices] = useState(HEAVY_ITEMS);
  const [packingProductPrices, setPackingProductPrices] = useState(PACKING_PRODUCTS_DATA);
  
  // Dialog states
  const [editingWorkerRate, setEditingWorkerRate] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleType | null>(null);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editingHeavyItem, setEditingHeavyItem] = useState<string | null>(null);
  const [editingPackingProduct, setEditingPackingProduct] = useState<string | null>(null);

  // Temp values for editing
  const [tempWorkerRate, setTempWorkerRate] = useState(pricingConfig.baseWorkerRate);
  const [tempVehicleRate, setTempVehicleRate] = useState(0);
  const [tempServicePrice, setTempServicePrice] = useState(0);
  const [tempHeavyItemPrice, setTempHeavyItemPrice] = useState(0);
  const [tempPackingProductPrice, setTempPackingProductPrice] = useState(0);
  const [tempPerKmRate, setTempPerKmRate] = useState(pricingConfig.perKmRate);
  const [tempPerFloorRate, setTempPerFloorRate] = useState(pricingConfig.perFloorRate);
  const [tempStopRate, setTempStopRate] = useState(pricingConfig.stopRate);
  const [tempPackingHourlyRate, setTempPackingHourlyRate] = useState(pricingConfig.packingHourlyRate);

  // Save handlers
  const handleSaveWorkerRate = () => {
    setPricingConfig({ ...pricingConfig, baseWorkerRate: tempWorkerRate });
    setEditingWorkerRate(false);
    toast.success('نرخ کارگر با موفقیت ذخیره شد');
  };

  const handleSaveVehicleRate = () => {
    if (editingVehicle) {
      setPricingConfig({
        ...pricingConfig,
        baseVehicleRates: {
          ...pricingConfig.baseVehicleRates,
          [editingVehicle]: tempVehicleRate
        }
      });
      setEditingVehicle(null);
      toast.success('نرخ وسیله نقلیه با موفقیت ذخیره شد');
    }
  };

  const handleSaveServicePrice = () => {
    if (editingService) {
      setServicePrices(prev => 
        prev.map(s => s.id === editingService ? { ...s, basePrice: tempServicePrice } : s)
      );
      setEditingService(null);
      toast.success('قیمت خدمت با موفقیت ذخیره شد');
    }
  };

  const handleSaveHeavyItemPrice = () => {
    if (editingHeavyItem) {
      setHeavyItemPrices(prev => 
        prev.map(item => item.id === editingHeavyItem ? { ...item, basePrice: tempHeavyItemPrice } : item)
      );
      setEditingHeavyItem(null);
      toast.success('قیمت آیتم سنگین با موفقیت ذخیره شد');
    }
  };

  const handleSavePackingProductPrice = () => {
    if (editingPackingProduct) {
      setPackingProductPrices(prev => 
        prev.map(product => product.id === editingPackingProduct ? { ...product, price: tempPackingProductPrice } : product)
      );
      setEditingPackingProduct(null);
      toast.success('قیمت محصول بسته‌بندی با موفقیت ذخیره شد');
    }
  };

  const handleSaveDistancePricing = () => {
    setPricingConfig({ 
      ...pricingConfig, 
      perKmRate: tempPerKmRate 
    });
    toast.success('تعرفه مسافت با موفقیت ذخیره شد');
  };

  const handleSaveFloorPricing = () => {
    setPricingConfig({ 
      ...pricingConfig, 
      perFloorRate: tempPerFloorRate 
    });
    toast.success('تعرفه طبقه با موفقیت ذخیره شد');
  };

  const handleSaveAdditionalServices = () => {
    setPricingConfig({ 
      ...pricingConfig, 
      stopRate: tempStopRate,
      packingHourlyRate: tempPackingHourlyRate
    });
    toast.success('تعرفه خدمات اضافی با موفقیت ذخیره شد');
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="mb-2">تعرفه و قیمت‌گذاری</h1>
          <p className="text-muted-foreground">
            مدیریت کامل تعرفه‌ها و قیمت‌گذاری خدمات
          </p>
        </div>
        <Button className="gap-2">
          <Save className="w-4 h-4" />
          ذخیره همه تغییرات
        </Button>
      </div>

      {/* Pricing Tabs */}
      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2 h-auto p-1">
          <TabsTrigger value="services" className="gap-2">
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">قیمت خدمات</span>
            <span className="sm:hidden">خدمات</span>
          </TabsTrigger>
          <TabsTrigger value="workers-vehicles" className="gap-2">
            <Truck className="w-4 h-4" />
            <span className="hidden sm:inline">کارگر و ماشین</span>
            <span className="sm:hidden">کارگر</span>
          </TabsTrigger>
          <TabsTrigger value="catalog" className="gap-2">
            <Box className="w-4 h-4" />
            <span className="hidden sm:inline">کاتالوگ آیتم‌ها</span>
            <span className="sm:hidden">کاتالوگ</span>
          </TabsTrigger>
          <TabsTrigger value="additional" className="gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">خدمات اضافی</span>
            <span className="sm:hidden">اضافی</span>
          </TabsTrigger>
        </TabsList>

        {/* Service Prices Tab */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                قیمت‌گذاری خدمات
              </CardTitle>
              <CardDescription>
                قیمت پایه هر نوع خدمت را مشخص کنید
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">نام خدمت</TableHead>
                      <TableHead className="text-right">توضیحات</TableHead>
                      <TableHead className="text-right">قیمت پایه</TableHead>
                      <TableHead className="text-right">وضعیت</TableHead>
                      <TableHead className="text-right">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servicePrices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{service.icon}</span>
                            <span>{service.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm max-w-xs">
                          {service.description}
                        </TableCell>
                        <TableCell>
                          <span className="font-mono">{formatCurrency(service.basePrice)}</span>
                        </TableCell>
                        <TableCell>
                          <Switch 
                            checked={service.isActive}
                            onCheckedChange={(checked) => {
                              setServicePrices(prev => 
                                prev.map(s => s.id === service.id ? { ...s, isActive: checked } : s)
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Dialog 
                            open={editingService === service.id}
                            onOpenChange={(open) => {
                              if (open) {
                                setEditingService(service.id);
                                setTempServicePrice(service.basePrice);
                              } else {
                                setEditingService(null);
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="gap-2">
                                <Pencil className="w-4 h-4" />
                                ویرایش
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>ویرایش قیمت خدمت</DialogTitle>
                                <DialogDescription>
                                  {service.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>قیمت پایه (تومان)</Label>
                                  <Input
                                    type="number"
                                    value={tempServicePrice}
                                    onChange={(e) => setTempServicePrice(Number(e.target.value))}
                                    dir="ltr"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={handleSaveServicePrice}>ذخیره</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workers & Vehicles Tab */}
        <TabsContent value="workers-vehicles" className="space-y-4">
          {/* Worker Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                نرخ کارگر
              </CardTitle>
              <CardDescription>
                نرخ پایه هر کارگر را تعیین کنید
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="mb-1">نرخ هر کارگر</p>
                  <p className="text-sm text-muted-foreground">
                    این مبلغ برای هر کارگر در فرم ثبت سفارش محاسبه می‌شود
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono">{formatCurrency(pricingConfig.baseWorkerRate)}</span>
                  <Dialog 
                    open={editingWorkerRate}
                    onOpenChange={(open) => {
                      if (open) {
                        setEditingWorkerRate(true);
                        setTempWorkerRate(pricingConfig.baseWorkerRate);
                      } else {
                        setEditingWorkerRate(false);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Pencil className="w-4 h-4" />
                        ویرایش
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>ویرایش نرخ کارگر</DialogTitle>
                        <DialogDescription>
                          نرخ پایه هر کارگر را وارد کنید
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>نرخ (تومان)</Label>
                          <Input
                            type="number"
                            value={tempWorkerRate}
                            onChange={(e) => setTempWorkerRate(Number(e.target.value))}
                            dir="ltr"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleSaveWorkerRate}>ذخیره</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                نرخ وسایل نقلیه
              </CardTitle>
              <CardDescription>
                نرخ پایه هر نوع وسیله نقلیه را تعیین کنید
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">نوع وسیله</TableHead>
                      <TableHead className="text-right">ظرفیت</TableHead>
                      <TableHead className="text-right">ن��خ پایه</TableHead>
                      <TableHead className="text-right">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {VEHICLE_TYPES.map((vehicle) => (
                      <TableRow key={vehicle.value}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{vehicle.icon}</span>
                            <span>{vehicle.label}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {vehicle.capacity}
                        </TableCell>
                        <TableCell>
                          <span className="font-mono">
                            {formatCurrency(pricingConfig.baseVehicleRates[vehicle.value])}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Dialog 
                            open={editingVehicle === vehicle.value}
                            onOpenChange={(open) => {
                              if (open) {
                                setEditingVehicle(vehicle.value);
                                setTempVehicleRate(pricingConfig.baseVehicleRates[vehicle.value]);
                              } else {
                                setEditingVehicle(null);
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="gap-2">
                                <Pencil className="w-4 h-4" />
                                ویرایش
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>ویرایش نرخ {vehicle.label}</DialogTitle>
                                <DialogDescription>
                                  نرخ پایه این وسیله نقلیه را وارد کنید
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>نرخ (تومان)</Label>
                                  <Input
                                    type="number"
                                    value={tempVehicleRate}
                                    onChange={(e) => setTempVehicleRate(Number(e.target.value))}
                                    dir="ltr"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={handleSaveVehicleRate}>ذخیره</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Catalog Items Tab */}
        <TabsContent value="catalog" className="space-y-4">
          {/* Heavy Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="w-5 h-5" />
                آیتم‌های سنگین
              </CardTitle>
              <CardDescription>
                قیمت‌گذاری آیتم‌های سنگین و حجیم
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">نام آیتم</TableHead>
                      <TableHead className="text-right">دسته‌بندی</TableHead>
                      <TableHead className="text-right">قیمت</TableHead>
                      <TableHead className="text-right">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {heavyItemPrices.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono">{formatCurrency(item.basePrice)}</span>
                        </TableCell>
                        <TableCell>
                          <Dialog 
                            open={editingHeavyItem === item.id}
                            onOpenChange={(open) => {
                              if (open) {
                                setEditingHeavyItem(item.id);
                                setTempHeavyItemPrice(item.basePrice);
                              } else {
                                setEditingHeavyItem(null);
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="gap-2">
                                <Pencil className="w-4 h-4" />
                                ویرایش
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>ویرایش قیمت</DialogTitle>
                                <DialogDescription>{item.name}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>قیمت (تومان)</Label>
                                  <Input
                                    type="number"
                                    value={tempHeavyItemPrice}
                                    onChange={(e) => setTempHeavyItemPrice(Number(e.target.value))}
                                    dir="ltr"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={handleSaveHeavyItemPrice}>ذخیره</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Packing Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                محصولات بسته‌بندی
              </CardTitle>
              <CardDescription>
                قیمت‌گذاری محصولات و لوازم بسته‌بندی
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">نام محصول</TableHead>
                      <TableHead className="text-right">توضیحات</TableHead>
                      <TableHead className="text-right">واحد</TableHead>
                      <TableHead className="text-right">قیمت</TableHead>
                      <TableHead className="text-right">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {packingProductPrices.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs">
                          {product.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{product.unit}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono">{formatCurrency(product.price)}</span>
                        </TableCell>
                        <TableCell>
                          <Dialog 
                            open={editingPackingProduct === product.id}
                            onOpenChange={(open) => {
                              if (open) {
                                setEditingPackingProduct(product.id);
                                setTempPackingProductPrice(product.price);
                              } else {
                                setEditingPackingProduct(null);
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="gap-2">
                                <Pencil className="w-4 h-4" />
                                ویرایش
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>ویرایش قیمت</DialogTitle>
                                <DialogDescription>{product.name}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>قیمت (تومان)</Label>
                                  <Input
                                    type="number"
                                    value={tempPackingProductPrice}
                                    onChange={(e) => setTempPackingProductPrice(Number(e.target.value))}
                                    dir="ltr"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={handleSavePackingProductPrice}>ذخیره</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional Services Tab */}
        <TabsContent value="additional" className="space-y-4">
          {/* Distance Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                تعرفه مسافت
              </CardTitle>
              <CardDescription>
                نرخ محاسبه هزینه بر اساس مسافت
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>نرخ هر کیلومتر (تومان)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={tempPerKmRate}
                    onChange={(e) => setTempPerKmRate(Number(e.target.value))}
                    dir="ltr"
                    className="flex-1"
                  />
                  <Button onClick={handleSaveDistancePricing}>ذخیره</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  قیمت فعلی: {formatCurrency(pricingConfig.perKmRate)} به ازای هر کیلومتر
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Floor Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                تعرفه طبقه
              </CardTitle>
              <CardDescription>
                نرخ محاسبه هزینه بر اساس طبقه
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>نرخ هر طبقه (تومان)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={tempPerFloorRate}
                    onChange={(e) => setTempPerFloorRate(Number(e.target.value))}
                    dir="ltr"
                    className="flex-1"
                  />
                  <Button onClick={handleSaveFloorPricing}>ذخیره</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  قیمت فعلی: {formatCurrency(pricingConfig.perFloorRate)} به ازای هر طبقه
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Other Additional Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                سایر خدمات
              </CardTitle>
              <CardDescription>
                تعرفه خدمات اضافی دیگر
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>نرخ هر توقف (تومان)</Label>
                <Input
                  type="number"
                  value={tempStopRate}
                  onChange={(e) => setTempStopRate(Number(e.target.value))}
                  dir="ltr"
                />
                <p className="text-sm text-muted-foreground">
                  قیمت فعلی: {formatCurrency(pricingConfig.stopRate)}
                </p>
              </div>

              <div className="space-y-2">
                <Label>نرخ بسته‌بندی ساعتی (تومان)</Label>
                <Input
                  type="number"
                  value={tempPackingHourlyRate}
                  onChange={(e) => setTempPackingHourlyRate(Number(e.target.value))}
                  dir="ltr"
                />
                <p className="text-sm text-muted-foreground">
                  قیمت فعلی: {formatCurrency(pricingConfig.packingHourlyRate)} به ازای هر ساعت
                </p>
              </div>

              <Button onClick={handleSaveAdditionalServices} className="w-full">
                ذخیره تغییرات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>خلاصه تنظیمات قیمت‌گذاری</CardTitle>
          <CardDescription>
            نمای کلی از تعرفه‌های فعلی سیستم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-background">
              <p className="text-sm text-muted-foreground mb-1">نرخ کارگر</p>
              <p className="font-mono">{formatCurrency(pricingConfig.baseWorkerRate)}</p>
            </div>
            <div className="p-4 rounded-lg border bg-background">
              <p className="text-sm text-muted-foreground mb-1">نرخ هر کیلومتر</p>
              <p className="font-mono">{formatCurrency(pricingConfig.perKmRate)}</p>
            </div>
            <div className="p-4 rounded-lg border bg-background">
              <p className="text-sm text-muted-foreground mb-1">نرخ هر طبقه</p>
              <p className="font-mono">{formatCurrency(pricingConfig.perFloorRate)}</p>
            </div>
            <div className="p-4 rounded-lg border bg-background">
              <p className="text-sm text-muted-foreground mb-1">نرخ هر توقف</p>
              <p className="font-mono">{formatCurrency(pricingConfig.stopRate)}</p>
            </div>
            <div className="p-4 rounded-lg border bg-background">
              <p className="text-sm text-muted-foreground mb-1">بسته‌بندی ساعتی</p>
              <p className="font-mono">{formatCurrency(pricingConfig.packingHourlyRate)}</p>
            </div>
            <div className="p-4 rounded-lg border bg-background">
              <p className="text-sm text-muted-foreground mb-1">تعداد خدمات فعال</p>
              <p className="text-2xl">{servicePrices.filter(s => s.isActive).length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
