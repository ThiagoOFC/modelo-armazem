import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IEntradaSaidaProduto } from '../entrada-saida-produto.model';
import { EntradaSaidaProdutoService } from '../service/entrada-saida-produto.service';

import { EntradaSaidaProdutoRoutingResolveService } from './entrada-saida-produto-routing-resolve.service';

describe('EntradaSaidaProduto routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: EntradaSaidaProdutoRoutingResolveService;
  let service: EntradaSaidaProdutoService;
  let resultEntradaSaidaProduto: IEntradaSaidaProduto | null | undefined;

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
    routingResolveService = TestBed.inject(EntradaSaidaProdutoRoutingResolveService);
    service = TestBed.inject(EntradaSaidaProdutoService);
    resultEntradaSaidaProduto = undefined;
  });

  describe('resolve', () => {
    it('should return IEntradaSaidaProduto returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEntradaSaidaProduto = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEntradaSaidaProduto).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEntradaSaidaProduto = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEntradaSaidaProduto).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IEntradaSaidaProduto>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEntradaSaidaProduto = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEntradaSaidaProduto).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
