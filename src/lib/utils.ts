import { type ClassValue, clsx } from 'clsx';
import _ from 'lodash';
import { twMerge } from 'tailwind-merge';

import { TaxInput } from '@/features/tax/type';
import { TaxData } from '@/services/tax';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkValidTax = (input: TaxInput, query?: TaxData) => {
  if (!query) return false;
  return (
    _.isEqual(
      _.toLower(_.trim(input.companyName)),
      _.toLower(_.trim(query.name))
    ) &&
    _.isEqual(
      _.toLower(_.trim(input.address)),
      _.toLower(_.trim(query.address))
    )
  );
};
