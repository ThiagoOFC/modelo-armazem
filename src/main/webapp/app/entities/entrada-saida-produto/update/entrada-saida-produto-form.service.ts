import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEntradaSaidaProduto, NewEntradaSaidaProduto } from '../entrada-saida-produto.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEntradaSaidaProduto for edit and NewEntradaSaidaProdutoFormGroupInput for create.
 */
type EntradaSaidaProdutoFormGroupInput = IEntradaSaidaProduto | PartialWithRequiredKeyOf<NewEntradaSaidaProduto>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEntradaSaidaProduto | NewEntradaSaidaProduto> = Omit<T, 'quando'> & {
  quando?: string | null;
};

type EntradaSaidaProdutoFormRawValue = FormValueOf<IEntradaSaidaProduto>;

type NewEntradaSaidaProdutoFormRawValue = FormValueOf<NewEntradaSaidaProduto>;

type EntradaSaidaProdutoFormDefaults = Pick<NewEntradaSaidaProduto, 'id' | 'quando'>;

type EntradaSaidaProdutoFormGroupContent = {
  id: FormControl<EntradaSaidaProdutoFormRawValue['id'] | NewEntradaSaidaProduto['id']>;
  quando: FormControl<EntradaSaidaProdutoFormRawValue['quando']>;
  quantidade: FormControl<EntradaSaidaProdutoFormRawValue['quantidade']>;
  produtoCadastrado: FormControl<EntradaSaidaProdutoFormRawValue['produtoCadastrado']>;
};

export type EntradaSaidaProdutoFormGroup = FormGroup<EntradaSaidaProdutoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EntradaSaidaProdutoFormService {
  createEntradaSaidaProdutoFormGroup(entradaSaidaProduto: EntradaSaidaProdutoFormGroupInput = { id: null }): EntradaSaidaProdutoFormGroup {
    const entradaSaidaProdutoRawValue = this.convertEntradaSaidaProdutoToEntradaSaidaProdutoRawValue({
      ...this.getFormDefaults(),
      ...entradaSaidaProduto,
    });
    return new FormGroup<EntradaSaidaProdutoFormGroupContent>({
      id: new FormControl(
        { value: entradaSaidaProdutoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      quando: new FormControl(entradaSaidaProdutoRawValue.quando),
      quantidade: new FormControl(entradaSaidaProdutoRawValue.quantidade),
      produtoCadastrado: new FormControl(entradaSaidaProdutoRawValue.produtoCadastrado),
    });
  }

  getEntradaSaidaProduto(form: EntradaSaidaProdutoFormGroup): IEntradaSaidaProduto | NewEntradaSaidaProduto {
    return this.convertEntradaSaidaProdutoRawValueToEntradaSaidaProduto(
      form.getRawValue() as EntradaSaidaProdutoFormRawValue | NewEntradaSaidaProdutoFormRawValue
    );
  }

  resetForm(form: EntradaSaidaProdutoFormGroup, entradaSaidaProduto: EntradaSaidaProdutoFormGroupInput): void {
    const entradaSaidaProdutoRawValue = this.convertEntradaSaidaProdutoToEntradaSaidaProdutoRawValue({
      ...this.getFormDefaults(),
      ...entradaSaidaProduto,
    });
    form.reset(
      {
        ...entradaSaidaProdutoRawValue,
        id: { value: entradaSaidaProdutoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EntradaSaidaProdutoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      quando: currentTime,
    };
  }

  private convertEntradaSaidaProdutoRawValueToEntradaSaidaProduto(
    rawEntradaSaidaProduto: EntradaSaidaProdutoFormRawValue | NewEntradaSaidaProdutoFormRawValue
  ): IEntradaSaidaProduto | NewEntradaSaidaProduto {
    return {
      ...rawEntradaSaidaProduto,
      quando: dayjs(rawEntradaSaidaProduto.quando, DATE_TIME_FORMAT),
    };
  }

  private convertEntradaSaidaProdutoToEntradaSaidaProdutoRawValue(
    entradaSaidaProduto: IEntradaSaidaProduto | (Partial<NewEntradaSaidaProduto> & EntradaSaidaProdutoFormDefaults)
  ): EntradaSaidaProdutoFormRawValue | PartialWithRequiredKeyOf<NewEntradaSaidaProdutoFormRawValue> {
    return {
      ...entradaSaidaProduto,
      quando: entradaSaidaProduto.quando ? entradaSaidaProduto.quando.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
