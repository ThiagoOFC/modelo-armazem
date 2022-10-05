import dayjs from 'dayjs/esm';

import { IEntradaSaidaProduto, NewEntradaSaidaProduto } from './entrada-saida-produto.model';

export const sampleWithRequiredData: IEntradaSaidaProduto = {
  id: 13449,
};

export const sampleWithPartialData: IEntradaSaidaProduto = {
  id: 41693,
};

export const sampleWithFullData: IEntradaSaidaProduto = {
  id: 94351,
  quando: dayjs('2022-10-04T13:45'),
  quantidade: 'synthesizing Loti',
};

export const sampleWithNewData: NewEntradaSaidaProduto = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
