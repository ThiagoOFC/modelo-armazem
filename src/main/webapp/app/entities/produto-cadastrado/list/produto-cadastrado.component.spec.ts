import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProdutoCadastradoService } from '../service/produto-cadastrado.service';

import { ProdutoCadastradoComponent } from './produto-cadastrado.component';

describe('ProdutoCadastrado Management Component', () => {
  let comp: ProdutoCadastradoComponent;
  let fixture: ComponentFixture<ProdutoCadastradoComponent>;
  let service: ProdutoCadastradoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'produto-cadastrado', component: ProdutoCadastradoComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ProdutoCadastradoComponent],
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
      .overrideTemplate(ProdutoCadastradoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProdutoCadastradoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProdutoCadastradoService);

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
    expect(comp.produtoCadastrados?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to produtoCadastradoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getProdutoCadastradoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getProdutoCadastradoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
