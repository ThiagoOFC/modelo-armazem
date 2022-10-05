import dayjs from 'dayjs/esm';

export interface IProdutoCadastrado {
  id: number;
  quando?: dayjs.Dayjs | null;
  localArmazenado?: string | null;
}

export type NewProdutoCadastrado = Omit<IProdutoCadastrado, 'id'> & { id: null };
