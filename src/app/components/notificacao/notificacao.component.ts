import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotificacaoService } from '../../services/notificacao.service';

@Component({
  selector: 'app-notificacao',
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [NotificacaoService],
  templateUrl: './notificacao.component.html',
  styleUrls: ['./notificacao.component.scss'],
})
export class NotificacaoComponent {
  conteudoMensagem = '';
  notificacoes: { id: string; conteudo: string; status: string }[] = [];

  constructor(private readonly notificacaoService: NotificacaoService) {}

  enviar(): void {
    if (!this.conteudoMensagem.trim()) return;

    const id = this.notificacaoService.gerarMensagemId();

    this.notificacoes.push({
      id,
      conteudo: this.conteudoMensagem,
      status: 'AGUARDANDO PROCESSAMENTO',
    });

    this.notificacaoService
      .enviarMensagem(this.conteudoMensagem, id)
      .subscribe();

    this.iniciarPolling(id);
    this.conteudoMensagem = '';
  }

  iniciarPolling(mensagemId: string): void {
    const interval = setInterval(() => {
      this.notificacaoService
        .verificarStatus(mensagemId)
        .subscribe((res: any) => {
          const notificacao = this.notificacoes.find(
            (n) => n.id === mensagemId
          );
          if (notificacao && res.status !== 'AGUARDANDO_PROCESSAMENTO') {
            notificacao.status = res.status.replace(/_/g, ' ');
            clearInterval(interval);
          }
        });
    }, 3000);
  }
}
