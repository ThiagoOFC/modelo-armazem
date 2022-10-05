import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EntradaSaidaProdutoFormService, EntradaSaidaProdutoFormGroup } from './entrada-saida-produto-form.service';
import { IEntradaSaidaProduto } from '../entrada-saida-produto.model';
import { EntradaSaidaProdutoService } from '../service/entrada-saida-produto.service';
import { IProdutoCadastrado } from 'app/entities/produto-cadastrado/produto-cadastrado.model';
import { ProdutoCadastradoService } from 'app/entities/produto-cadastrado/service/produto-cadastrado.service';

@Component({
  selector: 'jhi-entrada-saida-produto-update',
  templateUrl: './entrada-saida-produto-update.component.html',
})
export class EntradaSaidaProdutoUpdateComponent implements OnInit {
  isSaving = false;
  entradaSaidaProduto: IEntradaSaidaProduto | null = null;

  produtoCadastradosSharedCollection: IProdutoCadastrado[] = [];

  editForm: EntradaSaidaProdutoFormGroup = this.entradaSaidaProdutoFormService.createEntradaSaidaProdutoFormGroup();

  constructor(
    protected entradaSaidaProdutoService: EntradaSaidaProdutoService,
    protected entradaSaidaProdutoFormService: EntradaSaidaProdutoFormService,
    protected produtoCadastradoService: ProdutoCadastradoService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareProdutoCadastrado = (o1: IProdutoCadastrado | null, o2: IProdutoCadastrado | null): boolean =>
    this.produtoCadastradoService.compareProdutoCadastrado(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ entradaSaidaProduto }) => {
      this.entradaSaidaProduto = entradaSaidaProduto;
      if (entradaSaidaProduto) {
        this.updateForm(entradaSaidaProduto);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const entradaSaidaProduto = this.entradaSaidaProdutoFormService.getEntradaSaidaProduto(this.editForm);
    if (entradaSaidaProduto.id !== null) {
      this.subscribeToSaveResponse(this.entradaSaidaProdutoService.update(entradaSaidaProduto));
    } else {
      this.subscribeToSaveResponse(this.entradaSaidaProdutoService.create(entradaSaidaProduto));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEntradaSaidaProduto>>): void {
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

  protected updateForm(entradaSaidaProduto: IEntradaSaidaProduto): void {
    this.entradaSaidaProduto = entradaSaidaProduto;
    this.entradaSaidaProdutoFormService.resetForm(this.editForm, entradaSaidaProduto);

    this.produtoCadastradosSharedCollection = this.produtoCadastradoService.addProdutoCadastradoToCollectionIfMissing<IProdutoCadastrado>(
      this.produtoCadastradosSharedCollection,
      entradaSaidaProduto.produtoCadastrado
    );
  }

  protected loadRelationshipsOptions(): void {
    this.produtoCadastradoService
      .query()
      .pipe(map((res: HttpResponse<IProdutoCadastrado[]>) => res.body ?? []))
      .pipe(
        map((produtoCadastrados: IProdutoCadastrado[]) =>
          this.produtoCadastradoService.addProdutoCadastradoToCollectionIfMissing<IProdutoCadastrado>(
            produtoCadastrados,
            this.entradaSaidaProduto?.produtoCadastrado
          )
        )
      )
      .subscribe((produtoCadastrados: IProdutoCadastrado[]) => (this.produtoCadastradosSharedCollection = produtoCadastrados));
  }
}
