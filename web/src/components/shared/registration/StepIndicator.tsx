import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative mb-8">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-primary rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div
              key={index}
              className={cn(
                'flex flex-col items-center text-center flex-1',
                index < steps.length - 1 && 'relative'
              )}
            >
              {/* Step circle */}
              <motion.div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 relative z-10',
                  isCompleted && 'bg-primary text-primary-foreground shadow-glow',
                  isCurrent && 'bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-glow',
                  isUpcoming && 'bg-muted text-muted-foreground'
                )}
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : (
                  index + 1
                )}
              </motion.div>

              {/* Step text */}
              <div className="mt-3 hidden sm:block">
                <p
                  className={cn(
                    'text-sm font-medium transition-colors duration-300',
                    isCurrent && 'text-foreground',
                    isCompleted && 'text-primary',
                    isUpcoming && 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-[120px]">
                  {step.description}
                </p>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden sm:block absolute top-5 left-[60%] right-0 h-0.5">
                  <div className="h-full bg-muted rounded-full" />
                  <motion.div
                    className="absolute top-0 left-0 h-full gradient-primary rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
