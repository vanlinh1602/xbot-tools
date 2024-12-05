import axios from 'axios';

type TaxRespone = {
  code: string;
  desc: string;
  data: TaxData;
};

export type TaxData = {
  id: string;
  name: string;
  internationalName: string;
  shortName: string;
  address: string;
};

export class TaxLookupService {
  static async getTaxes(
    ids: string[]
  ): Promise<Record<string, TaxData | undefined>> {
    const result: Record<string, TaxData | undefined> = {};
    await Promise.all(
      ids.map(async (id) => {
        const response = await axios.get<TaxRespone>(`/v2/business/${id}`, {
          baseURL: 'https://api.vietqr.io/',
        });
        if (response.data.data) {
          result[id] = response.data.data;
        } else {
          result[id] = undefined;
        }
      })
    );
    return result;
  }
}
