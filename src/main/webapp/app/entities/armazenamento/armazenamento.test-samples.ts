import { IArmazenamento, NewArmazenamento } from './armazenamento.model';

export const sampleWithRequiredData: IArmazenamento = {
  id: 57516,
};

export const sampleWithPartialData: IArmazenamento = {
  id: 34891,
  local: 'invoice Front-line Digitized',
};

export const sampleWithFullData: IArmazenamento = {
  id: 71651,
  local: 'Visionary Livros',
  tipoDeArmazenamento: 'Camiseta Group',
  endereco: 'pixel',
};

export const sampleWithNewData: NewArmazenamento = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
