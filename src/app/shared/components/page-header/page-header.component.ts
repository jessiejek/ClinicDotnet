import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { IonBackButton, IonButtons } from '@ionic/angular/standalone';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [NgIf, IonButtons, IonBackButton],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle?: string;
  @Input() showBackButton = false;
  @Input() defaultBackHref = '/public';
}
