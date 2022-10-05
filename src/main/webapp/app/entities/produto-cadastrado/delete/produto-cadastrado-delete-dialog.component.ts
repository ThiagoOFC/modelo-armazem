import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProdutoCadastrado } from '../produto-cadastrado.model';
import { ProdutoCadastradoService } from '../service/produto-cadastrado.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './produto-cadastrado-delete-dialog.component.html',
})
export class ProdutoCadastradoDeleteDialogComponent {
  produtoCadastrado?: IProdutoCadastrado;

  constructor(protected produtoCadastradoService: ProdutoCadastradoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.produtoCadastradoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
