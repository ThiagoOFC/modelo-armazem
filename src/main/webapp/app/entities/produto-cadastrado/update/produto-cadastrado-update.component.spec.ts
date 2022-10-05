import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProdutoCadastradoFormService } from './produto-cadastrado-form.service';
import { ProdutoCadastradoService } from '../service/produto-cadastrado.service';
import { IProdutoCadastrado } from '../produto-cadastrado.model';

import { ProdutoCadastradoUpdateComponent } from './produto-cadastrado-update.component';

describe('ProdutoCadastrado Management Update Component', () => {
  let comp: ProdutoCadastradoUpdateComponent;
  let fixture: ComponentFixture<ProdutoCadastradoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let produtoCadastradoFormService: ProdutoCadastradoFormService;
  let produtoCadastradoService: ProdutoCadastradoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProdutoCadastradoUpdateComponent],
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
      .overrideTemplate(ProdutoCadastradoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProdutoCadastradoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    produtoCadastradoFormService = TestBed.inject(ProdutoCadastradoFormService);
    produtoCadastradoService = TestBed.inject(ProdutoCadastradoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const produtoCadastrado: IProdutoCadastrado = { id: 456 };

      activatedRoute.data = of({ produtoCadastrado });
      comp.ngOnInit();

      expect(comp.produtoCadastrado).toEqual(produtoCadastrado);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProdutoCadastrado>>();
      const produtoCadastrado = { id: 123 };
      jest.spyOn(produtoCadastradoFormService, 'getProdutoCadastrado').mockReturnValue(produtoCadastrado);
      jest.spyOn(produtoCadastradoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ produtoCadastrado });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: produtoCadastrado }));
      saveSubject.complete();

      // THEN
      expect(produtoCadastradoFormService.getProdutoCadastrado).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(produtoCadastradoService.update).toHaveBeenCalledWith(expect.objectContaining(produtoCadastrado));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProdutoCadastrado>>();
      const produtoCadastrado = { id: 123 };
      jest.spyOn(produtoCadastradoFormService, 'getProdutoCadastrado').mockReturnValue({ id: null });
      jest.spyOn(produtoCadastradoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ produtoCadastrado: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: produtoCadastrado }));
      saveSubject.complete();

      // THEN
      expect(produtoCadastradoFormService.getProdutoCadastrado).toHaveBeenCalled();
      expect(produtoCadastradoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProdutoCadastrado>>();
      const produtoCadastrado = { id: 123 };
      jest.spyOn(produtoCadastradoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ produtoCadastrado });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(produtoCadastradoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
