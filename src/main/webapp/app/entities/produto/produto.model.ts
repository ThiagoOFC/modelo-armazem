import dayjs from 'dayjs/esm';
import { IProdutoCadastrado } from 'app/entities/produto-cadastrado/produto-cadastrado.model';

export interface IProduto {
  id: number;
  nomeProduto?: string | null;
  altura?: string | null;
  largura?: string | null;
  comprimento?: string | null;
  codigoDeBarra?: string | null;
  tipoDeProduto?: string | null;
  validade?: dayjs.Dayjs | null;
  produtoCadastrado?: Pick<IProdutoCadastrado, 'id' | 'quando'> | null;
}

export type NewProduto = Omit<IProduto, 'id'> & { id: null };
