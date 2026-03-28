import { useState } from 'react';
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
  // Local state drives the UI — synced to form on click
  const [selected, setSelected] = useState<'owner' | 'broker' | null>(
    (form.getValues('personType') as 'owner' | 'broker') || null
  );
  const error = form.formState.errors.personType;

  const handleSelect = (val: 'owner' | 'broker') => {
    setSelected(val);
    form.setValue('personType', val, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>How would you describe yourself?</h2>
        <p style={{ color: '#6b7280', fontSize: '15px' }}>Select the option that best describes your role</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {personTypes.map((type) => {
          const isSelected = selected === type.value;
          const Icon = type.icon;

          return (
            <button
              key={type.value}
              type="button"
              onClick={() => handleSelect(type.value)}
              style={{
                position: 'relative',
                padding: '24px',
                borderRadius: '12px',
                border: isSelected ? '2.5px solid #2563eb' : '2px solid #e5e7eb',
                backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                boxShadow: isSelected ? '0 0 0 3px rgba(37,99,235,0.15)' : '0 1px 3px rgba(0,0,0,0.06)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                outline: 'none',
              }}
            >
              {/* Circle indicator top-right */}
              <div style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                border: isSelected ? '2px solid #2563eb' : '2px solid #d1d5db',
                backgroundColor: isSelected ? '#2563eb' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}>
                {isSelected && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
                )}
              </div>

              {/* Icon box */}
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '10px',
                backgroundColor: isSelected ? '#2563eb' : '#f3f4f6',
                color: isSelected ? '#ffffff' : '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
                transition: 'all 0.15s ease',
              }}>
                <Icon size={26} />
              </div>

              <h3 style={{ fontWeight: 600, fontSize: '17px', color: isSelected ? '#2563eb' : '#111827', marginBottom: '4px' }}>
                {type.label}
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{type.description}</p>
            </button>
          );
        })}
      </div>

      {error && (
        <p style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', marginTop: '12px' }}>
          {error.message as string}
        </p>
      )}
    </div>
  );
};
