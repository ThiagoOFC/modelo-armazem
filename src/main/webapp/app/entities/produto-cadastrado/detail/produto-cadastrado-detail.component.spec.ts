import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProdutoCadastradoDetailComponent } from './produto-cadastrado-detail.component';

describe('ProdutoCadastrado Management Detail Component', () => {
  let comp: ProdutoCadastradoDetailComponent;
  let fixture: ComponentFixture<ProdutoCadastradoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProdutoCadastradoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ produtoCadastrado: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProdutoCadastradoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProdutoCadastradoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load produtoCadastrado on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.produtoCadastrado).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
