import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IProdutoCadastrado, NewProdutoCadastrado } from '../produto-cadastrado.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProdutoCadastrado for edit and NewProdutoCadastradoFormGroupInput for create.
 */
type ProdutoCadastradoFormGroupInput = IProdutoCadastrado | PartialWithRequiredKeyOf<NewProdutoCadastrado>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IProdutoCadastrado | NewProdutoCadastrado> = Omit<T, 'quando'> & {
  quando?: string | null;
};

type ProdutoCadastradoFormRawValue = FormValueOf<IProdutoCadastrado>;

type NewProdutoCadastradoFormRawValue = FormValueOf<NewProdutoCadastrado>;

type ProdutoCadastradoFormDefaults = Pick<NewProdutoCadastrado, 'id' | 'quando'>;

type ProdutoCadastradoFormGroupContent = {
  id: FormControl<ProdutoCadastradoFormRawValue['id'] | NewProdutoCadastrado['id']>;
  quando: FormControl<ProdutoCadastradoFormRawValue['quando']>;
  localArmazenado: FormControl<ProdutoCadastradoFormRawValue['localArmazenado']>;
};

export type ProdutoCadastradoFormGroup = FormGroup<ProdutoCadastradoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProdutoCadastradoFormService {
  createProdutoCadastradoFormGroup(produtoCadastrado: ProdutoCadastradoFormGroupInput = { id: null }): ProdutoCadastradoFormGroup {
    const produtoCadastradoRawValue = this.convertProdutoCadastradoToProdutoCadastradoRawValue({
      ...this.getFormDefaults(),
      ...produtoCadastrado,
    });
    return new FormGroup<ProdutoCadastradoFormGroupContent>({
      id: new FormControl(
        { value: produtoCadastradoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      quando: new FormControl(produtoCadastradoRawValue.quando),
      localArmazenado: new FormControl(produtoCadastradoRawValue.localArmazenado),
    });
  }

  getProdutoCadastrado(form: ProdutoCadastradoFormGroup): IProdutoCadastrado | NewProdutoCadastrado {
    return this.convertProdutoCadastradoRawValueToProdutoCadastrado(
      form.getRawValue() as ProdutoCadastradoFormRawValue | NewProdutoCadastradoFormRawValue
    );
  }

  resetForm(form: ProdutoCadastradoFormGroup, produtoCadastrado: ProdutoCadastradoFormGroupInput): void {
    const produtoCadastradoRawValue = this.convertProdutoCadastradoToProdutoCadastradoRawValue({
      ...this.getFormDefaults(),
      ...produtoCadastrado,
    });
    form.reset(
      {
        ...produtoCadastradoRawValue,
        id: { value: produtoCadastradoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ProdutoCadastradoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      quando: currentTime,
    };
  }

  private convertProdutoCadastradoRawValueToProdutoCadastrado(
    rawProdutoCadastrado: ProdutoCadastradoFormRawValue | NewProdutoCadastradoFormRawValue
  ): IProdutoCadastrado | NewProdutoCadastrado {
    return {
      ...rawProdutoCadastrado,
      quando: dayjs(rawProdutoCadastrado.quando, DATE_TIME_FORMAT),
    };
  }

  private convertProdutoCadastradoToProdutoCadastradoRawValue(
    produtoCadastrado: IProdutoCadastrado | (Partial<NewProdutoCadastrado> & ProdutoCadastradoFormDefaults)
  ): ProdutoCadastradoFormRawValue | PartialWithRequiredKeyOf<NewProdutoCadastradoFormRawValue> {
    return {
      ...produtoCadastrado,
      quando: produtoCadastrado.quando ? produtoCadastrado.quando.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
