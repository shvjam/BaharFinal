import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { Home, Package, MapPin, User } from 'lucide-react';

const customerMenuItems = [
  { icon: Home, label: 'داشبورد', path: '/customer' },
  { icon: Package, label: 'سفارشات من', path: '/customer/orders' },
  { icon: MapPin, label: 'آدرس‌ها', path: '/customer/addresses' },
  { icon: User, label: 'پروفایل', path: '/customer/profile' },
];

export const CustomerLayout = () => {
  return (
    <div className="flex min-h-screen" dir="rtl">
      <DashboardSidebar menuItems={customerMenuItems} />
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
