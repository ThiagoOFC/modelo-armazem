import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../armazenamento.test-samples';

import { ArmazenamentoFormService } from './armazenamento-form.service';

describe('Armazenamento Form Service', () => {
  let service: ArmazenamentoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArmazenamentoFormService);
  });

  describe('Service methods', () => {
    describe('createArmazenamentoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createArmazenamentoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            local: expect.any(Object),
            tipoDeArmazenamento: expect.any(Object),
            endereco: expect.any(Object),
            produtoCadastrado: expect.any(Object),
          })
        );
      });

      it('passing IArmazenamento should create a new form with FormGroup', () => {
        const formGroup = service.createArmazenamentoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            local: expect.any(Object),
            tipoDeArmazenamento: expect.any(Object),
            endereco: expect.any(Object),
            produtoCadastrado: expect.any(Object),
          })
        );
      });
    });

    describe('getArmazenamento', () => {
      it('should return NewArmazenamento for default Armazenamento initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createArmazenamentoFormGroup(sampleWithNewData);

        const armazenamento = service.getArmazenamento(formGroup) as any;

        expect(armazenamento).toMatchObject(sampleWithNewData);
      });

      it('should return NewArmazenamento for empty Armazenamento initial value', () => {
        const formGroup = service.createArmazenamentoFormGroup();

        const armazenamento = service.getArmazenamento(formGroup) as any;

        expect(armazenamento).toMatchObject({});
      });

      it('should return IArmazenamento', () => {
        const formGroup = service.createArmazenamentoFormGroup(sampleWithRequiredData);

        const armazenamento = service.getArmazenamento(formGroup) as any;

        expect(armazenamento).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IArmazenamento should not enable id FormControl', () => {
        const formGroup = service.createArmazenamentoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewArmazenamento should disable id FormControl', () => {
        const formGroup = service.createArmazenamentoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
