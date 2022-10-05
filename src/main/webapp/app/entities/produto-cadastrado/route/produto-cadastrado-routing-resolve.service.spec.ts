import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IProdutoCadastrado } from '../produto-cadastrado.model';
import { ProdutoCadastradoService } from '../service/produto-cadastrado.service';

import { ProdutoCadastradoRoutingResolveService } from './produto-cadastrado-routing-resolve.service';

describe('ProdutoCadastrado routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ProdutoCadastradoRoutingResolveService;
  let service: ProdutoCadastradoService;
  let resultProdutoCadastrado: IProdutoCadastrado | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(ProdutoCadastradoRoutingResolveService);
    service = TestBed.inject(ProdutoCadastradoService);
    resultProdutoCadastrado = undefined;
  });

  describe('resolve', () => {
    it('should return IProdutoCadastrado returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProdutoCadastrado = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultProdutoCadastrado).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProdutoCadastrado = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultProdutoCadastrado).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IProdutoCadastrado>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProdutoCadastrado = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultProdutoCadastrado).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
