import dayjs from 'dayjs/esm';

import { IProduto, NewProduto } from './produto.model';

export const sampleWithRequiredData: IProduto = {
  id: 79836,
};

export const sampleWithPartialData: IProduto = {
  id: 14475,
  nomeProduto: 'Rua',
  validade: dayjs('2022-10-04'),
};

export const sampleWithFullData: IProduto = {
  id: 86863,
  nomeProduto: 'Polarised revolutionary hybrid',
  altura: 'global Borracha',
  largura: 'withdrawal compressing mission-critical',
  comprimento: 'visualize matrix Borracha',
  codigoDeBarra: 'dot-com synthesize Rústico',
  tipoDeProduto: 'generating Mônaco overriding',
  validade: dayjs('2022-10-04'),
};

export const sampleWithNewData: NewProduto = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
