import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EntradaSaidaProdutoService } from '../service/entrada-saida-produto.service';

import { EntradaSaidaProdutoComponent } from './entrada-saida-produto.component';

describe('EntradaSaidaProduto Management Component', () => {
  let comp: EntradaSaidaProdutoComponent;
  let fixture: ComponentFixture<EntradaSaidaProdutoComponent>;
  let service: EntradaSaidaProdutoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'entrada-saida-produto', component: EntradaSaidaProdutoComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [EntradaSaidaProdutoComponent],
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
      .overrideTemplate(EntradaSaidaProdutoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EntradaSaidaProdutoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EntradaSaidaProdutoService);

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
    expect(comp.entradaSaidaProdutos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to entradaSaidaProdutoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getEntradaSaidaProdutoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getEntradaSaidaProdutoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
