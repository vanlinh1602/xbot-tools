import { CloudUpload } from 'lucide-react';
import { read, utils } from 'xlsx';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileInput, FileUploader } from '@/components/ui/file-uploader';

type Props = {
  onSubmit: (taxCodes: string[]) => void;
  onClose: () => void;
};

export const ImportExcel = ({ onSubmit, onClose }: Props) => {
  const handleFileUpload = (files: File[] | null) => {
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
        console.log('jsonData', jsonData);

        const codes = jsonData.flat().filter(Boolean);
        onSubmit(codes);
      };
      reader.readAsArrayBuffer(file);
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
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
