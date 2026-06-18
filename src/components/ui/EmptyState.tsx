import { Compass } from 'lucide-react';
import { Card, CardContent } from './Card';

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="border-dashed border-slate-200/90 bg-white/72">
      <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="rounded-2xl bg-teal-50 p-3 text-teal-800">
          <Compass className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold text-slate-900">{title}</p>
          <p className="text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
