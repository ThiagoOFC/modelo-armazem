import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ArmazenamentoService } from '../service/armazenamento.service';

import { ArmazenamentoComponent } from './armazenamento.component';

describe('Armazenamento Management Component', () => {
  let comp: ArmazenamentoComponent;
  let fixture: ComponentFixture<ArmazenamentoComponent>;
  let service: ArmazenamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'armazenamento', component: ArmazenamentoComponent }]), HttpClientTestingModule],
      declarations: [ArmazenamentoComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ArmazenamentoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ArmazenamentoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ArmazenamentoService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.armazenamentos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to armazenamentoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getArmazenamentoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getArmazenamentoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
