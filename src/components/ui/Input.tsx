import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Label } from './Label';

type InputProps = React.ComponentProps<'input'> & {
  label?: string;
  error?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, label, error, id, ...props }, ref) => {
  const inputId = id ?? props.name;
  const isPasswordField = type === 'password';
  const [showPassword, setShowPassword] = React.useState(false);
  const resolvedType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

  const control = (
    <div className="relative">
      <input
        id={inputId}
        type={resolvedType}
        className={cn(
          'flex h-12 w-full rounded-2xl border border-slate-200/90 bg-white/96 px-4 py-3 text-sm text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.06)] ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          isPasswordField && 'pr-12',
          error && 'border-rose-300 focus-visible:ring-rose-300',
          className,
        )}
        ref={ref}
        {...props}
      />
      {isPasswordField ? (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      ) : null}
    </div>
  );

  if (!label) {
    return control;
  }

  return (
    <div className="grid gap-3">
      <Label htmlFor={inputId}>{label}</Label>
      {control}
      {error ? <span className="text-sm text-rose-600">{error}</span> : null}
    </div>
  );
});
Input.displayName = 'Input';

export { Input };
