import { cn } from '../../lib/utils';

export function PageSection({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <section className={cn('page', className)} {...props} />;
}

export function PageContainer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('container flex flex-col gap-7 sm:gap-8', className)} {...props} />;
}

export function SectionEyebrow({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]',
        className,
      )}
      {...props}
    />
  );
}

export function SectionHeading({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-3', className)} {...props} />;
}

export function SectionIntro({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-4 pb-2', className)} {...props} />;
}

export function SectionActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-3 sm:flex-row sm:flex-wrap', className)} {...props} />;
}
