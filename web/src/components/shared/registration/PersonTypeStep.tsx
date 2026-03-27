import { motion } from 'framer-motion';
import { type UseFormReturn } from 'react-hook-form';
import { User, Briefcase, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type FormData } from './validationSchemas';

interface PersonTypeStepProps {
  form: UseFormReturn<FormData>;
}

const personTypes = [
  {
    value: 'owner',
    label: 'Property Owner',
    description: 'I own a property and want to list it',
    icon: User,
  },
  {
    value: 'broker',
    label: 'Broker / Agent',
    description: 'I help property owners with listings',
    icon: Briefcase,
  },
] as const;

export const PersonTypeStep = ({ form }: PersonTypeStepProps) => {
  const selectedType = form.watch('personType');
  const error = form.formState.errors.personType;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">
          How would you describe yourself?
        </h2>
        <p className="text-muted-foreground mt-2">
          Select the option that best describes your role
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {personTypes.map((type) => {
          const isSelected = selectedType === type.value;
          const Icon = type.icon;

          return (
            <button
              key={type.value}
              type="button"
              onClick={() => form.setValue('personType', type.value, { shouldValidate: true })}
              style={isSelected ? {
                borderColor: '#2563eb',
                backgroundColor: '#eff6ff',
                boxShadow: '0 0 0 2px #2563eb33',
              } : {}}
              className={cn(
                'relative p-6 rounded-xl border-2 text-left transition-all duration-200',
                isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              )}
            >
              {/* Top-right circle indicator */}
              <div
                className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center"
                style={isSelected
                  ? { borderColor: '#2563eb', backgroundColor: '#2563eb' }
                  : { borderColor: '#d1d5db', backgroundColor: 'white' }
                }
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </div>

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                style={isSelected
                  ? { backgroundColor: '#2563eb', color: 'white' }
                  : { backgroundColor: '#f3f4f6', color: '#6b7280' }
                }
              >
                <Icon className="w-7 h-7" />
              </div>

              {/* Text */}
              <h3
                className="font-semibold text-lg"
                style={{ color: isSelected ? '#2563eb' : '#111827' }}
              >
                {type.label}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{type.description}</p>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error.message}</p>
      )}
    </div>
  );
};
