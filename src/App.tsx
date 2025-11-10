import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner@2.0.3';
import { AuthProvider } from './contexts/AuthContext';
import { OrderFormProvider } from './contexts/OrderFormContext';

// Layout Components
import { PublicLayout } from './components/layout/PublicLayout';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { DriverLayout } from './components/layout/DriverLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ServicesPage } from './pages/public/ServicesPage';
import { OrderFormPage } from './pages/public/OrderFormPage';
import { LoginPage } from './pages/public/LoginPage';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CustomerOrders } from './pages/customer/CustomerOrders';
import { OrderTracking } from './pages/customer/OrderTracking';
import { CustomerAddresses } from './pages/customer/CustomerAddresses';
import { CustomerProfile } from './pages/customer/CustomerProfile';

// Driver Pages
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { DriverOrders } from './pages/driver/DriverOrders';
import { DriverNavigation } from './pages/driver/DriverNavigation';
import { ActiveTripNavigation } from './pages/driver/ActiveTripNavigation';
import { DriverEarnings } from './pages/driver/DriverEarnings';
import { DriverProfile } from './pages/driver/DriverProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminUsers } from './pages/admin/AdminUsers';
import AdminDrivers from './pages/admin/AdminDrivers';
import AdminServices from './pages/admin/AdminServices';
import { AdminCatalog } from './pages/admin/AdminCatalog';
import { AdminPricing } from './pages/admin/AdminPricing';
import { AdminFinancial } from './pages/admin/AdminFinancial';
import { AdminSettings } from './pages/admin/AdminSettings';

// Protected Route Component
import { ProtectedRoute } from './components/common/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OrderFormProvider>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/order/:serviceSlug" element={<OrderFormPage />} />
              <Route path="/tracking/:orderId" element={<OrderTracking />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* Customer Routes */}
            <Route
              path="/customer"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <CustomerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<CustomerDashboard />} />
              <Route path="orders" element={<CustomerOrders />} />
              <Route path="tracking/:orderId" element={<OrderTracking />} />
              <Route path="addresses" element={<CustomerAddresses />} />
              <Route path="profile" element={<CustomerProfile />} />
            </Route>

            {/* Driver Routes */}
            <Route
              path="/driver"
              element={
                <ProtectedRoute allowedRoles={['DRIVER']}>
                  <DriverLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DriverDashboard />} />
              <Route path="orders" element={<DriverOrders />} />
              <Route path="navigation/:orderId" element={<DriverNavigation />} />
              <Route path="active-trip/:tripId" element={<ActiveTripNavigation />} />
              <Route path="earnings" element={<DriverEarnings />} />
              <Route path="profile" element={<DriverProfile />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="drivers" element={<AdminDrivers />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="catalog" element={<AdminCatalog />} />
              <Route path="pricing" element={<AdminPricing />} />
              <Route path="financial" element={<AdminFinancial />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast Notifications */}
          <Toaster position="top-center" richColors />
        </OrderFormProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
