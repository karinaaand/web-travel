import * as React from 'react';
import { cn } from '../../lib/utils';
import { Label } from './Label';

type SelectProps = React.ComponentProps<'select'> & {
  label?: string;
  error?: string;
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, label, error, id, ...props }, ref) => {
  const selectId = id ?? props.name;
  const control = (
    <select
      ref={ref}
      id={selectId}
      className={cn(
        'flex h-12 w-full rounded-2xl border border-slate-200/90 bg-white/96 px-4 py-3 text-sm text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.06)] ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-rose-300 focus-visible:ring-rose-300',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );

  if (!label) {
    return control;
  }

  return (
    <div className="grid gap-3">
      <Label htmlFor={selectId}>{label}</Label>
      {control}
      {error ? <span className="text-sm text-rose-600">{error}</span> : null}
    </div>
  );
});
Select.displayName = 'Select';

export { Select };
