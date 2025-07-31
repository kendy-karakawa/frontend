import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NotificacaoComponent } from './notificacao.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('NotificacaoComponent', () => {
  let component: NotificacaoComponent;
  let fixture: ComponentFixture<NotificacaoComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacaoComponent, HttpClientTestingModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacaoComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve gerar mensagemId, enviar POST e adicionar notificação com status AGUARDANDO PROCESSAMENTO', () => {
    component.conteudoMensagem = 'Teste de mensagem';

    component.enviar();

    expect(component.notificacoes.length).toBe(1);
    const notificacao = component.notificacoes[0];
    expect(notificacao.conteudo).toBe('Teste de mensagem');
    expect(notificacao.status).toBe('AGUARDANDO PROCESSAMENTO');
    expect(notificacao.id).toMatch(/[a-f0-9\-]{36}/);

    const req = httpMock.expectOne('http://localhost:3000/api/notificar');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.mensagemId).toBe(notificacao.id);
    expect(req.request.body.conteudoMensagem).toBe('Teste de mensagem');
    req.flush({});
  });

  it('deve atualizar o status após polling', fakeAsync(() => {
    component.conteudoMensagem = 'Teste polling';
    component.enviar();

    const reqPost = httpMock.expectOne('http://localhost:3000/api/notificar');
    reqPost.flush({});

    const notificacao = component.notificacoes[0];

    tick(3000);

    const reqGet = httpMock.expectOne(
      `http://localhost:3000/api/notificacao/status/${notificacao.id}`
    );
    expect(reqGet.request.method).toBe('GET');
    reqGet.flush({ status: 'PROCESSADO_SUCESSO' });

    tick(10);

    expect(notificacao.status).toBe('PROCESSADO_SUCESSO');
  }));
});
