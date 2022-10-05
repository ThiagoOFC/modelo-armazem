import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEntradaSaidaProduto } from '../entrada-saida-produto.model';
import { EntradaSaidaProdutoService } from '../service/entrada-saida-produto.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './entrada-saida-produto-delete-dialog.component.html',
})
export class EntradaSaidaProdutoDeleteDialogComponent {
  entradaSaidaProduto?: IEntradaSaidaProduto;

  constructor(protected entradaSaidaProdutoService: EntradaSaidaProdutoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.entradaSaidaProdutoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
