import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonRouterOutlet,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-legacy-public-layout',
  templateUrl: './public-layout.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonRouterOutlet,
    IonButton
  ]
})
export class LegacyPublicLayoutComponent {}
