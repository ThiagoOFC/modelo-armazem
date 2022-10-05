import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../produto-cadastrado.test-samples';

import { ProdutoCadastradoFormService } from './produto-cadastrado-form.service';

describe('ProdutoCadastrado Form Service', () => {
  let service: ProdutoCadastradoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdutoCadastradoFormService);
  });

  describe('Service methods', () => {
    describe('createProdutoCadastradoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProdutoCadastradoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quando: expect.any(Object),
            localArmazenado: expect.any(Object),
          })
        );
      });

      it('passing IProdutoCadastrado should create a new form with FormGroup', () => {
        const formGroup = service.createProdutoCadastradoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quando: expect.any(Object),
            localArmazenado: expect.any(Object),
          })
        );
      });
    });

    describe('getProdutoCadastrado', () => {
      it('should return NewProdutoCadastrado for default ProdutoCadastrado initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createProdutoCadastradoFormGroup(sampleWithNewData);

        const produtoCadastrado = service.getProdutoCadastrado(formGroup) as any;

        expect(produtoCadastrado).toMatchObject(sampleWithNewData);
      });

      it('should return NewProdutoCadastrado for empty ProdutoCadastrado initial value', () => {
        const formGroup = service.createProdutoCadastradoFormGroup();

        const produtoCadastrado = service.getProdutoCadastrado(formGroup) as any;

        expect(produtoCadastrado).toMatchObject({});
      });

      it('should return IProdutoCadastrado', () => {
        const formGroup = service.createProdutoCadastradoFormGroup(sampleWithRequiredData);

        const produtoCadastrado = service.getProdutoCadastrado(formGroup) as any;

        expect(produtoCadastrado).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProdutoCadastrado should not enable id FormControl', () => {
        const formGroup = service.createProdutoCadastradoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProdutoCadastrado should disable id FormControl', () => {
        const formGroup = service.createProdutoCadastradoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
