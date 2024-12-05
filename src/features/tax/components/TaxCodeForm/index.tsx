import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TagsInput } from '@/components/ui/tags-input';

import { ImportExcel } from '../ImportExcel';

interface TaxCodeFormProps {
  onSubmit: (taxCodes: string[]) => void;
}

export function TaxCodeForm({ onSubmit }: TaxCodeFormProps) {
  const [value, setValue] = useState<string[]>([]);
  const [importExcelOpen, setImportExcelOpen] = useState(false);

  return (
    <>
      {importExcelOpen ? (
        <ImportExcel
          onSubmit={(taxCodes) => {
            onSubmit(taxCodes);
            setImportExcelOpen(false);
          }}
          onClose={() => setImportExcelOpen(false)}
        />
      ) : null}
      <div className="flex flex-col md:items-end space-x-2 md:flex-row">
        <div className="space-y-2 w-full">
          <Label htmlFor="manual-input">
            Nhập mã số thuế (Enter để thêm mã mới)
          </Label>
          <TagsInput
            id="manual-input"
            value={value}
            onValueChange={setValue}
            placeholder="Nhập mã số thuế"
            className="w-full"
          />
        </div>
        <div className="flex space-x-2 pt-2">
          <Button
            type="submit"
            onClick={() => {
              onSubmit(value);
              setValue([]);
            }}
          >
            Tra cứu
          </Button>
          <Button variant="secondary" onClick={() => setImportExcelOpen(true)}>
            Nhập từ Excel
          </Button>
        </div>
      </div>
    </>
  );
}
