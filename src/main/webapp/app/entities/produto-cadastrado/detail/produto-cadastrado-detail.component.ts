import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProdutoCadastrado } from '../produto-cadastrado.model';

@Component({
  selector: 'jhi-produto-cadastrado-detail',
  templateUrl: './produto-cadastrado-detail.component.html',
})
export class ProdutoCadastradoDetailComponent implements OnInit {
  produtoCadastrado: IProdutoCadastrado | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ produtoCadastrado }) => {
      this.produtoCadastrado = produtoCadastrado;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
