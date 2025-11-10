import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { SERVICE_CATEGORIES } from '../../constants';
import { ServiceCategory } from '../../types';
import { Check, ArrowRight } from 'lucide-react';

interface ServiceSelectionStepProps {
  selectedService?: ServiceCategory;
  onSelectService: (service: ServiceCategory) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const ServiceSelectionStep = ({
  selectedService,
  onSelectService,
  onBack,
  showBackButton = false,
}: ServiceSelectionStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="mb-2">چه خدمتی نیاز دارید؟</h2>
          <p className="text-muted-foreground">لطفاً نوع خدمت مورد نظر خود را انتخاب کنید</p>
        </div>
        {showBackButton && onBack && (
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowRight className="w-4 h-4 ml-2" />
            بازگشت
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICE_CATEGORIES.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedService?.id === service.id
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border'
            }`}
            onClick={() =>
              onSelectService(service as ServiceCategory)
            }
          >
            <CardContent className="p-6 relative">
              {selectedService?.id === service.id && (
                <div className="absolute left-4 top-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="text-4xl">{service.icon}</div>
                <h3 className="text-lg">{service.name}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
