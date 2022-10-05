import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ArmazenamentoComponent } from '../list/armazenamento.component';
import { ArmazenamentoDetailComponent } from '../detail/armazenamento-detail.component';
import { ArmazenamentoUpdateComponent } from '../update/armazenamento-update.component';
import { ArmazenamentoRoutingResolveService } from './armazenamento-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const armazenamentoRoute: Routes = [
  {
    path: '',
    component: ArmazenamentoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ArmazenamentoDetailComponent,
    resolve: {
      armazenamento: ArmazenamentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ArmazenamentoUpdateComponent,
    resolve: {
      armazenamento: ArmazenamentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ArmazenamentoUpdateComponent,
    resolve: {
      armazenamento: ArmazenamentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(armazenamentoRoute)],
  exports: [RouterModule],
})
export class ArmazenamentoRoutingModule {}
