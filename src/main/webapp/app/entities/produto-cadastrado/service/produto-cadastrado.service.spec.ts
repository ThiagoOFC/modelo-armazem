import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProdutoCadastrado } from '../produto-cadastrado.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../produto-cadastrado.test-samples';

import { ProdutoCadastradoService, RestProdutoCadastrado } from './produto-cadastrado.service';

const requireRestSample: RestProdutoCadastrado = {
  ...sampleWithRequiredData,
  quando: sampleWithRequiredData.quando?.toJSON(),
};

describe('ProdutoCadastrado Service', () => {
  let service: ProdutoCadastradoService;
  let httpMock: HttpTestingController;
  let expectedResult: IProdutoCadastrado | IProdutoCadastrado[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProdutoCadastradoService);
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

    it('should create a ProdutoCadastrado', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const produtoCadastrado = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(produtoCadastrado).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProdutoCadastrado', () => {
      const produtoCadastrado = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(produtoCadastrado).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProdutoCadastrado', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProdutoCadastrado', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProdutoCadastrado', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProdutoCadastradoToCollectionIfMissing', () => {
      it('should add a ProdutoCadastrado to an empty array', () => {
        const produtoCadastrado: IProdutoCadastrado = sampleWithRequiredData;
        expectedResult = service.addProdutoCadastradoToCollectionIfMissing([], produtoCadastrado);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(produtoCadastrado);
      });

      it('should not add a ProdutoCadastrado to an array that contains it', () => {
        const produtoCadastrado: IProdutoCadastrado = sampleWithRequiredData;
        const produtoCadastradoCollection: IProdutoCadastrado[] = [
          {
            ...produtoCadastrado,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProdutoCadastradoToCollectionIfMissing(produtoCadastradoCollection, produtoCadastrado);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProdutoCadastrado to an array that doesn't contain it", () => {
        const produtoCadastrado: IProdutoCadastrado = sampleWithRequiredData;
        const produtoCadastradoCollection: IProdutoCadastrado[] = [sampleWithPartialData];
        expectedResult = service.addProdutoCadastradoToCollectionIfMissing(produtoCadastradoCollection, produtoCadastrado);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(produtoCadastrado);
      });

      it('should add only unique ProdutoCadastrado to an array', () => {
        const produtoCadastradoArray: IProdutoCadastrado[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const produtoCadastradoCollection: IProdutoCadastrado[] = [sampleWithRequiredData];
        expectedResult = service.addProdutoCadastradoToCollectionIfMissing(produtoCadastradoCollection, ...produtoCadastradoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const produtoCadastrado: IProdutoCadastrado = sampleWithRequiredData;
        const produtoCadastrado2: IProdutoCadastrado = sampleWithPartialData;
        expectedResult = service.addProdutoCadastradoToCollectionIfMissing([], produtoCadastrado, produtoCadastrado2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(produtoCadastrado);
        expect(expectedResult).toContain(produtoCadastrado2);
      });

      it('should accept null and undefined values', () => {
        const produtoCadastrado: IProdutoCadastrado = sampleWithRequiredData;
        expectedResult = service.addProdutoCadastradoToCollectionIfMissing([], null, produtoCadastrado, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(produtoCadastrado);
      });

      it('should return initial array if no ProdutoCadastrado is added', () => {
        const produtoCadastradoCollection: IProdutoCadastrado[] = [sampleWithRequiredData];
        expectedResult = service.addProdutoCadastradoToCollectionIfMissing(produtoCadastradoCollection, undefined, null);
        expect(expectedResult).toEqual(produtoCadastradoCollection);
      });
    });

    describe('compareProdutoCadastrado', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProdutoCadastrado(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProdutoCadastrado(entity1, entity2);
        const compareResult2 = service.compareProdutoCadastrado(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProdutoCadastrado(entity1, entity2);
        const compareResult2 = service.compareProdutoCadastrado(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProdutoCadastrado(entity1, entity2);
        const compareResult2 = service.compareProdutoCadastrado(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
