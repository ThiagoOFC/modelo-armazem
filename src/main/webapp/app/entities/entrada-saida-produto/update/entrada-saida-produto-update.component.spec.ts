import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EntradaSaidaProdutoFormService } from './entrada-saida-produto-form.service';
import { EntradaSaidaProdutoService } from '../service/entrada-saida-produto.service';
import { IEntradaSaidaProduto } from '../entrada-saida-produto.model';
import { IProdutoCadastrado } from 'app/entities/produto-cadastrado/produto-cadastrado.model';
import { ProdutoCadastradoService } from 'app/entities/produto-cadastrado/service/produto-cadastrado.service';

import { EntradaSaidaProdutoUpdateComponent } from './entrada-saida-produto-update.component';

describe('EntradaSaidaProduto Management Update Component', () => {
  let comp: EntradaSaidaProdutoUpdateComponent;
  let fixture: ComponentFixture<EntradaSaidaProdutoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let entradaSaidaProdutoFormService: EntradaSaidaProdutoFormService;
  let entradaSaidaProdutoService: EntradaSaidaProdutoService;
  let produtoCadastradoService: ProdutoCadastradoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EntradaSaidaProdutoUpdateComponent],
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
      .overrideTemplate(EntradaSaidaProdutoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EntradaSaidaProdutoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    entradaSaidaProdutoFormService = TestBed.inject(EntradaSaidaProdutoFormService);
    entradaSaidaProdutoService = TestBed.inject(EntradaSaidaProdutoService);
    produtoCadastradoService = TestBed.inject(ProdutoCadastradoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ProdutoCadastrado query and add missing value', () => {
      const entradaSaidaProduto: IEntradaSaidaProduto = { id: 456 };
      const produtoCadastrado: IProdutoCadastrado = { id: 93853 };
      entradaSaidaProduto.produtoCadastrado = produtoCadastrado;

      const produtoCadastradoCollection: IProdutoCadastrado[] = [{ id: 28990 }];
      jest.spyOn(produtoCadastradoService, 'query').mockReturnValue(of(new HttpResponse({ body: produtoCadastradoCollection })));
      const additionalProdutoCadastrados = [produtoCadastrado];
      const expectedCollection: IProdutoCadastrado[] = [...additionalProdutoCadastrados, ...produtoCadastradoCollection];
      jest.spyOn(produtoCadastradoService, 'addProdutoCadastradoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ entradaSaidaProduto });
      comp.ngOnInit();

      expect(produtoCadastradoService.query).toHaveBeenCalled();
      expect(produtoCadastradoService.addProdutoCadastradoToCollectionIfMissing).toHaveBeenCalledWith(
        produtoCadastradoCollection,
        ...additionalProdutoCadastrados.map(expect.objectContaining)
      );
      expect(comp.produtoCadastradosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const entradaSaidaProduto: IEntradaSaidaProduto = { id: 456 };
      const produtoCadastrado: IProdutoCadastrado = { id: 95012 };
      entradaSaidaProduto.produtoCadastrado = produtoCadastrado;

      activatedRoute.data = of({ entradaSaidaProduto });
      comp.ngOnInit();

      expect(comp.produtoCadastradosSharedCollection).toContain(produtoCadastrado);
      expect(comp.entradaSaidaProduto).toEqual(entradaSaidaProduto);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEntradaSaidaProduto>>();
      const entradaSaidaProduto = { id: 123 };
      jest.spyOn(entradaSaidaProdutoFormService, 'getEntradaSaidaProduto').mockReturnValue(entradaSaidaProduto);
      jest.spyOn(entradaSaidaProdutoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entradaSaidaProduto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: entradaSaidaProduto }));
      saveSubject.complete();

      // THEN
      expect(entradaSaidaProdutoFormService.getEntradaSaidaProduto).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(entradaSaidaProdutoService.update).toHaveBeenCalledWith(expect.objectContaining(entradaSaidaProduto));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEntradaSaidaProduto>>();
      const entradaSaidaProduto = { id: 123 };
      jest.spyOn(entradaSaidaProdutoFormService, 'getEntradaSaidaProduto').mockReturnValue({ id: null });
      jest.spyOn(entradaSaidaProdutoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entradaSaidaProduto: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: entradaSaidaProduto }));
      saveSubject.complete();

      // THEN
      expect(entradaSaidaProdutoFormService.getEntradaSaidaProduto).toHaveBeenCalled();
      expect(entradaSaidaProdutoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEntradaSaidaProduto>>();
      const entradaSaidaProduto = { id: 123 };
      jest.spyOn(entradaSaidaProdutoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entradaSaidaProduto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(entradaSaidaProdutoService.update).toHaveBeenCalled();
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
