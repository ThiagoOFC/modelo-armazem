import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ProdutoCadastradoFormService, ProdutoCadastradoFormGroup } from './produto-cadastrado-form.service';
import { IProdutoCadastrado } from '../produto-cadastrado.model';
import { ProdutoCadastradoService } from '../service/produto-cadastrado.service';

@Component({
  selector: 'jhi-produto-cadastrado-update',
  templateUrl: './produto-cadastrado-update.component.html',
})
export class ProdutoCadastradoUpdateComponent implements OnInit {
  isSaving = false;
  produtoCadastrado: IProdutoCadastrado | null = null;

  editForm: ProdutoCadastradoFormGroup = this.produtoCadastradoFormService.createProdutoCadastradoFormGroup();

  constructor(
    protected produtoCadastradoService: ProdutoCadastradoService,
    protected produtoCadastradoFormService: ProdutoCadastradoFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ produtoCadastrado }) => {
      this.produtoCadastrado = produtoCadastrado;
      if (produtoCadastrado) {
        this.updateForm(produtoCadastrado);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const produtoCadastrado = this.produtoCadastradoFormService.getProdutoCadastrado(this.editForm);
    if (produtoCadastrado.id !== null) {
      this.subscribeToSaveResponse(this.produtoCadastradoService.update(produtoCadastrado));
    } else {
      this.subscribeToSaveResponse(this.produtoCadastradoService.create(produtoCadastrado));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProdutoCadastrado>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(produtoCadastrado: IProdutoCadastrado): void {
    this.produtoCadastrado = produtoCadastrado;
    this.produtoCadastradoFormService.resetForm(this.editForm, produtoCadastrado);
  }
}
