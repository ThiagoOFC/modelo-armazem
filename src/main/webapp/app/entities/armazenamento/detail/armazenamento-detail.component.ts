import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IArmazenamento } from '../armazenamento.model';

@Component({
  selector: 'jhi-armazenamento-detail',
  templateUrl: './armazenamento-detail.component.html',
})
export class ArmazenamentoDetailComponent implements OnInit {
  armazenamento: IArmazenamento | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ armazenamento }) => {
      this.armazenamento = armazenamento;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
