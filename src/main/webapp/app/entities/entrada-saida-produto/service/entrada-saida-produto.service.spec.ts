import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEntradaSaidaProduto } from '../entrada-saida-produto.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../entrada-saida-produto.test-samples';

import { EntradaSaidaProdutoService, RestEntradaSaidaProduto } from './entrada-saida-produto.service';

const requireRestSample: RestEntradaSaidaProduto = {
  ...sampleWithRequiredData,
  quando: sampleWithRequiredData.quando?.toJSON(),
};

describe('EntradaSaidaProduto Service', () => {
  let service: EntradaSaidaProdutoService;
  let httpMock: HttpTestingController;
  let expectedResult: IEntradaSaidaProduto | IEntradaSaidaProduto[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EntradaSaidaProdutoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a EntradaSaidaProduto', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const entradaSaidaProduto = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(entradaSaidaProduto).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EntradaSaidaProduto', () => {
      const entradaSaidaProduto = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(entradaSaidaProduto).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EntradaSaidaProduto', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EntradaSaidaProduto', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EntradaSaidaProduto', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEntradaSaidaProdutoToCollectionIfMissing', () => {
      it('should add a EntradaSaidaProduto to an empty array', () => {
        const entradaSaidaProduto: IEntradaSaidaProduto = sampleWithRequiredData;
        expectedResult = service.addEntradaSaidaProdutoToCollectionIfMissing([], entradaSaidaProduto);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(entradaSaidaProduto);
      });

      it('should not add a EntradaSaidaProduto to an array that contains it', () => {
        const entradaSaidaProduto: IEntradaSaidaProduto = sampleWithRequiredData;
        const entradaSaidaProdutoCollection: IEntradaSaidaProduto[] = [
          {
            ...entradaSaidaProduto,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEntradaSaidaProdutoToCollectionIfMissing(entradaSaidaProdutoCollection, entradaSaidaProduto);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EntradaSaidaProduto to an array that doesn't contain it", () => {
        const entradaSaidaProduto: IEntradaSaidaProduto = sampleWithRequiredData;
        const entradaSaidaProdutoCollection: IEntradaSaidaProduto[] = [sampleWithPartialData];
        expectedResult = service.addEntradaSaidaProdutoToCollectionIfMissing(entradaSaidaProdutoCollection, entradaSaidaProduto);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(entradaSaidaProduto);
      });

      it('should add only unique EntradaSaidaProduto to an array', () => {
        const entradaSaidaProdutoArray: IEntradaSaidaProduto[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const entradaSaidaProdutoCollection: IEntradaSaidaProduto[] = [sampleWithRequiredData];
        expectedResult = service.addEntradaSaidaProdutoToCollectionIfMissing(entradaSaidaProdutoCollection, ...entradaSaidaProdutoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const entradaSaidaProduto: IEntradaSaidaProduto = sampleWithRequiredData;
        const entradaSaidaProduto2: IEntradaSaidaProduto = sampleWithPartialData;
        expectedResult = service.addEntradaSaidaProdutoToCollectionIfMissing([], entradaSaidaProduto, entradaSaidaProduto2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(entradaSaidaProduto);
        expect(expectedResult).toContain(entradaSaidaProduto2);
      });

      it('should accept null and undefined values', () => {
        const entradaSaidaProduto: IEntradaSaidaProduto = sampleWithRequiredData;
        expectedResult = service.addEntradaSaidaProdutoToCollectionIfMissing([], null, entradaSaidaProduto, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(entradaSaidaProduto);
      });

      it('should return initial array if no EntradaSaidaProduto is added', () => {
        const entradaSaidaProdutoCollection: IEntradaSaidaProduto[] = [sampleWithRequiredData];
        expectedResult = service.addEntradaSaidaProdutoToCollectionIfMissing(entradaSaidaProdutoCollection, undefined, null);
        expect(expectedResult).toEqual(entradaSaidaProdutoCollection);
      });
    });

    describe('compareEntradaSaidaProduto', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEntradaSaidaProduto(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEntradaSaidaProduto(entity1, entity2);
        const compareResult2 = service.compareEntradaSaidaProduto(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEntradaSaidaProduto(entity1, entity2);
        const compareResult2 = service.compareEntradaSaidaProduto(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEntradaSaidaProduto(entity1, entity2);
        const compareResult2 = service.compareEntradaSaidaProduto(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
