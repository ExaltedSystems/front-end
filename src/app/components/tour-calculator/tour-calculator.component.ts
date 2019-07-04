import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/date.adapter';
import { MainService } from 'src/app/services/main.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-tour-calculator',
  templateUrl: './tour-calculator.component.html',
  styleUrls: ['./tour-calculator.component.css'],
	providers: [
		{
			provide: DateAdapter, useClass: AppDateAdapter
		},
		{
			provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
		}
	]
})
export class TourCalculatorComponent implements OnInit {
  tourCalculatorForm: FormGroup;
  hotelRows: FormArray;
  allHotels:object;

  hotelsAutocomplete = new FormControl();
  hotelsList: string[] = [];
  filteredList: Observable<string[]>;

  dt: Date = new Date();
  currDate = new Date(this.dt.setDate(this.dt.getDate() + 1));
  constructor(private __fb: FormBuilder, private __ms: MainService) { }

  ngOnInit() {
    this.getTourHotels();
    this.tourCalculatorForm = this.__fb.group({
      totalAdults:[2, Validators.required],
      totalChildrens:[''],
      email:['', [Validators.required, Validators.email]],
      phone:['', Validators.required],
      hotelRows: this.__fb.array([ this.addMoreHotelRows()])
    });
    this.filteredList = this.hotelsAutocomplete.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    let filterResult = this.hotelsList.filter(option => option.toLowerCase().includes(filterValue));
    if(filterResult.length > 0){
      return filterResult;
    }
  }
  addMoreHotelRows(): FormGroup {
    return this.__fb.group({
      ID: [''],
      hotelName: [''],
      tourCheckIn: [''],
      tourCheckOut: [''],
      totalNights: [''],
      roomPrice:['']
    });
  }
  addMoreTourRows(){
    this.hotelRows = this.tourCalculatorForm.get('hotelRows') as FormArray;
    this.hotelRows.push(this.addMoreHotelRows());
  }
  removeTourRow(index): void {
    if(index > 0) {
      this.hotelRows = this.tourCalculatorForm.get('hotelRows') as FormArray;
      this.hotelRows.removeAt(index);
    }
  }
  calculateDate = (key) => {
    let formArray = this.tourCalculatorForm.controls['hotelRows'] as FormArray;
    let formGroup = formArray.controls[key] as FormGroup;
    let date1 = formGroup.controls['tourCheckIn'].value;
    let date2 = formGroup.controls['tourCheckOut'].value;
    if(!date2){
      let dt = new Date(date1);
      date2 = new Date(dt.setDate(dt.getDate() + 3));
      formGroup.controls['tourCheckIn'].setValue(date2);
    }
    let diffc = new Date(date1).getTime() - new Date(date2).getTime();
    let days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24)));
    formGroup.controls['totalNights'].setValue(days);
  }
  getTourHotels(){
    this.__ms.getData(this.__ms.backEndUrl+'Umrah/tourHotelAutocomplete').subscribe(result => {
      // if(result.status) {
        this.allHotels = result
      // }
    })
  }
  calculateHotelPkg(formInputs){
    console.log('HotelData:', formInputs)
  }

}
