import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EntradaSaidaProdutoComponent } from '../list/entrada-saida-produto.component';
import { EntradaSaidaProdutoDetailComponent } from '../detail/entrada-saida-produto-detail.component';
import { EntradaSaidaProdutoUpdateComponent } from '../update/entrada-saida-produto-update.component';
import { EntradaSaidaProdutoRoutingResolveService } from './entrada-saida-produto-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const entradaSaidaProdutoRoute: Routes = [
  {
    path: '',
    component: EntradaSaidaProdutoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EntradaSaidaProdutoDetailComponent,
    resolve: {
      entradaSaidaProduto: EntradaSaidaProdutoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EntradaSaidaProdutoUpdateComponent,
    resolve: {
      entradaSaidaProduto: EntradaSaidaProdutoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EntradaSaidaProdutoUpdateComponent,
    resolve: {
      entradaSaidaProduto: EntradaSaidaProdutoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(entradaSaidaProdutoRoute)],
  exports: [RouterModule],
})
export class EntradaSaidaProdutoRoutingModule {}
