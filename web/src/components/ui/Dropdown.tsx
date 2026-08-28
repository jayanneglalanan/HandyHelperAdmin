import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
  fullWidth?: boolean;
}

export default function Dropdown({ value, onChange, options, placeholder = 'Select...', className = '', fullWidth = false }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className={`relative ${fullWidth ? 'w-full' : ''} ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between gap-2 px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 min-h-[40px] hover:border-gray-400 dark:hover:border-gray-500 transition-colors ${fullWidth ? 'w-full' : 'min-w-[120px]'}`}
      >
        <span className={selected ? '' : 'text-gray-400 dark:text-gray-500'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => { onChange(option.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${option.value === value ? 'bg-gray-100 dark:bg-gray-700 font-medium' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
