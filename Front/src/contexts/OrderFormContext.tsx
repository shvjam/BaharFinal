import { createContext, useContext, useState, ReactNode } from 'react';
import { OrderFormState, ServiceCategory, Address, PackingType, PackingItem, OrderItem, PriceBreakdown } from '../types';

interface OrderFormContextType {
  formState: OrderFormState;
  updateFormState: (updates: Partial<OrderFormState>) => void;
  resetForm: () => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  calculatePrice: () => void;
}

const OrderFormContext = createContext<OrderFormContextType | undefined>(undefined);

export const useOrderForm = () => {
  const context = useContext(OrderFormContext);
  if (!context) {
    throw new Error('useOrderForm must be used within OrderFormProvider');
  }
  return context;
};

interface OrderFormProviderProps {
  children: ReactNode;
}

const initialFormState: OrderFormState = {
  step: 1,
};

export const OrderFormProvider = ({ children }: OrderFormProviderProps) => {
  const [formState, setFormState] = useState<OrderFormState>(initialFormState);

  const updateFormState = (updates: Partial<OrderFormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormState(initialFormState);
  };

  const goToStep = (step: number) => {
    setFormState(prev => ({ ...prev, step }));
  };

  const nextStep = () => {
    setFormState(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const prevStep = () => {
    setFormState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  };

  const calculatePrice = () => {
    const breakdown: PriceBreakdown[] = [];
    let totalPrice = 0;

    // 1. هزینه پایه خودرو
    if (formState.workerCount && formState.workerCount >= 4) {
      const vehicleRates = {
        PICKUP: 1500000,
        NISSAN: 2000000,
        TRUCK: 2500000,
        HEAVY_TRUCK: 2660300,
      };

      const vehicleType = formState.serviceCategory?.slug || 'PICKUP';
      const vehiclePrice = vehicleRates[vehicleType as keyof typeof vehicleRates] || 1500000;

      breakdown.push({
        label: 'هزینه پایه خودرو',
        quantity: 1,
        unitPrice: vehiclePrice,
        totalPrice: vehiclePrice,
        description: `شامل ${formState.workerCount} کارگر`,
      });
      totalPrice += vehiclePrice;
    }

    // 2. هزینه طبقه مبدا
    if (formState.originFloor && formState.originFloor > 1 && !formState.originHasElevator) {
      const floorPrice = (formState.originFloor - 1) * 75000;
      breakdown.push({
        label: 'هزینه طبقه مبدا',
        quantity: formState.originFloor - 1,
        unitPrice: 75000,
        totalPrice: floorPrice,
        description: 'بدون آسانسور',
      });
      totalPrice += floorPrice;
    }

    // 3. هزینه طبقه مقصد
    if (formState.destinationFloor && formState.destinationFloor > 1 && !formState.destinationHasElevator) {
      const floorPrice = (formState.destinationFloor - 1) * 75000;
      breakdown.push({
        label: 'هزینه طبقه مقصد',
        quantity: formState.destinationFloor - 1,
        unitPrice: 75000,
        totalPrice: floorPrice,
        description: 'بدون آسانسور',
      });
      totalPrice += floorPrice;
    }

    // 4. هزینه مسافت پیاده‌روی
    if (formState.walkDistance && formState.walkDistance > 0) {
      const walkRates: Record<number, number> = {
        20: 200000,
        35: 350000,
        40: 400000,
        50: 500000,
        65: 800000,
      };
      const walkPrice = walkRates[formState.walkDistance] || 0;
      if (walkPrice > 0) {
        breakdown.push({
          label: 'هزینه مسافت پیاده‌روی',
          quantity: 1,
          unitPrice: walkPrice,
          totalPrice: walkPrice,
          description: `${formState.walkDistance} متر`,
        });
        totalPrice += walkPrice;
      }
    }

    // 5. هزینه بسته‌بندی
    if (formState.needsPacking && formState.packingDuration) {
      const packingWorkers = (formState.packingWorkerGender?.male || 0) + (formState.packingWorkerGender?.female || 0);
      if (packingWorkers > 0) {
        const packingPrice = packingWorkers * formState.packingDuration * 200000;
        breakdown.push({
          label: 'هزینه بسته‌بندی',
          quantity: packingWorkers,
          unitPrice: formState.packingDuration * 200000,
          totalPrice: packingPrice,
          description: `${packingWorkers} نفر × ${formState.packingDuration} ساعت`,
        });
        totalPrice += packingPrice;
      }
    }

    // 6. هزینه وسایل سنگین
    if (formState.heavyItems && formState.heavyItems.length > 0) {
      formState.heavyItems.forEach((item) => {
        breakdown.push({
          label: `هزینه جابجایی ${item.catalogItemId}`,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        });
        totalPrice += item.totalPrice;
      });
    }

    // 7. هزینه مسافت (فرضی - در production از نقشه محاسبه می‌شود)
    if (formState.distanceKm && formState.distanceKm > 10) {
      const distancePrice = (formState.distanceKm - 10) * 15000;
      breakdown.push({
        label: 'هزینه مسافت اضافی',
        quantity: formState.distanceKm - 10,
        unitPrice: 15000,
        totalPrice: distancePrice,
        description: 'بیش از ۱۰ کیلومتر',
      });
      totalPrice += distancePrice;
    }

    // 8. هزینه مواد بسته‌بندی (تخمینی)
    if (formState.needsPackingMaterials) {
      const materialsPrice = 500000;
      breakdown.push({
        label: 'هزینه مواد بسته‌بندی',
        quantity: 1,
        unitPrice: materialsPrice,
        totalPrice: materialsPrice,
        description: 'کارتن، چسب، پلاستیک و...',
      });
      totalPrice += materialsPrice;
    }

    updateFormState({
      estimatedPrice: totalPrice,
      priceBreakdown: breakdown,
    });
  };

  const value: OrderFormContextType = {
    formState,
    updateFormState,
    resetForm,
    goToStep,
    nextStep,
    prevStep,
    calculatePrice,
  };

  return <OrderFormContext.Provider value={value}>{children}</OrderFormContext.Provider>;
};
