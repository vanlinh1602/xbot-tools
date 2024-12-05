import { CloudUpload } from 'lucide-react';
import { toast } from 'sonner';
import { read, utils } from 'xlsx';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileInput, FileUploader } from '@/components/ui/file-uploader';

import { TaxInput } from '../../type';

type Props = {
  onSubmit: (taxCodes: TaxInput[]) => void;
  onClose: () => void;
};

export const ImportExcel = ({ onSubmit, onClose }: Props) => {
  const handleFileUpload = (files: File[] | null) => {
    try {
      if (!files) return;
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = utils.sheet_to_json(worksheet, {
            header: 1,
          }) as string[][];
          const headers = jsonData.shift();
          if (
            ['Mã số thuế', 'Tên Công Ty', 'Địa chỉ'].join() !== headers?.join()
          ) {
            toast.error('File excel không đúng định dạng');
            return;
          }
          const codes: TaxInput[] = jsonData
            .filter((row) => !!row[0])
            .map((row) => ({
              taxCode: row[0]?.toString(),
              companyName: row[1]?.toString() || '',
              address: row[2]?.toString() || '',
            }));
          onSubmit(codes);
          onClose();
        };
        reader.readAsArrayBuffer(file);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nhập từ excel</DialogTitle>
          <DialogDescription>
            <div>
              <FileUploader
                value={[]}
                onValueChange={handleFileUpload}
                dropzoneOptions={{
                  accept: {
                    'excel/*': ['.xls', '.xlsx'],
                  },
                  multiple: false,
                  maxFiles: 1,
                }}
                className="relative bg-background rounded-lg p-2"
              >
                <FileInput
                  id="fileInput"
                  className="outline-dashed outline-1 outline-slate-500 w-full"
                >
                  <div className="flex items-center justify-center flex-col p-8 w-full ">
                    <CloudUpload className="text-gray-500 w-5 h-5" />
                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span>
                      &nbsp; or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      (Excel file only)
                    </p>
                  </div>
                </FileInput>
              </FileUploader>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/assets/tax-import.xlsx';
                  link.download = 'tax-import.xlsx';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Tải file mẫu
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
