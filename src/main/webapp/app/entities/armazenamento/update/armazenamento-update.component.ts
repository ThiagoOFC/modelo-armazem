import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ArmazenamentoFormService, ArmazenamentoFormGroup } from './armazenamento-form.service';
import { IArmazenamento } from '../armazenamento.model';
import { ArmazenamentoService } from '../service/armazenamento.service';
import { IProdutoCadastrado } from 'app/entities/produto-cadastrado/produto-cadastrado.model';
import { ProdutoCadastradoService } from 'app/entities/produto-cadastrado/service/produto-cadastrado.service';

@Component({
  selector: 'jhi-armazenamento-update',
  templateUrl: './armazenamento-update.component.html',
})
export class ArmazenamentoUpdateComponent implements OnInit {
  isSaving = false;
  armazenamento: IArmazenamento | null = null;

  produtoCadastradosSharedCollection: IProdutoCadastrado[] = [];

  editForm: ArmazenamentoFormGroup = this.armazenamentoFormService.createArmazenamentoFormGroup();

  constructor(
    protected armazenamentoService: ArmazenamentoService,
    protected armazenamentoFormService: ArmazenamentoFormService,
    protected produtoCadastradoService: ProdutoCadastradoService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareProdutoCadastrado = (o1: IProdutoCadastrado | null, o2: IProdutoCadastrado | null): boolean =>
    this.produtoCadastradoService.compareProdutoCadastrado(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ armazenamento }) => {
      this.armazenamento = armazenamento;
      if (armazenamento) {
        this.updateForm(armazenamento);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const armazenamento = this.armazenamentoFormService.getArmazenamento(this.editForm);
    if (armazenamento.id !== null) {
      this.subscribeToSaveResponse(this.armazenamentoService.update(armazenamento));
    } else {
      this.subscribeToSaveResponse(this.armazenamentoService.create(armazenamento));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IArmazenamento>>): void {
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

  protected updateForm(armazenamento: IArmazenamento): void {
    this.armazenamento = armazenamento;
    this.armazenamentoFormService.resetForm(this.editForm, armazenamento);

    this.produtoCadastradosSharedCollection = this.produtoCadastradoService.addProdutoCadastradoToCollectionIfMissing<IProdutoCadastrado>(
      this.produtoCadastradosSharedCollection,
      armazenamento.produtoCadastrado
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
            this.armazenamento?.produtoCadastrado
          )
        )
      )
      .subscribe((produtoCadastrados: IProdutoCadastrado[]) => (this.produtoCadastradosSharedCollection = produtoCadastrados));
  }
}
