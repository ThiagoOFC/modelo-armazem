import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IArmazenamento } from '../armazenamento.model';
import { ArmazenamentoService } from '../service/armazenamento.service';

@Injectable({ providedIn: 'root' })
export class ArmazenamentoRoutingResolveService implements Resolve<IArmazenamento | null> {
  constructor(protected service: ArmazenamentoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IArmazenamento | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((armazenamento: HttpResponse<IArmazenamento>) => {
          if (armazenamento.body) {
            return of(armazenamento.body);
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
