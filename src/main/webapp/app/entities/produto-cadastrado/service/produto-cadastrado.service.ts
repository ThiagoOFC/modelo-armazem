import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProdutoCadastrado, NewProdutoCadastrado } from '../produto-cadastrado.model';

export type PartialUpdateProdutoCadastrado = Partial<IProdutoCadastrado> & Pick<IProdutoCadastrado, 'id'>;

type RestOf<T extends IProdutoCadastrado | NewProdutoCadastrado> = Omit<T, 'quando'> & {
  quando?: string | null;
};

export type RestProdutoCadastrado = RestOf<IProdutoCadastrado>;

export type NewRestProdutoCadastrado = RestOf<NewProdutoCadastrado>;

export type PartialUpdateRestProdutoCadastrado = RestOf<PartialUpdateProdutoCadastrado>;

export type EntityResponseType = HttpResponse<IProdutoCadastrado>;
export type EntityArrayResponseType = HttpResponse<IProdutoCadastrado[]>;

@Injectable({ providedIn: 'root' })
export class ProdutoCadastradoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/produto-cadastrados');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(produtoCadastrado: NewProdutoCadastrado): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(produtoCadastrado);
    return this.http
      .post<RestProdutoCadastrado>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(produtoCadastrado: IProdutoCadastrado): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(produtoCadastrado);
    return this.http
      .put<RestProdutoCadastrado>(`${this.resourceUrl}/${this.getProdutoCadastradoIdentifier(produtoCadastrado)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(produtoCadastrado: PartialUpdateProdutoCadastrado): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(produtoCadastrado);
    return this.http
      .patch<RestProdutoCadastrado>(`${this.resourceUrl}/${this.getProdutoCadastradoIdentifier(produtoCadastrado)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProdutoCadastrado>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProdutoCadastrado[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProdutoCadastradoIdentifier(produtoCadastrado: Pick<IProdutoCadastrado, 'id'>): number {
    return produtoCadastrado.id;
  }

  compareProdutoCadastrado(o1: Pick<IProdutoCadastrado, 'id'> | null, o2: Pick<IProdutoCadastrado, 'id'> | null): boolean {
    return o1 && o2 ? this.getProdutoCadastradoIdentifier(o1) === this.getProdutoCadastradoIdentifier(o2) : o1 === o2;
  }

  addProdutoCadastradoToCollectionIfMissing<Type extends Pick<IProdutoCadastrado, 'id'>>(
    produtoCadastradoCollection: Type[],
    ...produtoCadastradosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const produtoCadastrados: Type[] = produtoCadastradosToCheck.filter(isPresent);
    if (produtoCadastrados.length > 0) {
      const produtoCadastradoCollectionIdentifiers = produtoCadastradoCollection.map(
        produtoCadastradoItem => this.getProdutoCadastradoIdentifier(produtoCadastradoItem)!
      );
      const produtoCadastradosToAdd = produtoCadastrados.filter(produtoCadastradoItem => {
        const produtoCadastradoIdentifier = this.getProdutoCadastradoIdentifier(produtoCadastradoItem);
        if (produtoCadastradoCollectionIdentifiers.includes(produtoCadastradoIdentifier)) {
          return false;
        }
        produtoCadastradoCollectionIdentifiers.push(produtoCadastradoIdentifier);
        return true;
      });
      return [...produtoCadastradosToAdd, ...produtoCadastradoCollection];
    }
    return produtoCadastradoCollection;
  }

  protected convertDateFromClient<T extends IProdutoCadastrado | NewProdutoCadastrado | PartialUpdateProdutoCadastrado>(
    produtoCadastrado: T
  ): RestOf<T> {
    return {
      ...produtoCadastrado,
      quando: produtoCadastrado.quando?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restProdutoCadastrado: RestProdutoCadastrado): IProdutoCadastrado {
    return {
      ...restProdutoCadastrado,
      quando: restProdutoCadastrado.quando ? dayjs(restProdutoCadastrado.quando) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProdutoCadastrado>): HttpResponse<IProdutoCadastrado> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProdutoCadastrado[]>): HttpResponse<IProdutoCadastrado[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
