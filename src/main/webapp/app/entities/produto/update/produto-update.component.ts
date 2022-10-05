import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ProdutoFormService, ProdutoFormGroup } from './produto-form.service';
import { IProduto } from '../produto.model';
import { ProdutoService } from '../service/produto.service';
import { IProdutoCadastrado } from 'app/entities/produto-cadastrado/produto-cadastrado.model';
import { ProdutoCadastradoService } from 'app/entities/produto-cadastrado/service/produto-cadastrado.service';

@Component({
  selector: 'jhi-produto-update',
  templateUrl: './produto-update.component.html',
})
export class ProdutoUpdateComponent implements OnInit {
  isSaving = false;
  produto: IProduto | null = null;

  produtoCadastradosSharedCollection: IProdutoCadastrado[] = [];

  editForm: ProdutoFormGroup = this.produtoFormService.createProdutoFormGroup();

  constructor(
    protected produtoService: ProdutoService,
    protected produtoFormService: ProdutoFormService,
    protected produtoCadastradoService: ProdutoCadastradoService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareProdutoCadastrado = (o1: IProdutoCadastrado | null, o2: IProdutoCadastrado | null): boolean =>
    this.produtoCadastradoService.compareProdutoCadastrado(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ produto }) => {
      this.produto = produto;
      if (produto) {
        this.updateForm(produto);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const produto = this.produtoFormService.getProduto(this.editForm);
    if (produto.id !== null) {
      this.subscribeToSaveResponse(this.produtoService.update(produto));
    } else {
      this.subscribeToSaveResponse(this.produtoService.create(produto));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduto>>): void {
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

  protected updateForm(produto: IProduto): void {
    this.produto = produto;
    this.produtoFormService.resetForm(this.editForm, produto);

    this.produtoCadastradosSharedCollection = this.produtoCadastradoService.addProdutoCadastradoToCollectionIfMissing<IProdutoCadastrado>(
      this.produtoCadastradosSharedCollection,
      produto.produtoCadastrado
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
            this.produto?.produtoCadastrado
          )
        )
      )
      .subscribe((produtoCadastrados: IProdutoCadastrado[]) => (this.produtoCadastradosSharedCollection = produtoCadastrados));
  }
}
