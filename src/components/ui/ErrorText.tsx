import { AlertCircle } from 'lucide-react';

export function ErrorText({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
