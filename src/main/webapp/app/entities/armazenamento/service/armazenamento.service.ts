import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IArmazenamento, NewArmazenamento } from '../armazenamento.model';

export type PartialUpdateArmazenamento = Partial<IArmazenamento> & Pick<IArmazenamento, 'id'>;

export type EntityResponseType = HttpResponse<IArmazenamento>;
export type EntityArrayResponseType = HttpResponse<IArmazenamento[]>;

@Injectable({ providedIn: 'root' })
export class ArmazenamentoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/armazenamentos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(armazenamento: NewArmazenamento): Observable<EntityResponseType> {
    return this.http.post<IArmazenamento>(this.resourceUrl, armazenamento, { observe: 'response' });
  }

  update(armazenamento: IArmazenamento): Observable<EntityResponseType> {
    return this.http.put<IArmazenamento>(`${this.resourceUrl}/${this.getArmazenamentoIdentifier(armazenamento)}`, armazenamento, {
      observe: 'response',
    });
  }

  partialUpdate(armazenamento: PartialUpdateArmazenamento): Observable<EntityResponseType> {
    return this.http.patch<IArmazenamento>(`${this.resourceUrl}/${this.getArmazenamentoIdentifier(armazenamento)}`, armazenamento, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IArmazenamento>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IArmazenamento[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getArmazenamentoIdentifier(armazenamento: Pick<IArmazenamento, 'id'>): number {
    return armazenamento.id;
  }

  compareArmazenamento(o1: Pick<IArmazenamento, 'id'> | null, o2: Pick<IArmazenamento, 'id'> | null): boolean {
    return o1 && o2 ? this.getArmazenamentoIdentifier(o1) === this.getArmazenamentoIdentifier(o2) : o1 === o2;
  }

  addArmazenamentoToCollectionIfMissing<Type extends Pick<IArmazenamento, 'id'>>(
    armazenamentoCollection: Type[],
    ...armazenamentosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const armazenamentos: Type[] = armazenamentosToCheck.filter(isPresent);
    if (armazenamentos.length > 0) {
      const armazenamentoCollectionIdentifiers = armazenamentoCollection.map(
        armazenamentoItem => this.getArmazenamentoIdentifier(armazenamentoItem)!
      );
      const armazenamentosToAdd = armazenamentos.filter(armazenamentoItem => {
        const armazenamentoIdentifier = this.getArmazenamentoIdentifier(armazenamentoItem);
        if (armazenamentoCollectionIdentifiers.includes(armazenamentoIdentifier)) {
          return false;
        }
        armazenamentoCollectionIdentifiers.push(armazenamentoIdentifier);
        return true;
      });
      return [...armazenamentosToAdd, ...armazenamentoCollection];
    }
    return armazenamentoCollection;
  }
}
