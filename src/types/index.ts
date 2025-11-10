// ============================================
// ENUMS
// ============================================

export enum UserRole {
  GUEST = 'GUEST',
  CUSTOMER = 'CUSTOMER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
}

export enum OrderStatus {
  DRAFT = 'DRAFT', // در حال ساخت
  PENDING = 'PENDING', // در انتظار بررسی
  REVIEWING = 'REVIEWING', // در حال بررسی
  CONFIRMED = 'CONFIRMED', // تایید شده
  DRIVER_ASSIGNED = 'DRIVER_ASSIGNED', // راننده مشخص شد
  DRIVER_EN_ROUTE_TO_ORIGIN = 'DRIVER_EN_ROUTE_TO_ORIGIN', // راننده در حال اعزام به مبدا
  PACKING_IN_PROGRESS = 'PACKING_IN_PROGRESS', // بسته‌بندی در حال انجام
  LOADING_IN_PROGRESS = 'LOADING_IN_PROGRESS', // بارگیری در حال انجام
  IN_TRANSIT = 'IN_TRANSIT', // در حال حمل
  ARRIVED_AT_DESTINATION = 'ARRIVED_AT_DESTINATION', // در مقصد
  COMPLETED = 'COMPLETED', // تکمیل شده
  CANCELLED = 'CANCELLED', // لغو شده
}

export enum VehicleType {
  PICKUP = 'PICKUP', // وانت
  NISSAN = 'NISSAN', // نیسان
  TRUCK = 'TRUCK', // کامیون
  HEAVY_TRUCK = 'HEAVY_TRUCK', // خاور
}

export enum PackingType {
  FULL = 'FULL', // بسته‌بندی تمام لوازم منزل
  LARGE_ITEMS = 'LARGE_ITEMS', // لوازم بزرگ
  SMALL_ITEMS = 'SMALL_ITEMS', // خرده‌ریزها
  OFFICE = 'OFFICE', // لوازم اداری
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  ONLINE = 'ONLINE',
  CASH = 'CASH',
  WALLET = 'WALLET',
}

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  phoneNumber: string;
  fullName?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Customer extends User {
  role: UserRole.CUSTOMER;
  addresses: Address[];
  orders: Order[];
}

export interface Driver extends User {
  role: UserRole.DRIVER;
  nationalId?: string; // کد ملی
  dateOfBirth?: Date;
  address?: string;
  
  // وسیله نقلیه
  licensePlate: string;
  vehicleType: VehicleType;
  vehicleModel?: string;
  vehicleColor?: string;
  vehicleYear?: number;
  availableWorkers: number; // تعداد کارگر همراه
  
  // مدارک
  driverLicenseNumber?: string;
  driverLicenseExpiry?: Date;
  driverLicenseImage?: string;
  vehicleCardImage?: string;
  insuranceImage?: string;
  profileImage?: string;
  documentsVerified: boolean;
  verifiedAt?: Date;
  
  // اطلاعات بانکی
  sheba?: string; // شماره شبا (24 رقم)
  
  // آمار و وضعیت
  rating: number;
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  totalEarnings: number;
  
  // تنظیمات
  isActive: boolean;
  isOnline: boolean;
  commissionPercentage: number; // درصد کمیسیون
  priority: number; // اولویت تخصیص
  
  // موقعیت فعلی
  currentLocation?: {
    lat: number;
    lng: number;
  };
  lastLocationUpdate?: Date;
  
  assignments: DriverAssignment[];
  
  // یادداشت ادمین
  adminNote?: string;
}

export interface Admin extends User {
  role: UserRole.ADMIN;
  permissions: string[];
}

// ============================================
// ADDRESS
// ============================================

export interface Address {
  id: string;
  userId: string;
  title: string; // خانه، محل کار، ...
  fullAddress: string;
  lat: number;
  lng: number;
  district: string; // منطقه
  city: string;
  province: string;
  postalCode?: string;
  details?: string; // توضیحات تکمیلی
  createdAt: Date;
}

// ============================================
// SERVICE CATEGORIES
// ============================================

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  isActive: boolean;
  order: number; // ترتیب نمایش
}

// ============================================
// CATALOG (آیتم‌ها و محصولات)
// ============================================

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
}

export interface CatalogItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  basePrice: number;
  unit: string; // عدد، کیلوگرم، متر، ...
  isActive: boolean;
  order: number;
}

// محصولات بسته‌بندی (کارتن، چسب، پلاستیک، ...)
export interface PackingProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  unit: string;
  image?: string;
  stock: number;
  isActive: boolean;
}

// ============================================
// ORDER
// ============================================

export interface Order {
  id: string;
  customerId?: string; // null برای مهمان
  customerPhone: string;
  customerName?: string;
  serviceCategoryId: string;
  driverId?: string;
  status: OrderStatus;
  
  // زمان‌بندی
  preferredDateTime: Date;
  createdAt: Date;
  confirmedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  
  // قیمت
  estimatedPrice: number;
  finalPrice?: number;
  discountCode?: string;
  discountAmount?: number;
  
  // جزئیات سفارش
  details: OrderDetails;
  
  // آیتم‌های سفارش
  items: OrderItem[];
  
  // بسته‌بندی
  packingService?: PackingService;
  
  // جزئیات مکانی
  locationDetails: LocationDetails;
  
  // آدرس‌ها
  originAddress: Address;
  destinationAddress: Address;
  stops?: Address[]; // توقف‌ها
  
  // فاصله و زمان
  distanceKm: number;
  estimatedDuration: number; // دقیقه
  
  // تخصیص راننده
  driverAssignment?: DriverAssignment;
  
  // پرداخت
  payment?: Payment;
  
  // یادداشت‌ها
  customerNote?: string;
  adminNote?: string;
  driverNote?: string;
  
  // امتیاز
  rating?: number;
  review?: string;
  
  // لغو
  cancellationReason?: string;
  cancellationFee?: number;
}

export interface OrderDetails {
  needsPacking: boolean;
  needsWorkers: boolean;
  workerCount: number;
  vehicleType: VehicleType;
  [key: string]: any; // برای فیلدهای داینامیک
}

export interface OrderItem {
  id: string;
  orderId: string;
  catalogItemId: string;
  catalogItem?: CatalogItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PackingService {
  orderId: string;
  type: PackingType;
  maleWorkers: number;
  femaleWorkers: number;
  estimatedHours: number;
  needsMaterials: boolean;
  materialsMode?: 'auto' | 'manual';
  packingItems?: PackingItem[];
  packingProducts?: SelectedPackingProduct[];
}

export interface PackingItem {
  itemName: string;
  quantity: number;
}

export interface LocationDetails {
  orderId: string;
  originFloor: number;
  originHasElevator: boolean;
  destinationFloor: number;
  destinationHasElevator: boolean;
  walkDistanceMeters: number;
  stopCount: number;
}

// ============================================
// DRIVER ASSIGNMENT
// ============================================

export interface DriverAssignment {
  id: string;
  orderId: string;
  driverId: string;
  driver?: Driver;
  commission: number; // پورسانت راننده (درصد)
  commissionAmount?: number; // مبلغ پورسانت
  note?: string;
  assignedAt: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  isActive: boolean;
}

// ============================================
// PAYMENT
// ============================================

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  gatewayTransactionId?: string;
  gatewayResponse?: any;
  paidAt?: Date;
  refundedAt?: Date;
  createdAt: Date;
}

// ============================================
// LIVE TRACKING
// ============================================

export interface LocationUpdate {
  driverId: string;
  orderId: string;
  lat: number;
  lng: number;
  heading?: number; // جهت حرکت
  speed?: number; // سرعت (km/h)
  accuracy?: number; // دقت (متر)
  timestamp: Date;
}

// ============================================
// PRICING
// ============================================

export interface PricingConfig {
  id: string;
  name: string;
  baseWorkerRate: number; // نرخ پایه هر کارگر
  baseVehicleRates: Record<VehicleType, number>; // نرخ هر نوع خودرو
  perKmRate: number; // نرخ هر کیلومتر
  perFloorRate: number; // نرخ هر طبقه
  walkingDistanceRates: Record<number, number>; // نرخ پیاده‌روی
  stopRate: number; // نرخ هر توقف
  packingHourlyRate: number; // نرخ ساعتی بسته‌بندی
  cancellationFee: number; // جریمه لغو
  expertVisitFee: number; // هزینه کارشناسی
  isActive: boolean;
}

// ============================================
// DISCOUNT CODE
// ============================================

export interface DiscountCode {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED'; // درصدی یا مبلغ ثابت
  value: number;
  maxDiscount?: number; // حداکثر تخفیف (برای درصدی)
  minOrderAmount?: number; // حداقل مبلغ سفارش
  startDate?: Date;
  endDate?: Date;
  usageLimit?: number; // تعداد استفاده کل
  usageCount: number; // تعداد استفاده شده
  perUserLimit?: number; // تعداد استفاده هر کاربر
  isActive: boolean;
  createdAt: Date;
}

// ============================================
// FORM STATE (برای فرم ثبت سفارش)
// ============================================

export interface SelectedPackingProduct {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderFormState {
  step: number;
  serviceCategory?: ServiceCategory;
  city?: string;
  needsPacking?: boolean;
  packingType?: PackingType;
  packingItems?: PackingItem[];
  packingWorkerGender?: {
    male: number;
    female: number;
  };
  packingDuration?: number;
  needsPackingMaterials?: boolean;
  packingMaterialsMode?: 'auto' | 'manual';
  selectedPackingProducts?: SelectedPackingProduct[];
  originFloor?: number;
  originHasElevator?: boolean;
  destinationFloor?: number;
  destinationHasElevator?: boolean;
  heavyItems?: OrderItem[];
  walkDistance?: number;
  workerCount?: number;
  originAddress?: Address;
  destinationAddress?: Address;
  stops?: Address[];
  preferredDateTime?: Date;
  distanceKm?: number;
  estimatedPrice?: number;
  priceBreakdown?: PriceBreakdown[];
}

export interface PriceBreakdown {
  label: string;
  quantity?: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// NOTIFICATION
// ============================================

export interface Notification {
  id: string;
  userId: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  data?: any;
}

// ============================================
// STATISTICS (برای داشبورد)
// ============================================

export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalRevenue: number;
  pendingPayments: number;
  activeDrivers: number;
  totalCustomers: number;
  avgRating: number;
}

export interface DriverStats {
  totalRides: number;
  completedRides: number;
  totalEarnings: number;
  avgRating: number;
  activeOrders: number;
}

export interface CustomerStats {
  totalOrders: number;
  completedOrders: number;
  totalSpent: number;
  savedAddresses: number;
}
