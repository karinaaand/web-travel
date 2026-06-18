export function PageLoader({ label = 'Memuat halaman...' }: { label?: string }) {
  return (
    <section className="px-0 py-8 sm:py-10">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <div className="flex min-h-55 items-center justify-center gap-5 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_60px_rgba(31,42,46,0.08)]">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-900/15 border-t-teal-900" aria-hidden="true" />
          <div>
            <p className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-900">
              Travel Article App
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-500">{label}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
