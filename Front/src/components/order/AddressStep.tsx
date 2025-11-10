import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { MapPin, Plus, ArrowRight } from 'lucide-react';
import { Address } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface AddressStepProps {
  originAddress?: Address;
  destinationAddress?: Address;
  onUpdate: (data: { originAddress?: Address; destinationAddress?: Address }) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const AddressStep = ({
  originAddress,
  destinationAddress,
  onUpdate,
  onBack,
  showBackButton = false,
}: AddressStepProps) => {
  const { user } = useAuth();
  const [showOriginForm, setShowOriginForm] = useState(!originAddress);
  const [showDestinationForm, setShowDestinationForm] = useState(!destinationAddress);

  const [originData, setOriginData] = useState({
    title: originAddress?.title || '',
    fullAddress: originAddress?.fullAddress || '',
    district: originAddress?.district || '',
    city: originAddress?.city || 'تهران',
    province: originAddress?.province || 'تهران',
    details: originAddress?.details || '',
  });

  const [destinationData, setDestinationData] = useState({
    title: destinationAddress?.title || '',
    fullAddress: destinationAddress?.fullAddress || '',
    district: destinationAddress?.district || '',
    city: destinationAddress?.city || 'تهران',
    province: destinationAddress?.province || 'تهران',
    details: destinationAddress?.details || '',
  });

  const handleOriginSave = () => {
    const newAddress: Address = {
      id: originAddress?.id || Math.random().toString(),
      userId: user?.id || 'guest',
      title: originData.title,
      fullAddress: originData.fullAddress,
      lat: 35.6892, // Mock - در production از نقشه نشان استفاده می‌شود
      lng: 51.389, // Mock
      district: originData.district,
      city: originData.city,
      province: originData.province,
      details: originData.details,
      createdAt: new Date(),
    };

    onUpdate({ originAddress: newAddress, destinationAddress });
    setShowOriginForm(false);
  };

  const handleDestinationSave = () => {
    const newAddress: Address = {
      id: destinationAddress?.id || Math.random().toString(),
      userId: user?.id || 'guest',
      title: destinationData.title,
      fullAddress: destinationData.fullAddress,
      lat: 35.7219, // Mock
      lng: 51.4056, // Mock
      district: destinationData.district,
      city: destinationData.city,
      province: destinationData.province,
      details: destinationData.details,
      createdAt: new Date(),
    };

    onUpdate({ originAddress, destinationAddress: newAddress });
    setShowDestinationForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="mb-2">آدرس مبدا و مقصد</h2>
          <p className="text-muted-foreground">
            لطفاً آدرس مبدا (محل بارگیری) و مقصد (محل تخلیه) را وارد کنید
          </p>
        </div>
        {showBackButton && onBack && (
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowRight className="w-4 h-4 ml-2" />
            بازگشت
          </Button>
        )}
      </div>

      {/* Origin Address */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            آدرس مبدا (بارگیری)
          </h3>
          {originAddress && !showOriginForm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowOriginForm(true)}
            >
              ویرایش
            </Button>
          )}
        </div>

        {!showOriginForm && originAddress ? (
          <Card className="border-primary">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{originAddress.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {originAddress.fullAddress}
                  </p>
                  {originAddress.details && (
                    <p className="text-sm text-muted-foreground mt-1">
                      📝 {originAddress.details}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label htmlFor="origin-title">عنوان (مثلاً: منزل، محل کار)</Label>
                <Input
                  id="origin-title"
                  value={originData.title}
                  onChange={(e) => setOriginData({ ...originData, title: e.target.value })}
                  placeholder="عنوان آدرس"
                />
              </div>

              <div>
                <Label htmlFor="origin-address">آدرس کامل</Label>
                <Textarea
                  id="origin-address"
                  value={originData.fullAddress}
                  onChange={(e) =>
                    setOriginData({ ...originData, fullAddress: e.target.value })
                  }
                  placeholder="آدرس کامل را وارد کنید"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="origin-district">منطقه</Label>
                  <Input
                    id="origin-district"
                    value={originData.district}
                    onChange={(e) =>
                      setOriginData({ ...originData, district: e.target.value })
                    }
                    placeholder="مثلاً: منطقه ۱"
                  />
                </div>
                <div>
                  <Label htmlFor="origin-city">شهر</Label>
                  <Input
                    id="origin-city"
                    value={originData.city}
                    onChange={(e) => setOriginData({ ...originData, city: e.target.value })}
                    placeholder="نام شهر"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="origin-details">توضیحات تکمیلی (اختیاری)</Label>
                <Textarea
                  id="origin-details"
                  value={originData.details}
                  onChange={(e) => setOriginData({ ...originData, details: e.target.value })}
                  placeholder="مثلاً: ساختمان رنگ آبی، کوچه دوم"
                  rows={2}
                />
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  🗺️ در نسخه نهایی، می‌توانید از نقشه نشان برای انتخاب دقیق آدرس استفاده
                  کنید
                </p>
              </div>

              <Button type="button" onClick={handleOriginSave} className="w-full">
                ذخیره آدرس مبدا
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Destination Address */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-destructive" />
            آدرس مقصد (تخلیه)
          </h3>
          {destinationAddress && !showDestinationForm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowDestinationForm(true)}
            >
              ویرایش
            </Button>
          )}
        </div>

        {!showDestinationForm && destinationAddress ? (
          <Card className="border-destructive">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{destinationAddress.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {destinationAddress.fullAddress}
                  </p>
                  {destinationAddress.details && (
                    <p className="text-sm text-muted-foreground mt-1">
                      📝 {destinationAddress.details}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label htmlFor="dest-title">عنوان (مثلاً: منزل، محل کار)</Label>
                <Input
                  id="dest-title"
                  value={destinationData.title}
                  onChange={(e) =>
                    setDestinationData({ ...destinationData, title: e.target.value })
                  }
                  placeholder="عنوان آدرس"
                />
              </div>

              <div>
                <Label htmlFor="dest-address">آدرس کامل</Label>
                <Textarea
                  id="dest-address"
                  value={destinationData.fullAddress}
                  onChange={(e) =>
                    setDestinationData({ ...destinationData, fullAddress: e.target.value })
                  }
                  placeholder="آدرس کامل را وارد کنید"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dest-district">منطقه</Label>
                  <Input
                    id="dest-district"
                    value={destinationData.district}
                    onChange={(e) =>
                      setDestinationData({ ...destinationData, district: e.target.value })
                    }
                    placeholder="مثلاً: منطقه ۲"
                  />
                </div>
                <div>
                  <Label htmlFor="dest-city">شهر</Label>
                  <Input
                    id="dest-city"
                    value={destinationData.city}
                    onChange={(e) =>
                      setDestinationData({ ...destinationData, city: e.target.value })
                    }
                    placeholder="نام شهر"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dest-details">توضیحات تکمیلی (اختیاری)</Label>
                <Textarea
                  id="dest-details"
                  value={destinationData.details}
                  onChange={(e) =>
                    setDestinationData({ ...destinationData, details: e.target.value })
                  }
                  placeholder="مثلاً: ساختمان رنگ سبز، طبقه ۳"
                  rows={2}
                />
              </div>

              <Button type="button" onClick={handleDestinationSave} className="w-full">
                ذخیره آدرس مقصد
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
