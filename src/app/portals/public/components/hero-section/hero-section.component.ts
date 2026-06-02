import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, medicalOutline, peopleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [RouterLink, IonIcon],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  constructor() {
    addIcons({ medicalOutline, calendarOutline, peopleOutline });
  }
}
