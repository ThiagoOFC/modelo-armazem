import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IArmazenamento } from '../armazenamento.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../armazenamento.test-samples';

import { ArmazenamentoService } from './armazenamento.service';

const requireRestSample: IArmazenamento = {
  ...sampleWithRequiredData,
};

describe('Armazenamento Service', () => {
  let service: ArmazenamentoService;
  let httpMock: HttpTestingController;
  let expectedResult: IArmazenamento | IArmazenamento[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ArmazenamentoService);
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

    it('should create a Armazenamento', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const armazenamento = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(armazenamento).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Armazenamento', () => {
      const armazenamento = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(armazenamento).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Armazenamento', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Armazenamento', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Armazenamento', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addArmazenamentoToCollectionIfMissing', () => {
      it('should add a Armazenamento to an empty array', () => {
        const armazenamento: IArmazenamento = sampleWithRequiredData;
        expectedResult = service.addArmazenamentoToCollectionIfMissing([], armazenamento);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(armazenamento);
      });

      it('should not add a Armazenamento to an array that contains it', () => {
        const armazenamento: IArmazenamento = sampleWithRequiredData;
        const armazenamentoCollection: IArmazenamento[] = [
          {
            ...armazenamento,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addArmazenamentoToCollectionIfMissing(armazenamentoCollection, armazenamento);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Armazenamento to an array that doesn't contain it", () => {
        const armazenamento: IArmazenamento = sampleWithRequiredData;
        const armazenamentoCollection: IArmazenamento[] = [sampleWithPartialData];
        expectedResult = service.addArmazenamentoToCollectionIfMissing(armazenamentoCollection, armazenamento);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(armazenamento);
      });

      it('should add only unique Armazenamento to an array', () => {
        const armazenamentoArray: IArmazenamento[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const armazenamentoCollection: IArmazenamento[] = [sampleWithRequiredData];
        expectedResult = service.addArmazenamentoToCollectionIfMissing(armazenamentoCollection, ...armazenamentoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const armazenamento: IArmazenamento = sampleWithRequiredData;
        const armazenamento2: IArmazenamento = sampleWithPartialData;
        expectedResult = service.addArmazenamentoToCollectionIfMissing([], armazenamento, armazenamento2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(armazenamento);
        expect(expectedResult).toContain(armazenamento2);
      });

      it('should accept null and undefined values', () => {
        const armazenamento: IArmazenamento = sampleWithRequiredData;
        expectedResult = service.addArmazenamentoToCollectionIfMissing([], null, armazenamento, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(armazenamento);
      });

      it('should return initial array if no Armazenamento is added', () => {
        const armazenamentoCollection: IArmazenamento[] = [sampleWithRequiredData];
        expectedResult = service.addArmazenamentoToCollectionIfMissing(armazenamentoCollection, undefined, null);
        expect(expectedResult).toEqual(armazenamentoCollection);
      });
    });

    describe('compareArmazenamento', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareArmazenamento(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareArmazenamento(entity1, entity2);
        const compareResult2 = service.compareArmazenamento(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareArmazenamento(entity1, entity2);
        const compareResult2 = service.compareArmazenamento(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareArmazenamento(entity1, entity2);
        const compareResult2 = service.compareArmazenamento(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
