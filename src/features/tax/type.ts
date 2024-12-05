import { TaxData } from '@/services/tax';

export type TaxInput = {
  taxCode: string;
  companyName?: string;
  address?: string;
};

export type TaxSearch = Record<
  string,
  {
    input: TaxInput;
    query?: TaxData;
  }
>;
