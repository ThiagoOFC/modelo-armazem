import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ArmazenamentoDetailComponent } from './armazenamento-detail.component';

describe('Armazenamento Management Detail Component', () => {
  let comp: ArmazenamentoDetailComponent;
  let fixture: ComponentFixture<ArmazenamentoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArmazenamentoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ armazenamento: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ArmazenamentoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ArmazenamentoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load armazenamento on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.armazenamento).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
