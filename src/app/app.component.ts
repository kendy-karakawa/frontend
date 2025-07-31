import { Component } from '@angular/core';
import { NotificacaoComponent } from './components/notificacao/notificacao.component';

@Component({
  selector: 'app-root',
  imports: [NotificacaoComponent],
  template: '<app-notificacao/>',
})
export class AppComponent {
  title = 'frontend';
}
