import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, name, className, ...props }) => {
  const handleIncrement = () => {
    const e = {
      target: { name, value: String(value + 1), type: 'number' }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(e);
  };

  const handleDecrement = () => {
    const e = {
      target: { name, value: String(value - 1), type: 'number' }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(e);
  };

  return (
    <div className={`custom-number-input ${className || ''}`}>
      <input type="number" name={name} value={value} onChange={onChange} {...props} />
      <div className="spin-btn-group">
        <button type="button" onClick={handleIncrement} className="spin-btn plus">
          <Plus size={10} strokeWidth={3} />
        </button>
        <button type="button" onClick={handleDecrement} className="spin-btn minus">
          <Minus size={10} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};
