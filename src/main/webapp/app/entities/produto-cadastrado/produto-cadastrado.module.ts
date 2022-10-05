import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProdutoCadastradoComponent } from './list/produto-cadastrado.component';
import { ProdutoCadastradoDetailComponent } from './detail/produto-cadastrado-detail.component';
import { ProdutoCadastradoUpdateComponent } from './update/produto-cadastrado-update.component';
import { ProdutoCadastradoDeleteDialogComponent } from './delete/produto-cadastrado-delete-dialog.component';
import { ProdutoCadastradoRoutingModule } from './route/produto-cadastrado-routing.module';

@NgModule({
  imports: [SharedModule, ProdutoCadastradoRoutingModule],
  declarations: [
    ProdutoCadastradoComponent,
    ProdutoCadastradoDetailComponent,
    ProdutoCadastradoUpdateComponent,
    ProdutoCadastradoDeleteDialogComponent,
  ],
})
export class ProdutoCadastradoModule {}
