import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EntradaSaidaProdutoComponent } from './list/entrada-saida-produto.component';
import { EntradaSaidaProdutoDetailComponent } from './detail/entrada-saida-produto-detail.component';
import { EntradaSaidaProdutoUpdateComponent } from './update/entrada-saida-produto-update.component';
import { EntradaSaidaProdutoDeleteDialogComponent } from './delete/entrada-saida-produto-delete-dialog.component';
import { EntradaSaidaProdutoRoutingModule } from './route/entrada-saida-produto-routing.module';

@NgModule({
  imports: [SharedModule, EntradaSaidaProdutoRoutingModule],
  declarations: [
    EntradaSaidaProdutoComponent,
    EntradaSaidaProdutoDetailComponent,
    EntradaSaidaProdutoUpdateComponent,
    EntradaSaidaProdutoDeleteDialogComponent,
  ],
})
export class EntradaSaidaProdutoModule {}
