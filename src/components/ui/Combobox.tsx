import * as React from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Label } from './Label';

export interface ComboboxOption {
  id: string | number;
  label: string;
}

interface ComboboxProps extends Omit<React.ComponentProps<'input'>, 'onChange' | 'value'> {
  label?: string;
  error?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  options: ComboboxOption[];
  placeholder?: string;
  isLoading?: boolean;
  searchPlaceholder?: string;
}

const Combobox = React.forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      label,
      error,
      value,
      onChange,
      options,
      placeholder = 'Pilih opsi...',
      isLoading = false,
      searchPlaceholder = 'Cari...',
      id,
      name,
      disabled,
    },
    forwardedRef,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchInput, setSearchInput] = React.useState('');
    const [dropdownPos, setDropdownPos] = React.useState({ top: 0, left: 0, width: 0 });
    const containerRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const comboboxId = id ?? name;

    const selectedOption = options.find((opt) => String(opt.id) === String(value));
    const filteredOptions = options.filter((opt) => opt.label.toLowerCase().includes(searchInput.toLowerCase()));

    React.useImperativeHandle(forwardedRef, () => containerRef.current as HTMLDivElement, []);

    const closeDropdown = React.useCallback(() => {
      setIsOpen(false);
      setSearchInput('');
    }, []);

    const updateDropdownPosition = React.useCallback(() => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }, []);

    React.useEffect(() => {
      if (!isOpen) return;
      updateDropdownPosition();
      const handleResize = () => updateDropdownPosition();
      const handleScroll = () => updateDropdownPosition();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }, [isOpen, updateDropdownPosition]);

    React.useEffect(() => {
      if (!isOpen) return;
      const handlePointerDown = (event: PointerEvent) => {
        if (!containerRef.current?.contains(event.target as Node)) {
          closeDropdown();
        }
      };
      document.addEventListener('pointerdown', handlePointerDown);
      return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [closeDropdown, isOpen]);

    React.useEffect(() => {
      if (!isOpen) return;
      window.requestAnimationFrame(() => inputRef.current?.focus());
    }, [isOpen]);

    const handleToggle = () => {
      if (disabled) return;
      setIsOpen((prev) => !prev);
      if (isOpen) setSearchInput('');
    };

    const handleSelect = React.useCallback(
      (optionId: string | number) => {
        onChange?.(optionId);
        closeDropdown();
      },
      [closeDropdown, onChange],
    );

    const handleClear = () => {
      onChange?.('');
      closeDropdown();
    };

    const dropdown =
      isOpen &&
      createPortal(
        <div
          className="fixed z-[9999] overflow-hidden rounded-3xl border border-slate-200/90 bg-white/98 shadow-[0_24px_60px_rgba(15,23,42,0.14)]"
          style={{
            top: `${dropdownPos.top}px`,
            left: `${dropdownPos.left}px`,
            width: `${dropdownPos.width}px`,
          }}
          role="listbox"
        >
          {isLoading ? (
            <div className="px-4 py-3 text-center text-sm text-slate-500">Memuat...</div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-center text-sm text-slate-500">
              {options.length === 0 ? 'Tidak ada opsi' : 'Tidak ada hasil pencarian'}
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto p-2">
              {filteredOptions.map((option) => {
                const isSelected = String(option.id) === String(value);

                return (
                  <button
                    key={option.id}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(option.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition hover:bg-slate-100 focus:bg-slate-100 focus:outline-none',
                      isSelected && 'bg-teal-50 font-medium text-teal-900',
                    )}
                  >
                    <span>{option.label}</span>
                    {isSelected ? <Check className="h-4 w-4" /> : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>,
        document.body,
      );

    return (
      <div className="grid gap-3" ref={containerRef}>
        {label ? <Label htmlFor={comboboxId}>{label}</Label> : null}
        <div className="relative w-full">
          <button
            ref={triggerRef}
            type="button"
            id={comboboxId}
            disabled={disabled}
            onClick={handleToggle}
            className={cn(
              'flex h-12 w-full items-center rounded-2xl border border-slate-200/90 bg-white/96 px-4 py-3 text-left text-sm text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.06)] ring-offset-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2',
              error && 'border-rose-300 focus-visible:ring-rose-300',
              disabled && 'cursor-not-allowed opacity-50',
            )}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            {isOpen ? <Search className="mr-2 h-4 w-4 shrink-0 text-slate-400" /> : null}
            {isOpen ? (
              <input
                ref={inputRef}
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={searchPlaceholder}
                disabled={disabled}
                className="flex-1 border-none bg-transparent p-0 text-slate-900 outline-none placeholder:text-slate-500"
                onClick={(event) => event.stopPropagation()}
              />
            ) : (
              <span className={cn('flex-1 truncate', !selectedOption && 'text-slate-500')}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            )}
            {selectedOption && isOpen ? (
              <span
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  handleClear();
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleClear();
                  }
                }}
                className="ml-2 shrink-0 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </span>
            ) : null}
            <ChevronDown className={cn('ml-2 h-4 w-4 shrink-0 text-slate-400 transition', isOpen && 'rotate-180')} />
          </button>
        </div>
        {dropdown}
        {error ? <span className="text-sm text-rose-600">{error}</span> : null}
      </div>
    );
  },
);

Combobox.displayName = 'Combobox';

export { Combobox };
