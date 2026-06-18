import { Card } from './Card';

export function LoadingCardGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="flex h-full flex-col overflow-hidden border-white/60 bg-white/72 animate-pulse">
          <div className="aspect-[4/3] shrink-0 bg-white/50" />
          <div className="flex flex-1 flex-col gap-2 p-5">
            <div className="h-2 w-20 rounded bg-white/50" />
            <div className="h-3 w-2/3 rounded bg-white/50" />
            <div className="h-2 w-full rounded bg-white/50" />
            <div className="mt-2 h-10 rounded-2xl bg-white/50" />
          </div>
        </Card>
      ))}
    </div>
  );
}
