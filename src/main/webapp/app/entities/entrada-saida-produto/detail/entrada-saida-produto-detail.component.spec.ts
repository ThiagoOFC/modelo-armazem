import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EntradaSaidaProdutoDetailComponent } from './entrada-saida-produto-detail.component';

describe('EntradaSaidaProduto Management Detail Component', () => {
  let comp: EntradaSaidaProdutoDetailComponent;
  let fixture: ComponentFixture<EntradaSaidaProdutoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntradaSaidaProdutoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ entradaSaidaProduto: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EntradaSaidaProdutoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EntradaSaidaProdutoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load entradaSaidaProduto on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.entradaSaidaProduto).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
