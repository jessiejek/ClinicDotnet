import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, star } from 'ionicons/icons';
import { Review } from '../../../../core/models';
import { formatReviewDate } from '../../utils/time-format';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [NgFor, IonIcon],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.scss'
})
export class ReviewCardComponent {
  @Input({ required: true }) review!: Review;

  constructor() {
    addIcons({ star, personOutline });
  }

  get stars(): unknown[] {
    const n = Math.min(5, Math.max(0, Math.round(this.review.rating)));
    return Array.from({ length: n });
  }

  get starLabel(): string {
    return `${this.review.rating} out of 5 stars`;
  }

  get formattedDate(): string {
    return formatReviewDate(this.review.createdAt);
  }
}
