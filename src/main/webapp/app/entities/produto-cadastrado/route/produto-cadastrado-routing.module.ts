import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProdutoCadastradoComponent } from '../list/produto-cadastrado.component';
import { ProdutoCadastradoDetailComponent } from '../detail/produto-cadastrado-detail.component';
import { ProdutoCadastradoUpdateComponent } from '../update/produto-cadastrado-update.component';
import { ProdutoCadastradoRoutingResolveService } from './produto-cadastrado-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const produtoCadastradoRoute: Routes = [
  {
    path: '',
    component: ProdutoCadastradoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProdutoCadastradoDetailComponent,
    resolve: {
      produtoCadastrado: ProdutoCadastradoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProdutoCadastradoUpdateComponent,
    resolve: {
      produtoCadastrado: ProdutoCadastradoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProdutoCadastradoUpdateComponent,
    resolve: {
      produtoCadastrado: ProdutoCadastradoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(produtoCadastradoRoute)],
  exports: [RouterModule],
})
export class ProdutoCadastradoRoutingModule {}
