import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonTextarea } from '@ionic/angular/standalone';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, NgIf, IonTextarea],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.scss'
})
export class ReviewFormComponent {
  @Input() disabled = false;
  @Output() submitted = new EventEmitter<{ rating: number; comment: string }>();

  stars = [1, 2, 3, 4, 5];
  rating = 0;
  comment = '';
  touched = false;

  setRating(value: number): void {
    this.rating = value;
    this.touched = true;
  }

  submit(): void {
    this.touched = true;
    if (this.rating === 0) {
      return;
    }
    this.submitted.emit({ rating: this.rating, comment: this.comment.trim() });
  }
}
