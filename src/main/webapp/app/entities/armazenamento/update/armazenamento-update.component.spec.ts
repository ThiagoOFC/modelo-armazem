import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ArmazenamentoFormService } from './armazenamento-form.service';
import { ArmazenamentoService } from '../service/armazenamento.service';
import { IArmazenamento } from '../armazenamento.model';
import { IProdutoCadastrado } from 'app/entities/produto-cadastrado/produto-cadastrado.model';
import { ProdutoCadastradoService } from 'app/entities/produto-cadastrado/service/produto-cadastrado.service';

import { ArmazenamentoUpdateComponent } from './armazenamento-update.component';

describe('Armazenamento Management Update Component', () => {
  let comp: ArmazenamentoUpdateComponent;
  let fixture: ComponentFixture<ArmazenamentoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let armazenamentoFormService: ArmazenamentoFormService;
  let armazenamentoService: ArmazenamentoService;
  let produtoCadastradoService: ProdutoCadastradoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ArmazenamentoUpdateComponent],
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
      .overrideTemplate(ArmazenamentoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ArmazenamentoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    armazenamentoFormService = TestBed.inject(ArmazenamentoFormService);
    armazenamentoService = TestBed.inject(ArmazenamentoService);
    produtoCadastradoService = TestBed.inject(ProdutoCadastradoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ProdutoCadastrado query and add missing value', () => {
      const armazenamento: IArmazenamento = { id: 456 };
      const produtoCadastrado: IProdutoCadastrado = { id: 86511 };
      armazenamento.produtoCadastrado = produtoCadastrado;

      const produtoCadastradoCollection: IProdutoCadastrado[] = [{ id: 68977 }];
      jest.spyOn(produtoCadastradoService, 'query').mockReturnValue(of(new HttpResponse({ body: produtoCadastradoCollection })));
      const additionalProdutoCadastrados = [produtoCadastrado];
      const expectedCollection: IProdutoCadastrado[] = [...additionalProdutoCadastrados, ...produtoCadastradoCollection];
      jest.spyOn(produtoCadastradoService, 'addProdutoCadastradoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ armazenamento });
      comp.ngOnInit();

      expect(produtoCadastradoService.query).toHaveBeenCalled();
      expect(produtoCadastradoService.addProdutoCadastradoToCollectionIfMissing).toHaveBeenCalledWith(
        produtoCadastradoCollection,
        ...additionalProdutoCadastrados.map(expect.objectContaining)
      );
      expect(comp.produtoCadastradosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const armazenamento: IArmazenamento = { id: 456 };
      const produtoCadastrado: IProdutoCadastrado = { id: 53730 };
      armazenamento.produtoCadastrado = produtoCadastrado;

      activatedRoute.data = of({ armazenamento });
      comp.ngOnInit();

      expect(comp.produtoCadastradosSharedCollection).toContain(produtoCadastrado);
      expect(comp.armazenamento).toEqual(armazenamento);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IArmazenamento>>();
      const armazenamento = { id: 123 };
      jest.spyOn(armazenamentoFormService, 'getArmazenamento').mockReturnValue(armazenamento);
      jest.spyOn(armazenamentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ armazenamento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: armazenamento }));
      saveSubject.complete();

      // THEN
      expect(armazenamentoFormService.getArmazenamento).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(armazenamentoService.update).toHaveBeenCalledWith(expect.objectContaining(armazenamento));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IArmazenamento>>();
      const armazenamento = { id: 123 };
      jest.spyOn(armazenamentoFormService, 'getArmazenamento').mockReturnValue({ id: null });
      jest.spyOn(armazenamentoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ armazenamento: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: armazenamento }));
      saveSubject.complete();

      // THEN
      expect(armazenamentoFormService.getArmazenamento).toHaveBeenCalled();
      expect(armazenamentoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IArmazenamento>>();
      const armazenamento = { id: 123 };
      jest.spyOn(armazenamentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ armazenamento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(armazenamentoService.update).toHaveBeenCalled();
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
