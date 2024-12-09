import { Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Waiting from '@/components/Waiting';
import FormImport from '@/features/tax/components/FormImport';
import { ImportExcel } from '@/features/tax/components/ImportExcel';
import { TaxInput, TaxSearch } from '@/features/tax/type';
import { checkValidTax } from '@/lib/utils';
import { TaxLookupService } from '@/services/tax';

// const tmp = ['0315037437', '0318770836', '123'];

export default function TaxCode() {
  const [handling, setHandling] = useState(false);
  const [openImportExcel, setOpenImportExcel] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [taxCodes, setTaxCodes] = useState<TaxSearch>();
  const [filter, setFilter] = useState<{
    status: 'all' | 'valid' | 'invalid';
  }>({ status: 'all' });

  const handleSearchTaxes = async () => {
    setHandling(true);
    try {
      const taxIds = Object.keys(taxCodes ?? {}).filter(
        (id) => !taxCodes?.[id].query
      );
      if (!taxIds.length) {
        toast.error('Vui lòng nhập ít nhất một mã số thuế chưa tra cứu');
        return;
      }
      const updatedTaxCodes = { ...taxCodes };

      const result = await TaxLookupService.getTaxes(taxIds);
      Object.entries(result).forEach(([id, data]) => {
        updatedTaxCodes[id] = {
          ...updatedTaxCodes[id],
          query: data || {
            id,
            name: 'Mã số thuế không tồn tại',
            internationalName: '',
            shortName: '',
            address: '',
          },
        };
      });
      setTaxCodes(updatedTaxCodes);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setHandling(false);
    }
  };

  const filteredTaxCodes = useMemo(() => {
    return Object.fromEntries(
      Object.entries(taxCodes ?? {}).filter(([_taxId, data]) => {
        if (filter.status === 'all') {
          return true;
        }
        const check = checkValidTax(data.input, data.query);
        if (filter.status === 'valid') {
          return check?.length === 0;
        }
        return check?.length;
      })
    );
  }, [taxCodes, filter.status]);

  const handleInportTaxes = (taxes: TaxInput[]) => {
    const taxesAdded = taxes.reduce((acc, tax) => {
      acc[tax.taxCode] = {
        input: tax,
      };
      return acc;
    }, {} as TaxSearch);
    setTaxCodes((pre) => ({ ...pre, ...taxesAdded }));
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      {handling ? <Waiting /> : null}
      {openImportExcel ? (
        <ImportExcel
          onSubmit={handleInportTaxes}
          onClose={() => setOpenImportExcel(false)}
        />
      ) : null}
      {openForm ? (
        <FormImport
          onSubmit={(value) => {
            handleInportTaxes([value]);
          }}
          onClose={() => setOpenForm(false)}
        />
      ) : null}
      <h1 className="text-2xl font-bold">Tra Cứu Mã Số Thuế</h1>

      <div className="flex justify-between">
        <div className="flex space-x-2 items-center">
          <Button
            onClick={() => {
              setOpenForm(true);
            }}
          >
            Thêm thủ công
          </Button>

          <Button variant="secondary" onClick={() => setOpenImportExcel(true)}>
            Nhập từ Excel
          </Button>
          <Button onClick={handleSearchTaxes}>
            <Search />
            Tra cứu
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setTaxCodes({});
            }}
          >
            <Trash2 />
          </Button>
        </div>
        <div className="flex space-x-2 items-center">
          <Label htmlFor="filter">Lọc trạng thái</Label>
          <Select
            value={filter.status}
            onValueChange={(value) => setFilter({ status: value as any })}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="valid">Đúng</SelectItem>
              <SelectItem value="invalid">Sai</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-semibold text-gray-900 border-b md:w-40">
                Mã số thuế
              </TableHead>
              <TableHead className="font-semibold text-gray-900 border-b border-l border-r">
                Thông tin nhập
              </TableHead>
              <TableHead className="font-semibold text-gray-900 border-b border-l border-r">
                Thông tin tra cứu
              </TableHead>
              <TableHead className="font-semibold text-gray-900 border-b md:w-24 text-center">
                Trạng thái
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(filteredTaxCodes).map(([id, data], index) => {
              const check = checkValidTax(data.input, data.query);
              return (
                <TableRow
                  key={id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <TableCell className="border-b border-gray-200">
                    {id}
                  </TableCell>
                  <TableCell className="border-b border-l border-r border-gray-200">
                    <div>
                      <p>{data.input.companyName}</p>
                      <p>{data.input.address}</p>
                    </div>
                  </TableCell>
                  <TableCell className="border-b border-l border-r border-gray-200">
                    {data.query ? (
                      <div>
                        <p>{data.query?.name}</p>
                        <p>{data.query?.address}</p>
                      </div>
                    ) : (
                      'Không có thông tin tra cứu'
                    )}
                  </TableCell>
                  <TableCell className="border-b border-gray-200 text-center">
                    {(data.input?.companyName || data.input.address) &&
                    check ? (
                      <Popover>
                        <PopoverTrigger disabled={!check?.length}>
                          <span
                            className={`px-2 py-1 rounded ${
                              !check?.length
                                ? 'bg-green-200 text-green-800'
                                : 'bg-red-200 text-red-800'
                            }`}
                          >
                            {check.length === 0 ? 'Đúng' : 'Sai'}
                          </span>
                        </PopoverTrigger>
                        <PopoverContent>{check.join(', ')}</PopoverContent>
                      </Popover>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
