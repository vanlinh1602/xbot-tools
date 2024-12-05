import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Label } from '@/components/ui/label';
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
import { TaxCodeForm } from '@/features/tax/components/TaxCodeForm';
import { TaxData, TaxLookupService } from '@/services/tax';

// const tmp = ['0315037437', '0318770836', '123'];

export default function TaxCode() {
  const [handling, setHandling] = useState(false);
  const [taxCodes, setTaxCodes] =
    useState<Record<string, TaxData | undefined>>();
  const [filter, setFilter] = useState<{
    status: 'all' | 'valid' | 'invalid';
  }>({ status: 'all' });

  const handleTaxCodesSubmit = async (newTaxCodes: string[]) => {
    setHandling(true);
    try {
      const result = await TaxLookupService.getTaxes(newTaxCodes);
      setTaxCodes(result);
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
        if (filter.status === 'valid') {
          return !!data;
        }
        return !data;
      })
    );
  }, [taxCodes, filter.status]);
  console.log('filteredTaxCodes', filteredTaxCodes);

  return (
    <div className="container mx-auto p-4 space-y-4">
      {handling ? <Waiting /> : null}
      <h1 className="text-2xl font-bold">Tra Cứu Mã Số Thuế</h1>
      <TaxCodeForm onSubmit={handleTaxCodesSubmit} />
      <div className="flex justify-end items-center space-x-2">
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
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-semibold text-gray-900 border-b md:w-48">
                Mã số thuế
              </TableHead>
              <TableHead className="font-semibold text-gray-900 border-b border-l border-r">
                Thông tin
              </TableHead>
              <TableHead className="font-semibold text-gray-900 border-b md:w-24 text-center">
                Trạng thái
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(filteredTaxCodes).map(([id, data], index) => (
              <TableRow
                key={id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <TableCell className="border-b border-gray-200">{id}</TableCell>
                <TableCell className="border-b border-l border-r border-gray-200">
                  {data ? (
                    <div>
                      <p>
                        {data.name}{' '}
                        {data.shortName ? `( ${data.shortName} )` : ''}
                      </p>
                      <p>{data.address}</p>
                    </div>
                  ) : (
                    'Không tìm thấy'
                  )}
                </TableCell>
                <TableCell className="border-b border-gray-200 text-center">
                  <span
                    className={`px-2 py-1 rounded ${
                      data
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {data ? 'Đúng' : 'Sai'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
