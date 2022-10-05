import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../entrada-saida-produto.test-samples';

import { EntradaSaidaProdutoFormService } from './entrada-saida-produto-form.service';

describe('EntradaSaidaProduto Form Service', () => {
  let service: EntradaSaidaProdutoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntradaSaidaProdutoFormService);
  });

  describe('Service methods', () => {
    describe('createEntradaSaidaProdutoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEntradaSaidaProdutoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quando: expect.any(Object),
            quantidade: expect.any(Object),
            produtoCadastrado: expect.any(Object),
          })
        );
      });

      it('passing IEntradaSaidaProduto should create a new form with FormGroup', () => {
        const formGroup = service.createEntradaSaidaProdutoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quando: expect.any(Object),
            quantidade: expect.any(Object),
            produtoCadastrado: expect.any(Object),
          })
        );
      });
    });

    describe('getEntradaSaidaProduto', () => {
      it('should return NewEntradaSaidaProduto for default EntradaSaidaProduto initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEntradaSaidaProdutoFormGroup(sampleWithNewData);

        const entradaSaidaProduto = service.getEntradaSaidaProduto(formGroup) as any;

        expect(entradaSaidaProduto).toMatchObject(sampleWithNewData);
      });

      it('should return NewEntradaSaidaProduto for empty EntradaSaidaProduto initial value', () => {
        const formGroup = service.createEntradaSaidaProdutoFormGroup();

        const entradaSaidaProduto = service.getEntradaSaidaProduto(formGroup) as any;

        expect(entradaSaidaProduto).toMatchObject({});
      });

      it('should return IEntradaSaidaProduto', () => {
        const formGroup = service.createEntradaSaidaProdutoFormGroup(sampleWithRequiredData);

        const entradaSaidaProduto = service.getEntradaSaidaProduto(formGroup) as any;

        expect(entradaSaidaProduto).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEntradaSaidaProduto should not enable id FormControl', () => {
        const formGroup = service.createEntradaSaidaProdutoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEntradaSaidaProduto should disable id FormControl', () => {
        const formGroup = service.createEntradaSaidaProdutoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
