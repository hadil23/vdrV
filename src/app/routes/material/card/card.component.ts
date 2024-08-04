import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
})
export class CardComponent implements OnChanges {
  @Input() title!: string;
  @Input() id!: number;

  constructor(private snackBar: MatSnackBar, private router: Router) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.title) {
      console.log('Title:', this.title);
    }
    if (changes.id) {
      console.log('ID:', this.id);
    }
  }

  openSnackbar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  navigateToRoom() {
    this.router.navigate(['/forms/virtual-data-room', this.id]);
  }
}
