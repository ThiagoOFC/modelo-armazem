import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProdutoCadastrado } from '../produto-cadastrado.model';
import { ProdutoCadastradoService } from '../service/produto-cadastrado.service';

@Injectable({ providedIn: 'root' })
export class ProdutoCadastradoRoutingResolveService implements Resolve<IProdutoCadastrado | null> {
  constructor(protected service: ProdutoCadastradoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProdutoCadastrado | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((produtoCadastrado: HttpResponse<IProdutoCadastrado>) => {
          if (produtoCadastrado.body) {
            return of(produtoCadastrado.body);
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
