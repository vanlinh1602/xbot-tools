import axios from 'axios';
import _ from 'lodash';

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
    const sliptIds = _.chunk(ids, 15);
    for (const chunk of sliptIds) {
      await Promise.all(
        chunk.map(async (id) => {
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
      if (chunk !== _.last(sliptIds)) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
    return result;
  }
}
