import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProdutoFormService } from './produto-form.service';
import { ProdutoService } from '../service/produto.service';
import { IProduto } from '../produto.model';
import { IProdutoCadastrado } from 'app/entities/produto-cadastrado/produto-cadastrado.model';
import { ProdutoCadastradoService } from 'app/entities/produto-cadastrado/service/produto-cadastrado.service';

import { ProdutoUpdateComponent } from './produto-update.component';

describe('Produto Management Update Component', () => {
  let comp: ProdutoUpdateComponent;
  let fixture: ComponentFixture<ProdutoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let produtoFormService: ProdutoFormService;
  let produtoService: ProdutoService;
  let produtoCadastradoService: ProdutoCadastradoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProdutoUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ProdutoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProdutoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    produtoFormService = TestBed.inject(ProdutoFormService);
    produtoService = TestBed.inject(ProdutoService);
    produtoCadastradoService = TestBed.inject(ProdutoCadastradoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ProdutoCadastrado query and add missing value', () => {
      const produto: IProduto = { id: 456 };
      const produtoCadastrado: IProdutoCadastrado = { id: 55056 };
      produto.produtoCadastrado = produtoCadastrado;

      const produtoCadastradoCollection: IProdutoCadastrado[] = [{ id: 39657 }];
      jest.spyOn(produtoCadastradoService, 'query').mockReturnValue(of(new HttpResponse({ body: produtoCadastradoCollection })));
      const additionalProdutoCadastrados = [produtoCadastrado];
      const expectedCollection: IProdutoCadastrado[] = [...additionalProdutoCadastrados, ...produtoCadastradoCollection];
      jest.spyOn(produtoCadastradoService, 'addProdutoCadastradoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ produto });
      comp.ngOnInit();

      expect(produtoCadastradoService.query).toHaveBeenCalled();
      expect(produtoCadastradoService.addProdutoCadastradoToCollectionIfMissing).toHaveBeenCalledWith(
        produtoCadastradoCollection,
        ...additionalProdutoCadastrados.map(expect.objectContaining)
      );
      expect(comp.produtoCadastradosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const produto: IProduto = { id: 456 };
      const produtoCadastrado: IProdutoCadastrado = { id: 45660 };
      produto.produtoCadastrado = produtoCadastrado;

      activatedRoute.data = of({ produto });
      comp.ngOnInit();

      expect(comp.produtoCadastradosSharedCollection).toContain(produtoCadastrado);
      expect(comp.produto).toEqual(produto);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProduto>>();
      const produto = { id: 123 };
      jest.spyOn(produtoFormService, 'getProduto').mockReturnValue(produto);
      jest.spyOn(produtoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ produto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: produto }));
      saveSubject.complete();

      // THEN
      expect(produtoFormService.getProduto).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(produtoService.update).toHaveBeenCalledWith(expect.objectContaining(produto));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProduto>>();
      const produto = { id: 123 };
      jest.spyOn(produtoFormService, 'getProduto').mockReturnValue({ id: null });
      jest.spyOn(produtoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ produto: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: produto }));
      saveSubject.complete();

      // THEN
      expect(produtoFormService.getProduto).toHaveBeenCalled();
      expect(produtoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProduto>>();
      const produto = { id: 123 };
      jest.spyOn(produtoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ produto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(produtoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProdutoCadastrado', () => {
      it('Should forward to produtoCadastradoService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(produtoCadastradoService, 'compareProdutoCadastrado');
        comp.compareProdutoCadastrado(entity, entity2);
        expect(produtoCadastradoService.compareProdutoCadastrado).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
