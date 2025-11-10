import {
  User,
  Customer,
  Driver,
  Admin,
  UserRole,
  Order,
  OrderStatus,
  VehicleType,
  Address,
  PackingService,
  PackingType,
  LocationDetails,
  DriverAssignment,
  Payment,
  PaymentStatus,
  PaymentMethod,
  OrderItem,
  ServiceCategory,
  CatalogItem,
  CatalogCategory,
  PackingProduct,
  DiscountCode,
  DashboardStats,
  PricingConfig,
} from '../types';
import { SERVICE_CATEGORIES, HEAVY_ITEMS, PACKING_PRODUCTS_DATA, DEFAULT_PRICING } from '../constants';

// ============================================
// USERS
// ============================================

export const mockCustomers: Customer[] = [
  {
    id: 'customer-1',
    phoneNumber: '09121234567',
    fullName: 'علی احمدی',
    role: UserRole.CUSTOMER,
    createdAt: new Date('2024-01-01'),
    addresses: [],
    orders: [],
  },
  {
    id: 'customer-2',
    phoneNumber: '09129876543',
    fullName: 'سارا محمدی',
    role: UserRole.CUSTOMER,
    createdAt: new Date('2024-02-15'),
    addresses: [],
    orders: [],
  },
];

export const mockDrivers: Driver[] = [
  {
    id: 'driver-1',
    phoneNumber: '09131111111',
    fullName: 'محمد رضایی',
    role: UserRole.DRIVER,
    licensePlate: '۱۲ الف ۳۴۵ ایران ۶۷',
    vehicleType: VehicleType.HEAVY_TRUCK,
    rating: 4.8,
    totalRides: 150,
    isActive: true,
    isOnline: true,
    currentLocation: {
      lat: 35.6892,
      lng: 51.3890,
    },
    createdAt: new Date('2023-06-01'),
    assignments: [],
  },
  {
    id: 'driver-2',
    phoneNumber: '09132222222',
    fullName: 'حسین کریمی',
    role: UserRole.DRIVER,
    licensePlate: '۲۳ ب ۴۵۶ ایران ۷۸',
    vehicleType: VehicleType.TRUCK,
    rating: 4.9,
    totalRides: 200,
    isActive: true,
    isOnline: true,
    currentLocation: {
      lat: 35.7219,
      lng: 51.4044,
    },
    createdAt: new Date('2023-05-15'),
    assignments: [],
  },
  {
    id: 'driver-3',
    phoneNumber: '09133333333',
    fullName: 'رضا موسوی',
    role: UserRole.DRIVER,
    licensePlate: '۳۴ ج ۵۶۷ ایران ۸۹',
    vehicleType: VehicleType.NISSAN,
    rating: 4.7,
    totalRides: 120,
    isActive: true,
    isOnline: false,
    createdAt: new Date('2023-07-20'),
    assignments: [],
  },
];

export const mockAdmin: Admin = {
  id: 'admin-1',
  phoneNumber: '09100000000',
  fullName: 'مدیر سیستم',
  role: UserRole.ADMIN,
  createdAt: new Date('2023-01-01'),
  permissions: ['all'],
};

// ============================================
// ADDRESSES
// ============================================

export const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    userId: 'customer-1',
    title: 'منزل',
    fullAddress: 'تهران، 17 شهریور، خیابان شریعتی، پلاک 123',
    lat: 35.7219,
    lng: 51.4044,
    district: 'منطقه ۱۵',
    city: 'تهران',
    province: 'تهران',
    postalCode: '1234567890',
    details: 'طبقه 4، واحد 8',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'addr-2',
    userId: 'customer-1',
    title: 'محل کار',
    fullAddress: 'تهران، 13 آبان، خیابان ولیعصر، پلاک 456',
    lat: 35.6892,
    lng: 51.3890,
    district: 'منطقه ۲۰',
    city: 'تهران',
    province: 'تهران',
    postalCode: '9876543210',
    details: 'طبقه 2، واحد 3',
    createdAt: new Date('2024-01-15'),
  },
];

// ============================================
// CATALOG
// ============================================

export const mockCatalogCategories: CatalogCategory[] = [
  {
    id: 'cat-1',
    name: 'اقلام سنگین و حجیم',
    slug: 'heavy-items',
    description: 'وسایل سنگین و بزرگ که نیاز به مراقبت ویژه دارند',
    order: 1,
  },
  {
    id: 'cat-2',
    name: 'لوازم منزل',
    slug: 'household-items',
    description: 'وسایل معمولی منزل',
    order: 2,
  },
  {
    id: 'cat-3',
    name: 'لوازم بسته‌بندی',
    slug: 'packing-materials',
    description: 'مواد و ابزار بسته‌بندی',
    order: 3,
  },
];

export const mockCatalogItems: CatalogItem[] = HEAVY_ITEMS.map((item) => ({
  id: item.id,
  categoryId: 'cat-1',
  name: item.name,
  description: item.category,
  basePrice: item.basePrice,
  unit: 'عدد',
  isActive: true,
  order: 0,
}));

// Sample images for packing products
const productImages: Record<string, string> = {
  'pack-1': 'https://images.unsplash.com/photo-1700165644892-3dd6b67b25bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkYm9hcmQlMjBib3hlcyUyMHBhY2tpbmd8ZW58MXx8fHwxNzYyNTE4NjM1fDA&ixlib=rb-4.1.0&q=80&w=400',
  'pack-2': 'https://images.unsplash.com/photo-1700165644892-3dd6b67b25bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkYm9hcmQlMjBib3hlcyUyMHBhY2tpbmd8ZW58MXx8fHwxNzYyNTE4NjM1fDA&ixlib=rb-4.1.0&q=80&w=400',
  'pack-3': 'https://images.unsplash.com/photo-1700165644892-3dd6b67b25bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkYm9hcmQlMjBib3hlcyUyMHBhY2tpbmd8ZW58MXx8fHwxNzYyNTE4NjM1fDA&ixlib=rb-4.1.0&q=80&w=400',
  'pack-4': 'https://images.unsplash.com/photo-1707934517789-bfba682a5c31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWNraW5nJTIwdGFwZSUyMHJvbGx8ZW58MXx8fHwxNzYyNTE4NjM2fDA&ixlib=rb-4.1.0&q=80&w=400',
  'pack-5': 'https://images.unsplash.com/photo-1589322448752-5c05f2e9ca21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWJibGUlMjB3cmFwJTIwcGFja2FnaW5nfGVufDF8fHx8MTc2MjQ2MTUwOXww&ixlib=rb-4.1.0&q=80&w=400',
  'pack-6': 'https://images.unsplash.com/photo-1589322448752-5c05f2e9ca21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWJibGUlMjB3cmFwJTIwcGFja2FnaW5nfGVufDF8fHx8MTc2MjQ2MTUwOXww&ixlib=rb-4.1.0&q=80&w=400',
  'pack-8': 'https://images.unsplash.com/photo-1715866568589-ac5a406eda54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpbmclMjBibGFua2V0fGVufDF8fHx8MTc2MjUxODYzN3ww&ixlib=rb-4.1.0&q=80&w=400',
};

export const mockPackingProducts: PackingProduct[] = PACKING_PRODUCTS_DATA.map((product, index) => ({
  ...product,
  image: productImages[product.id],
  stock: 100,
  isActive: true,
}));

// ============================================
// ORDERS
// ============================================

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    customerId: 'customer-1',
    customerPhone: '09121234567',
    customerName: 'علی احمدی',
    serviceCategoryId: 'moving-service',
    driverId: 'driver-1',
    status: OrderStatus.IN_TRANSIT,
    preferredDateTime: new Date('2024-11-10T16:00:00'),
    createdAt: new Date('2024-11-07T10:00:00'),
    confirmedAt: new Date('2024-11-07T11:00:00'),
    startedAt: new Date('2024-11-10T16:00:00'),
    estimatedPrice: 11160500,
    finalPrice: 11160500,
    details: {
      needsPacking: true,
      needsWorkers: true,
      workerCount: 5,
      vehicleType: VehicleType.HEAVY_TRUCK,
    },
    items: [
      {
        id: 'item-1',
        orderId: 'order-1',
        catalogItemId: 'heavy-6',
        quantity: 1,
        unitPrice: 375000,
        totalPrice: 375000,
      },
      {
        id: 'item-2',
        orderId: 'order-1',
        catalogItemId: 'heavy-7',
        quantity: 1,
        unitPrice: 500000,
        totalPrice: 500000,
      },
      {
        id: 'item-3',
        orderId: 'order-1',
        catalogItemId: 'heavy-9',
        quantity: 1,
        unitPrice: 450000,
        totalPrice: 450000,
      },
      {
        id: 'item-4',
        orderId: 'order-1',
        catalogItemId: 'heavy-10',
        quantity: 1,
        unitPrice: 750000,
        totalPrice: 750000,
      },
    ],
    packingService: {
      orderId: 'order-1',
      type: PackingType.FULL,
      maleWorkers: 1,
      femaleWorkers: 1,
      estimatedHours: 4,
      needsMaterials: true,
      packingItems: [
        { itemName: 'لباس، کیف و کفش', quantity: 1 },
        { itemName: 'ظروف و لوازم برقی کوچک آشپزخانه', quantity: 1 },
        { itemName: 'کتاب', quantity: 1 },
      ],
    },
    locationDetails: {
      orderId: 'order-1',
      originFloor: 4,
      originHasElevator: false,
      destinationFloor: 4,
      destinationHasElevator: true,
      walkDistanceMeters: 0,
      stopCount: 1,
    },
    originAddress: mockAddresses[0],
    destinationAddress: mockAddresses[1],
    stops: [],
    distanceKm: 15.5,
    estimatedDuration: 90,
    driverAssignment: {
      id: 'assign-1',
      orderId: 'order-1',
      driverId: 'driver-1',
      commission: 15,
      commissionAmount: 1674075,
      note: 'مراقب پیانو باشید',
      assignedAt: new Date('2024-11-07T11:30:00'),
      acceptedAt: new Date('2024-11-07T12:00:00'),
      isActive: true,
    },
    payment: {
      id: 'pay-1',
      orderId: 'order-1',
      amount: 11160500,
      status: PaymentStatus.PAID,
      method: PaymentMethod.ONLINE,
      gatewayTransactionId: 'ZP-123456789',
      paidAt: new Date('2024-11-07T10:30:00'),
      createdAt: new Date('2024-11-07T10:25:00'),
    },
    customerNote: 'لطفاً دقت کنید پیانو خیلی گرانبهاست',
  },
  {
    id: 'order-2',
    customerId: 'customer-2',
    customerPhone: '09129876543',
    customerName: 'سارا محمدی',
    serviceCategoryId: 'moving-service',
    status: OrderStatus.CONFIRMED,
    preferredDateTime: new Date('2024-11-12T14:00:00'),
    createdAt: new Date('2024-11-08T09:00:00'),
    confirmedAt: new Date('2024-11-08T10:00:00'),
    estimatedPrice: 8410500,
    details: {
      needsPacking: false,
      needsWorkers: true,
      workerCount: 4,
      vehicleType: VehicleType.HEAVY_TRUCK,
    },
    items: [
      {
        id: 'item-5',
        orderId: 'order-2',
        catalogItemId: 'heavy-10',
        quantity: 1,
        unitPrice: 750000,
        totalPrice: 750000,
      },
      {
        id: 'item-6',
        orderId: 'order-2',
        catalogItemId: 'heavy-11',
        quantity: 1,
        unitPrice: 400000,
        totalPrice: 400000,
      },
      {
        id: 'item-7',
        orderId: 'order-2',
        catalogItemId: 'heavy-12',
        quantity: 1,
        unitPrice: 600000,
        totalPrice: 600000,
      },
    ],
    locationDetails: {
      orderId: 'order-2',
      originFloor: 1,
      originHasElevator: false,
      destinationFloor: 4,
      destinationHasElevator: true,
      walkDistanceMeters: 50,
      stopCount: 1,
    },
    originAddress: mockAddresses[0],
    destinationAddress: mockAddresses[1],
    stops: [],
    distanceKm: 12.3,
    estimatedDuration: 75,
    payment: {
      id: 'pay-2',
      orderId: 'order-2',
      amount: 8410500,
      status: PaymentStatus.PAID,
      method: PaymentMethod.ONLINE,
      gatewayTransactionId: 'ZP-987654321',
      paidAt: new Date('2024-11-08T09:30:00'),
      createdAt: new Date('2024-11-08T09:25:00'),
    },
  },
];

// ============================================
// DISCOUNT CODES
// ============================================

export const mockDiscountCodes: DiscountCode[] = [
  {
    id: 'disc-1',
    code: 'WELCOME10',
    type: 'PERCENTAGE',
    value: 10,
    maxDiscount: 500000,
    minOrderAmount: 1000000,
    usageLimit: 100,
    usageCount: 23,
    perUserLimit: 1,
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'disc-2',
    code: 'BAHAR2024',
    type: 'FIXED',
    value: 200000,
    minOrderAmount: 2000000,
    usageLimit: 50,
    usageCount: 15,
    isActive: true,
    createdAt: new Date('2024-03-01'),
  },
];

// ============================================
// PRICING CONFIG
// ============================================

export const mockPricingConfig: PricingConfig = {
  id: 'pricing-1',
  name: 'تعرفه پیش‌فرض',
  ...DEFAULT_PRICING,
  isActive: true,
};

// ============================================
// DASHBOARD STATS
// ============================================

export const mockDashboardStats: DashboardStats = {
  totalOrders: 245,
  activeOrders: 12,
  completedOrders: 220,
  totalRevenue: 2456780000,
  pendingPayments: 3,
  activeDrivers: 45,
  totalCustomers: 1234,
  avgRating: 4.7,
};

// ============================================
// SERVICE CATEGORIES
// ============================================

export const mockServiceCategories: ServiceCategory[] = SERVICE_CATEGORIES.map((cat, index) => ({
  ...cat,
  isActive: true,
  order: index,
}));
