import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { ControlsOf, IProfile, PageHeaderComponent } from '@shared';
import { FormsDatetimeComponent } from '../datetime/datetime.component';

@Component({
  selector: 'app-forms-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    FormsDatetimeComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    TranslateModule,
    PageHeaderComponent,
  ],
})
export class FormsElementsComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly dateAdapter = inject(DateAdapter);
  private readonly translate = inject(TranslateService);

  reactiveForm1 = this.fb.nonNullable.group({
    virtualDataRoomTitle: ['', [Validators.required]],
    access: ['', [Validators.required]],
    defaultGuestPermission: ['', [Validators.required]],
    chosenDateTime: ['', [Validators.required]],
  });

  private translateSubscription = Subscription.EMPTY;

  ngOnInit() {
    this.translateSubscription = this.translate.onLangChange.subscribe((res: { lang: any }) => {
      this.dateAdapter.setLocale(res.lang);
    });
  }

  ngOnDestroy() {
    this.translateSubscription.unsubscribe();
  }

  getErrorMessage(form: FormGroup<ControlsOf<IProfile>>) {
    return form.get('email')?.hasError('required')
      ? 'validations.required'
      : form.get('email')?.hasError('email')
        ? 'validations.invalid_email'
        : '';
  }
}