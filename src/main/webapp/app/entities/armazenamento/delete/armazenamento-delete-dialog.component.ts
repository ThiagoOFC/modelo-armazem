import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IArmazenamento } from '../armazenamento.model';
import { ArmazenamentoService } from '../service/armazenamento.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './armazenamento-delete-dialog.component.html',
})
export class ArmazenamentoDeleteDialogComponent {
  armazenamento?: IArmazenamento;

  constructor(protected armazenamentoService: ArmazenamentoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.armazenamentoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
