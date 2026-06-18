import { AlertCircle, Loader } from 'lucide-react';
import { Button } from './Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './Dialog';

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function DeleteConfirmModal({ open, onOpenChange, title, description, onConfirm, isLoading = false }: DeleteConfirmModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600" />
            <DialogTitle className="text-rose-600">{title}</DialogTitle>
          </div>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <p className="text-sm text-slate-600">Tindakan ini tidak dapat dibatalkan. Pastikan Anda yakin ingin menghapus.</p>
        <DialogFooter className="gap-3 pt-4 sm:gap-3">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)} className="rounded-2xl" disabled={isLoading}>
            Batal
          </Button>
          <Button variant="destructive" type="button" onClick={handleConfirm} disabled={isLoading} className="rounded-2xl">
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              'Hapus artikel'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
