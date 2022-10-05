import dayjs from 'dayjs/esm';
import { IProdutoCadastrado } from 'app/entities/produto-cadastrado/produto-cadastrado.model';

export interface IEntradaSaidaProduto {
  id: number;
  quando?: dayjs.Dayjs | null;
  quantidade?: string | null;
  produtoCadastrado?: Pick<IProdutoCadastrado, 'id' | 'quando'> | null;
}

export type NewEntradaSaidaProduto = Omit<IEntradaSaidaProduto, 'id'> & { id: null };
