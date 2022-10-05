import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IArmazenamento, NewArmazenamento } from '../armazenamento.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IArmazenamento for edit and NewArmazenamentoFormGroupInput for create.
 */
type ArmazenamentoFormGroupInput = IArmazenamento | PartialWithRequiredKeyOf<NewArmazenamento>;

type ArmazenamentoFormDefaults = Pick<NewArmazenamento, 'id'>;

type ArmazenamentoFormGroupContent = {
  id: FormControl<IArmazenamento['id'] | NewArmazenamento['id']>;
  local: FormControl<IArmazenamento['local']>;
  tipoDeArmazenamento: FormControl<IArmazenamento['tipoDeArmazenamento']>;
  endereco: FormControl<IArmazenamento['endereco']>;
  produtoCadastrado: FormControl<IArmazenamento['produtoCadastrado']>;
};

export type ArmazenamentoFormGroup = FormGroup<ArmazenamentoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ArmazenamentoFormService {
  createArmazenamentoFormGroup(armazenamento: ArmazenamentoFormGroupInput = { id: null }): ArmazenamentoFormGroup {
    const armazenamentoRawValue = {
      ...this.getFormDefaults(),
      ...armazenamento,
    };
    return new FormGroup<ArmazenamentoFormGroupContent>({
      id: new FormControl(
        { value: armazenamentoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      local: new FormControl(armazenamentoRawValue.local),
      tipoDeArmazenamento: new FormControl(armazenamentoRawValue.tipoDeArmazenamento),
      endereco: new FormControl(armazenamentoRawValue.endereco),
      produtoCadastrado: new FormControl(armazenamentoRawValue.produtoCadastrado),
    });
  }

  getArmazenamento(form: ArmazenamentoFormGroup): IArmazenamento | NewArmazenamento {
    return form.getRawValue() as IArmazenamento | NewArmazenamento;
  }

  resetForm(form: ArmazenamentoFormGroup, armazenamento: ArmazenamentoFormGroupInput): void {
    const armazenamentoRawValue = { ...this.getFormDefaults(), ...armazenamento };
    form.reset(
      {
        ...armazenamentoRawValue,
        id: { value: armazenamentoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ArmazenamentoFormDefaults {
    return {
      id: null,
    };
  }
}
