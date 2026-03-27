import { type UseFormReturn } from 'react-hook-form';
import { User, Briefcase } from 'lucide-react';
import { type FormData } from './validationSchemas';

interface PersonTypeStepProps {
  form: UseFormReturn<FormData>;
}

const personTypes = [
  { value: 'owner', label: 'Property Owner', description: 'I own a property and want to list it', icon: User },
  { value: 'broker', label: 'Broker / Agent', description: 'I help property owners with listings', icon: Briefcase },
] as const;

export const PersonTypeStep = ({ form }: PersonTypeStepProps) => {
  // Use controller value directly — watch can be stale
  const selectedType = form.getValues('personType');
  // Force re-render on change by subscribing
  form.watch('personType');
  const error = form.formState.errors.personType;

  const select = (val: 'owner' | 'broker') => {
    form.setValue('personType', val, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    // Force re-render
    form.trigger('personType');
  };

  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>How would you describe yourself?</h2>
        <p style={{ color: '#6b7280' }}>Select the option that best describes your role</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {personTypes.map((type) => {
          const isSelected = form.watch('personType') === type.value;
          const Icon = type.icon;

          return (
            <button
              key={type.value}
              type="button"
              onClick={() => select(type.value)}
              style={{
                position: 'relative',
                padding: '24px',
                borderRadius: '12px',
                border: isSelected ? '2px solid #2563eb' : '2px solid #e5e7eb',
                backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                boxShadow: isSelected ? '0 0 0 3px rgba(37,99,235,0.2)' : 'none',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {/* Circle indicator top-right */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                border: isSelected ? '2px solid #2563eb' : '2px solid #d1d5db',
                backgroundColor: isSelected ? '#2563eb' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {isSelected && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
                )}
              </div>

              {/* Icon */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                backgroundColor: isSelected ? '#2563eb' : '#f3f4f6',
                color: isSelected ? '#ffffff' : '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <Icon size={28} />
              </div>

              <h3 style={{ fontWeight: 600, fontSize: '18px', color: isSelected ? '#2563eb' : '#111827', marginBottom: '4px' }}>
                {type.label}
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>{type.description}</p>
            </button>
          );
        })}
      </div>

      {error && <p style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center', marginTop: '12px' }}>{error.message as string}</p>}
    </div>
  );
};
