import dayjs from 'dayjs/esm';

import { IProdutoCadastrado, NewProdutoCadastrado } from './produto-cadastrado.model';

export const sampleWithRequiredData: IProdutoCadastrado = {
  id: 57191,
};

export const sampleWithPartialData: IProdutoCadastrado = {
  id: 65350,
  quando: dayjs('2022-10-04T19:22'),
};

export const sampleWithFullData: IProdutoCadastrado = {
  id: 33470,
  quando: dayjs('2022-10-04T23:10'),
  localArmazenado: 'encryption',
};

export const sampleWithNewData: NewProdutoCadastrado = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
