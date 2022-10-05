import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEntradaSaidaProduto } from '../entrada-saida-produto.model';
import { EntradaSaidaProdutoService } from '../service/entrada-saida-produto.service';

@Injectable({ providedIn: 'root' })
export class EntradaSaidaProdutoRoutingResolveService implements Resolve<IEntradaSaidaProduto | null> {
  constructor(protected service: EntradaSaidaProdutoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEntradaSaidaProduto | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((entradaSaidaProduto: HttpResponse<IEntradaSaidaProduto>) => {
          if (entradaSaidaProduto.body) {
            return of(entradaSaidaProduto.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
