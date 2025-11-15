import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, LogIn } from 'lucide-react';
import { api } from '../../lib/api'; // Import the centralized api service

export const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/customer';

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || !/^09\d{9}$/.test(phoneNumber)) {
      toast.error('شماره موبایل را به درستی (۱۱ رقم) وارد کنید');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await api.post('/Auth/send-otp', { phoneNumber });

      if (response.data.success) {
        setStep('otp');
        toast.success(response.data.data || 'کد تایید به شماره شما ارسال شد');
      } else {
        toast.error(response.data.error || 'خطا در ارسال کد');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'خطای سرور در ارسال کد';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 4) {
      toast.error('کد تایید را به درستی (۴ رقم) وارد کنید');
      return;
    }

    setIsLoading(true);
    
    try {
      await login(phoneNumber, otp); // This now calls the real API via AuthContext
      toast.success('ورود موفقیت‌آمیز');
      navigate(from, { replace: true });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'کد تایید نامعتبر یا خطایی رخ داده است';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🚚</div>
          <h1 className="text-2xl font-bold mb-2">ورود به باربری بهار</h1>
          <p className="text-sm text-muted-foreground">
            {step === 'phone'
              ? 'برای شروع، شماره موبایل خود را وارد کنید'
              : 'کد ۴ رقمی ارسال شده را وارد کنید'}
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <Label htmlFor="phone" className="sr-only">شماره موبایل</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="09121234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={11}
                dir="ltr"
                className="text-center h-12 text-lg"
              />
            </div>

            <Button type="submit" className="w-full h-12 gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  در حال ارسال...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  ارسال کد تایید
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <Label htmlFor="otp" className="sr-only">کد تایید</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={4}
                dir="ltr"
                className="text-center text-2xl tracking-[1.5rem] h-14"
              />
              <p className="text-xs text-muted-foreground text-center mt-2">
                کد تایید به شماره {phoneNumber} ارسال شد
              </p>
            </div>

            <Button type="submit" className="w-full h-12 gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  در حال بررسی...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  تایید و ورود
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => {
                setStep('phone');
                setOtp('');
              }}
            >
              ویرایش شماره موبایل
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
