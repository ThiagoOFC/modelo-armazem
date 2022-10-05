import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEntradaSaidaProduto } from '../entrada-saida-produto.model';

@Component({
  selector: 'jhi-entrada-saida-produto-detail',
  templateUrl: './entrada-saida-produto-detail.component.html',
})
export class EntradaSaidaProdutoDetailComponent implements OnInit {
  entradaSaidaProduto: IEntradaSaidaProduto | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ entradaSaidaProduto }) => {
      this.entradaSaidaProduto = entradaSaidaProduto;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
