import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';

@Injectable()
export class NotificacaoService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  gerarMensagemId(): string {
    return uuidv4();
  }

  enviarMensagem(
    conteudoMensagem: string,
    mensagemId: string
  ): Observable<any> {
    return this.http.post(`${this.API_URL}/notificar`, {
      conteudoMensagem,
      mensagemId,
    });
  }

  verificarStatus(mensagemId: string): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(
      `${this.API_URL}/notificacao/status/${mensagemId}`
    );
  }
}
