import { motion } from 'framer-motion';
import { type UseFormReturn } from 'react-hook-form';
import { User, Briefcase } from 'lucide-react';
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
        <h2 className="text-2xl font-display font-bold text-foreground">
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
            <motion.button
              key={type.value}
              type="button"
              onClick={() => form.setValue('personType', type.value, { shouldValidate: true })}
              className={cn(
                'relative p-6 rounded-xl border-2 text-left transition-all duration-300 group',
                isSelected
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30'
                  : 'border-border bg-card hover:border-blue-300 hover:shadow-md'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Selection indicator */}
              <motion.div
                className={cn(
                  'absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                  isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white dark:bg-transparent'
                )}
                initial={false}
                animate={{ scale: isSelected ? 1 : 0.9 }}
              >
                {isSelected && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary-foreground"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.div>

              {/* Icon */}
              <div
                className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300',
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-muted text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground'
                )}
              >
                <Icon className="w-7 h-7" />
              </div>

              {/* Text */}
              <h3
                className={cn(
                  'font-semibold text-lg transition-colors',
                  isSelected ? 'text-primary' : 'text-foreground'
                )}
              >
                {type.label}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
            </motion.button>
          );
        })}
      </div>

      {error && (
        <motion.p
          className="form-field-error text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error.message}
        </motion.p>
      )}
    </div>
  );
};
