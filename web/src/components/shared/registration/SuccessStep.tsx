import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type FormData } from './validationSchemas';

interface SuccessStepProps {
  formData: FormData;
  onReset: () => void;
}

export const SuccessStep = ({ formData, onReset }: SuccessStepProps) => {
  return (
    <div className="text-center py-8">
      <motion.div
        className="w-20 h-20 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center shadow-glow"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
        </motion.div>
      </motion.div>

      <motion.h2
        className="text-2xl font-display font-bold text-foreground mb-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Registration Complete!
      </motion.h2>

      <motion.p
        className="text-muted-foreground mb-8 max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Thank you for registering, <span className="font-medium text-foreground">{formData.fullName}</span>.
        Your {formData.personType === 'owner' ? 'property owner' : 'broker'} account has been created successfully.
      </motion.p>

      <motion.div
        className="bg-card rounded-xl border border-border p-6 max-w-sm mx-auto mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="font-medium text-foreground mb-4">Account Summary</h4>
        <div className="space-y-3 text-sm text-left">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account Type</span>
            <span className="font-medium text-foreground capitalize">{formData.personType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium text-foreground">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phone</span>
            <span className="font-medium text-foreground">{formData.phoneNumber}</span>
          </div>
          {formData.personType === 'owner' && formData.propertyType && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Property Type</span>
              <span className="font-medium text-foreground capitalize">{formData.propertyType}</span>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button onClick={onReset} className="gradient-primary text-primary-foreground">
          Register Another Property
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
};
