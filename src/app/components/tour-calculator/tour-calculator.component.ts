import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/date.adapter';
import { MainService } from 'src/app/services/main.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';

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
  allHotels: any = [];
  isLinear = true;
  pkgPreview: object;
  hotelsAutocomplete = new FormControl();
  hotelsList: string[] = [];
  filteredList: Observable<string[]>;

  // filteredOptions: Observable<string[]>;

  filteredOptions: Observable<string[]>[] = [];

  dt: Date = new Date();
  currDate = new Date(this.dt.setDate(this.dt.getDate() + 1));
  deviceFullInfo = null;
  browser = null;
  operatingSys = null;

  constructor(private __fb: FormBuilder, private __ms: MainService, private __router: Router, private __dd: DeviceDetectorService) {
    this.deviceFullInfo = this.__dd.getDeviceInfo();
    this.browser = this.__dd.browser;
    this.operatingSys = this.__dd.os;
  }

  ngOnInit() {
    this.getTourHotels();
    this.tourCalculatorForm = this.__fb.group({
      totalAdults: [2, Validators.required],
      totalChildrens: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      hotelRows: this.__fb.array([this.addMoreHotelRows()])
    });
    this.ManageNameControl(0);

    // this.filteredList = this.hotelsAutocomplete.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value))
    // );

    // this.filteredOptions = this.hotelsAutocomplete.valueChanges
    //   .pipe(
    //   startWith(''),
    //   map(val => this.filter(val))
    //   );
  }
  filter(val: string): string[] {
    console.log('AutoComp:', val)
    return this.allHotels.map(x => x.hotelName).filter(option =>
      option.toLowerCase().includes(val.toLowerCase()));
  }
  onSelectionChange(ev, key) {
    console.log(ev)
    let formArray = this.tourCalculatorForm.controls['hotelRows'] as FormArray;
    let formGroup = formArray.controls[key] as FormGroup;
    this.hotelsAutocomplete.setValue(ev.source.value);
    formGroup.controls['hotelName'].setValue(ev.source.value);
  }
  private _filter(value: string): string[] {
    console.log(value)
    const filterValue = value.toLowerCase();
    let filterResult = this.allHotels.filter(option => option.hotelName.toLowerCase().includes(filterValue));
    if (filterResult.length > 0) {
      return filterResult;
    }
  }
  ManageNameControl(index: number) {
    var arrayControl = this.tourCalculatorForm.get('hotelRows') as FormArray;
    this.filteredOptions[index] = arrayControl.at(index).get('hotelName').valueChanges
      .pipe(
        startWith<string>(''),
        map(value => typeof value === 'string' ? value : value),
        map(name => name ? this._filter(name) : this.allHotels.slice())
      );

  }
  addMoreHotelRows(): FormGroup {
    return this.__fb.group({
      ID: [''],
      hotelName: ['', Validators.required],
      tourCheckIn: ['', Validators.required],
      tourCheckOut: ['', Validators.required],
      totalNights: [''],
      dblRoom: [1],
      tplRoom: [''],
      qdRoom: [''],
    });
  }
  addMoreTourRows() {
    this.hotelRows = this.tourCalculatorForm.get('hotelRows') as FormArray;
    this.hotelRows.push(this.addMoreHotelRows());
    let formArray = this.tourCalculatorForm.controls['hotelRows'] as FormArray;
    let formGroup = formArray.controls[this.hotelRows.length - 1] as FormGroup;
    let lastCheckOut = formArray.controls[this.hotelRows.length - 2] as FormGroup;
    let date1 = lastCheckOut.controls['tourCheckOut'].value;
    formGroup.controls['hotelName'].setValue('');
    formGroup.controls['tourCheckIn'].setValue(date1);
    formGroup.controls['tourCheckOut'].setValue('');
    // Build the account Auto Complete values
    this.ManageNameControl(this.hotelRows.length - 1);
    this.calculateDate(this.hotelRows.length - 1);
  }
  removeTourRow(index): void {
    if (index > 0) {
      this.hotelRows = this.tourCalculatorForm.get('hotelRows') as FormArray;
      this.hotelRows.removeAt(index);
    }
  }
  calculateDate = (key, inc = false) => {
    let formArray = this.tourCalculatorForm.controls['hotelRows'] as FormArray;
    let formGroup = formArray.controls[key] as FormGroup;
    let date1 = formGroup.controls['tourCheckIn'].value;
    let date2 = formGroup.controls['tourCheckOut'].value;
    if (!date2) {
      let dt = new Date(date1);
      date2 = new Date(dt.setDate(dt.getDate() + 3));
      formGroup.controls['tourCheckOut'].setValue(date2);
    }
    let compDate = new Date(date1).getTime() > new Date(date2).getTime();
    if(compDate || inc) {
      let dt = new Date(date1);
      date2 = new Date(dt.setDate(dt.getDate() + 3));
      formGroup.controls['tourCheckOut'].setValue(date2);
    }
    let hotelRows = this.tourCalculatorForm.get('hotelRows') as FormArray;
    if(hotelRows.length > key) {
      for(let i = (key + 1);i<hotelRows.length;i++){
        console.log('Key:', i)
        let lastCheckOut = hotelRows.controls[i] as FormGroup;
        // let date1 = lastCheckOut.controls['tourCheckOut'].value;
        lastCheckOut.controls['tourCheckIn'].setValue(date2);
        this.calculateDate(i, true);
      }
    }
    let diffc = new Date(date1).getTime() - new Date(date2).getTime();
    let days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24)));
    formGroup.controls['totalNights'].setValue(days);
  }
  getTourHotels() {
    this.__ms.getData(this.__ms.backEndUrl + 'Umrah/tourHotelAutocomplete').subscribe(result => {
      // if(result.status) {
      this.allHotels = result
      // }
    })
  }
  calculateHotelPkg(formInputs) {
    console.log('HotelData:', formInputs)
    if (this.tourCalculatorForm.valid) {
      Object.assign(formInputs, {type:'preview'});
      this.__ms.postData(this.__ms.backEndUrl + 'Umrah/calcUmrahTourPkg', formInputs).subscribe(result => {
        // console.log('Pkg_Details:', result)
        this.pkgPreview = result;
      })
    } else {
      this.tourCalculatorForm.controls['email'].markAsTouched();
      this.tourCalculatorForm.controls['phone'].markAsTouched();
    }
  }
  confirmPkg() {
    let formData = this.tourCalculatorForm.value;
    Object.assign(formData, {
      ipAddress: this.__ms.ipAddress,
      browser: this.browser,
      type: 'confirm',
      operatingSys: this.operatingSys,
      deviceFullInfo: this.deviceFullInfo,
      pageUrl: this.__router.url,
      country: "PK",
      referrerUrl: this.__router.url
    });
    // console.log('HotelData:', this.tourCalculatorForm.value)
    // console.log('HotelFormData:', formData)
    this.__ms.postData(this.__ms.backEndUrl + 'Umrah/calcUmrahTourPkg', formData).subscribe(result => {
      // console.log('Pkg_Details:', result)
      this.pkgPreview = result;
    })
  }
  printPkg(divId) {
    let printContents, popupWin;
    printContents = document.getElementById(divId).innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Tour Custom Package</title>
          <style>.table-bordered {border: 1px solid #dee2e6;}
          .table-bordered td, .table-bordered th {border: 1px solid #dee2e6;}
          .table td, .table th {padding: .75rem;vertical-align: top;border-top: 1px solid #dee2e6;}</style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

}
