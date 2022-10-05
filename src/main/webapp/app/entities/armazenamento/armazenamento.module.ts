import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ArmazenamentoComponent } from './list/armazenamento.component';
import { ArmazenamentoDetailComponent } from './detail/armazenamento-detail.component';
import { ArmazenamentoUpdateComponent } from './update/armazenamento-update.component';
import { ArmazenamentoDeleteDialogComponent } from './delete/armazenamento-delete-dialog.component';
import { ArmazenamentoRoutingModule } from './route/armazenamento-routing.module';

@NgModule({
  imports: [SharedModule, ArmazenamentoRoutingModule],
  declarations: [ArmazenamentoComponent, ArmazenamentoDetailComponent, ArmazenamentoUpdateComponent, ArmazenamentoDeleteDialogComponent],
})
export class ArmazenamentoModule {}
