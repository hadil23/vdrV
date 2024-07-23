import { Component, OnDestroy, OnInit, forwardRef, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MtxDatetimepickerModule,
} from '@ng-matero/extensions/datetimepicker';
import { TranslateService } from '@ngx-translate/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';  // Import CommonModule for *ngIf

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-forms-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.scss'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormsDatetimeComponent),
      multi: true,
    },
  ],
  imports: [
    CommonModule,  // Add CommonModule here
    ReactiveFormsModule,  // Add ReactiveFormsModule here
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MtxDatetimepickerModule,
  ],
})
export class FormsDatetimeComponent implements OnInit, OnDestroy, ControlValueAccessor {
  private readonly fb = inject(FormBuilder);
  private readonly dateAdapter = inject(DateAdapter);
  private readonly translate = inject(TranslateService);

  group: FormGroup;
  min: moment.Moment;
  max: moment.Moment;
  private translateSubscription = Subscription.EMPTY;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.min = moment.utc().year(2018).month(10).date(3).hour(11).minute(10);
    this.max = this.min.clone().date(4).minute(45);

    this.group = this.fb.group({
      touch: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.translateSubscription = this.translate.onLangChange.subscribe((res: { lang: string }) => {
      this.dateAdapter.setLocale(res.lang);
    });
  }

  ngOnDestroy() {
    this.translateSubscription.unsubscribe();
  }

  writeValue(value: any): void {
    if (value) {
      this.group.get('touch')?.setValue(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.group.disable();
    } else {
      this.group.enable();
    }
  }

  onDateChange(event: any): void {
    const value = event.value;
    const formattedDate = this.convertDateToMySQLFormat(value);
    this.onChange(formattedDate);
    this.onTouched();
  }
  
  convertDateToMySQLFormat(date: moment.Moment): string {
    return date.format('YYYY-MM-DD HH:mm:ss');
  }
  

 
}
