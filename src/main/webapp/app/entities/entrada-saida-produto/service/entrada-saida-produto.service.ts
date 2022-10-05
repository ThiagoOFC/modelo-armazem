import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEntradaSaidaProduto, NewEntradaSaidaProduto } from '../entrada-saida-produto.model';

export type PartialUpdateEntradaSaidaProduto = Partial<IEntradaSaidaProduto> & Pick<IEntradaSaidaProduto, 'id'>;

type RestOf<T extends IEntradaSaidaProduto | NewEntradaSaidaProduto> = Omit<T, 'quando'> & {
  quando?: string | null;
};

export type RestEntradaSaidaProduto = RestOf<IEntradaSaidaProduto>;

export type NewRestEntradaSaidaProduto = RestOf<NewEntradaSaidaProduto>;

export type PartialUpdateRestEntradaSaidaProduto = RestOf<PartialUpdateEntradaSaidaProduto>;

export type EntityResponseType = HttpResponse<IEntradaSaidaProduto>;
export type EntityArrayResponseType = HttpResponse<IEntradaSaidaProduto[]>;

@Injectable({ providedIn: 'root' })
export class EntradaSaidaProdutoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/entrada-saida-produtos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(entradaSaidaProduto: NewEntradaSaidaProduto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entradaSaidaProduto);
    return this.http
      .post<RestEntradaSaidaProduto>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(entradaSaidaProduto: IEntradaSaidaProduto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entradaSaidaProduto);
    return this.http
      .put<RestEntradaSaidaProduto>(`${this.resourceUrl}/${this.getEntradaSaidaProdutoIdentifier(entradaSaidaProduto)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(entradaSaidaProduto: PartialUpdateEntradaSaidaProduto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entradaSaidaProduto);
    return this.http
      .patch<RestEntradaSaidaProduto>(`${this.resourceUrl}/${this.getEntradaSaidaProdutoIdentifier(entradaSaidaProduto)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEntradaSaidaProduto>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEntradaSaidaProduto[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEntradaSaidaProdutoIdentifier(entradaSaidaProduto: Pick<IEntradaSaidaProduto, 'id'>): number {
    return entradaSaidaProduto.id;
  }

  compareEntradaSaidaProduto(o1: Pick<IEntradaSaidaProduto, 'id'> | null, o2: Pick<IEntradaSaidaProduto, 'id'> | null): boolean {
    return o1 && o2 ? this.getEntradaSaidaProdutoIdentifier(o1) === this.getEntradaSaidaProdutoIdentifier(o2) : o1 === o2;
  }

  addEntradaSaidaProdutoToCollectionIfMissing<Type extends Pick<IEntradaSaidaProduto, 'id'>>(
    entradaSaidaProdutoCollection: Type[],
    ...entradaSaidaProdutosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const entradaSaidaProdutos: Type[] = entradaSaidaProdutosToCheck.filter(isPresent);
    if (entradaSaidaProdutos.length > 0) {
      const entradaSaidaProdutoCollectionIdentifiers = entradaSaidaProdutoCollection.map(
        entradaSaidaProdutoItem => this.getEntradaSaidaProdutoIdentifier(entradaSaidaProdutoItem)!
      );
      const entradaSaidaProdutosToAdd = entradaSaidaProdutos.filter(entradaSaidaProdutoItem => {
        const entradaSaidaProdutoIdentifier = this.getEntradaSaidaProdutoIdentifier(entradaSaidaProdutoItem);
        if (entradaSaidaProdutoCollectionIdentifiers.includes(entradaSaidaProdutoIdentifier)) {
          return false;
        }
        entradaSaidaProdutoCollectionIdentifiers.push(entradaSaidaProdutoIdentifier);
        return true;
      });
      return [...entradaSaidaProdutosToAdd, ...entradaSaidaProdutoCollection];
    }
    return entradaSaidaProdutoCollection;
  }

  protected convertDateFromClient<T extends IEntradaSaidaProduto | NewEntradaSaidaProduto | PartialUpdateEntradaSaidaProduto>(
    entradaSaidaProduto: T
  ): RestOf<T> {
    return {
      ...entradaSaidaProduto,
      quando: entradaSaidaProduto.quando?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restEntradaSaidaProduto: RestEntradaSaidaProduto): IEntradaSaidaProduto {
    return {
      ...restEntradaSaidaProduto,
      quando: restEntradaSaidaProduto.quando ? dayjs(restEntradaSaidaProduto.quando) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEntradaSaidaProduto>): HttpResponse<IEntradaSaidaProduto> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEntradaSaidaProduto[]>): HttpResponse<IEntradaSaidaProduto[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
