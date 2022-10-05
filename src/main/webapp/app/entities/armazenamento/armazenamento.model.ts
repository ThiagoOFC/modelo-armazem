import { IProdutoCadastrado } from 'app/entities/produto-cadastrado/produto-cadastrado.model';

export interface IArmazenamento {
  id: number;
  local?: string | null;
  tipoDeArmazenamento?: string | null;
  endereco?: string | null;
  produtoCadastrado?: Pick<IProdutoCadastrado, 'id' | 'quando'> | null;
}

export type NewArmazenamento = Omit<IArmazenamento, 'id'> & { id: null };
