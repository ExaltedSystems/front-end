import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MatHorizontalStepper } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/date.adapter';
import { MainService } from 'src/app/services/main.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { isObject } from 'util';

@Component({
  selector: 'app-calculate-umrah-package',
  templateUrl: './calculate-umrah-package.component.html',
  styleUrls: ['./calculate-umrah-package.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class CalculateUmrahPackageComponent implements OnInit {
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
  umrahCalculatorForm: FormGroup;
  hotelRows: FormArray;
  allHotels: any = [];
  hotelLists: any = [];
  sectorLists: object;
  vehicleLists: object;
  isLinear = true;
  confirmed: boolean = true;
  errorMsg: string = '';
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
  roomErrors: string = '';
  dblRoom: number = 1;
  tplRoom: number = 0;
  qdRoom: number = 0;

  constructor(private __fb: FormBuilder, private __ms: MainService, private __router: Router, private __dd: DeviceDetectorService) {
    this.deviceFullInfo = this.__dd.getDeviceInfo();
    this.browser = this.__dd.browser;
    this.operatingSys = this.__dd.os;
    this.getAllHotelList();
  }


  ngOnInit() {
    this.getTourHotels();
    this.getVehicleList();
    this.getSectorList();
    this.umrahCalculatorForm = this.__fb.group({
      totalAdults: [2, Validators.required],
      totalChildrens: [0],
      totalInfants: [0],
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      hotelRows: this.__fb.array([this.addMoreHotelRows()]),
      isVisa: [true],
      isTransport: [true],
      sectorId: [''],
      sectorName: [''],
      vehicleId: [''],
      vehicleName: ['']
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
    return this.allHotels.map(x => x.hotelName).filter(option =>
      option.toLowerCase().includes(val.toLowerCase()));
  }
  onSelectionChange(ev, key) {
    let formArray = this.umrahCalculatorForm.controls['hotelRows'] as FormArray;
    let formGroup = formArray.controls[key] as FormGroup;
    this.hotelsAutocomplete.setValue(ev.source.value);
    formGroup.controls['hotelName'].setValue(ev.source.value);
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    let filterResult = this.allHotels.filter(option => option.hotelName.toLowerCase().includes(filterValue));
    // let filterResult = this.getHotelsByType('Makkah').filter(option => option.hotelName.toLowerCase().includes(filterValue));
    if (filterResult.length > 0) {
      return filterResult;
    }
  }
  ManageNameControl(index: number) {
    // var arrayControl = this.umrahCalculatorForm.get('hotelRows') as FormArray;
    // this.filteredOptions[index] = arrayControl.at(index).get('hotelName').valueChanges
    //   .pipe(
    //     startWith<string>(''),
    //     map(value => typeof value === 'string' ? value : value),
    //     map(name => name ? this._filter(name) : this.allHotels.slice())
    //     // map(name => name ? this._filter(name) : this.getHotelsByType('Makkah').slice())
    //   );

  }
  addMoreHotelRows(): FormGroup {
    return this.__fb.group({
      ID: [''],
      locations: ['', Validators.required],
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
    this.hotelRows = this.umrahCalculatorForm.get('hotelRows') as FormArray;
    if (this.hotelRows.length > 3) {
      return false;
    }
    this.hotelRows.push(this.addMoreHotelRows());
    let formArray = this.umrahCalculatorForm.controls['hotelRows'] as FormArray;
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
      this.hotelRows = this.umrahCalculatorForm.get('hotelRows') as FormArray;
      this.hotelRows.removeAt(index);
    }
  }
  calculateDate = (key: number, inc: boolean = false) => {
    let formArray = this.umrahCalculatorForm.controls['hotelRows'] as FormArray;
    let formGroup = formArray.controls[key] as FormGroup;
    let date1 = formGroup.controls['tourCheckIn'].value;
    let date2 = formGroup.controls['tourCheckOut'].value;
    if (!date2) {
      let dt = new Date(date1);
      date2 = new Date(dt.setDate(dt.getDate() + 3));
      formGroup.controls['tourCheckOut'].setValue(date2);
    }
    let compDate = new Date(date1).getTime() > new Date(date2).getTime();
    if (compDate || inc) {
      let dt = new Date(date1);
      date2 = new Date(dt.setDate(dt.getDate() + 3));
      formGroup.controls['tourCheckOut'].setValue(date2);
    }
    let hotelRows = this.umrahCalculatorForm.get('hotelRows') as FormArray;
    if (hotelRows.length > key) {
      for (let i = (key + 1); i < hotelRows.length; i++) {
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
    let formArray = this.umrahCalculatorForm.controls['hotelRows'] as FormArray;
    let duplicateErrors = false;
    for (let i = 1; i < formArray.controls.length; i++) {
      let prevFormGroup = formArray.controls[(i - 1)] as FormGroup;
      let location = prevFormGroup.controls['locations'].value;

      let formGroup = formArray.controls[i] as FormGroup;
      let chkLocation = formGroup.controls['locations'].value;
      if (chkLocation == location) {
        duplicateErrors = true;
        jQuery('#duplicate_error_' + i).html('Please select another location...!');
      }
    }
    if (duplicateErrors) {
      return false;
    }
    if (this.umrahCalculatorForm.valid) {
      Object.assign(formInputs, { type: 'preview' });
      this.__ms.postData(this.__ms.backEndUrl + 'Umrah/calcUmrahTourPkg', formInputs).subscribe(result => {
        if (result['errors'] != '') {
          this.stepper.selectedIndex = 0;
          this.errorMsg = result['errors'];
        }
        this.pkgPreview = result;
      })
    } else {
      this.umrahCalculatorForm.controls['email'].markAsTouched();
      this.umrahCalculatorForm.controls['phone'].markAsTouched();
    }
  }
  confirmPkg() {
    if (this.umrahCalculatorForm.valid) {
      let formData = this.umrahCalculatorForm.value;
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
      // console.log('HotelData:', this.umrahCalculatorForm.value)
      // console.log('HotelFormData:', formData)
      this.__ms.postData(this.__ms.backEndUrl + 'Umrah/calcUmrahTourPkg', formData).subscribe(result => {
        if (result['errors'] != '') {
          this.stepper.selectedIndex = 0;
          this.errorMsg = result['errors'];
        } else {
          this.pkgPreview = result;
          this.confirmed = false;
        }
      });
    }
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

  incrementNumber(type, key) {
    this.roomErrors = '';
    let formArray = this.umrahCalculatorForm.controls['hotelRows'] as FormArray;
    let formGroup = formArray.controls[key] as FormGroup;
    let dblRoom = formGroup.controls['dblRoom'].value;
    let tplRoom = formGroup.controls['tplRoom'].value;
    let qdRoom = formGroup.controls['qdRoom'].value;
    switch (type) {
      case 'dblRoom': {
        dblRoom = +dblRoom + 1;
        formGroup.controls['dblRoom'].setValue(dblRoom);
        jQuery('#dblRoom_str_' + key).html(dblRoom + " Double");
        break;
      }
      case 'tplRoom': {
        tplRoom = +tplRoom + 1;
        formGroup.controls['tplRoom'].setValue(tplRoom);
        jQuery('#tplRoom_str_' + key).html(tplRoom + " Triple");
        break;
      }
      case 'qdRoom': {
        qdRoom = +qdRoom + 1;
        formGroup.controls['qdRoom'].setValue(qdRoom);
        jQuery('#qdRoom_str_' + key).html(qdRoom + " Quad");
        break;
      }
    }
    let roomStr = dblRoom + " Double, " + tplRoom + " Triple, " + qdRoom + " Quad";
    jQuery('#rooms_str_' + key).html(roomStr);
  }

  decrementNumber(type, key) {
    let formArray = this.umrahCalculatorForm.controls['hotelRows'] as FormArray;
    let formGroup = formArray.controls[key] as FormGroup;
    // let dblRoom = 1, tplRoom = 0, qdRoom = 0;
    let dblRoom = formGroup.controls['dblRoom'].value;
    let tplRoom = formGroup.controls['tplRoom'].value;
    let qdRoom = formGroup.controls['qdRoom'].value;
    switch (type) {
      case 'dblRoom': {
        dblRoom--;
        dblRoom < 1 ? dblRoom = 1 : dblRoom;
        formGroup.controls['dblRoom'].setValue(dblRoom);
        jQuery('#dblRoom_str_' + key).html(dblRoom + " Double");
        break;
      }
      case 'tplRoom': {
        tplRoom--;
        tplRoom < 0 ? tplRoom = 0 : tplRoom;
        formGroup.controls['tplRoom'].setValue(tplRoom);
        jQuery('#tplRoom_str_' + key).html(tplRoom + " Triple");
        break;
      }
      case 'qdRoom': {
        qdRoom--;
        qdRoom < 0 ? qdRoom = 0 : qdRoom;
        formGroup.controls['qdRoom'].setValue(qdRoom);
        jQuery('#qdRoom_str_' + key).html(qdRoom + " Quad");
        break;
      }
    }
    // jQuery('#flightPaxDropdownMenu').toggle();
    this.roomErrors = '';
    let roomStr = dblRoom + " Double, " + tplRoom + " Triple, " + qdRoom + " Quad";
    jQuery('#rooms_str_' + key).html(roomStr);
    if (+dblRoom + +tplRoom + +qdRoom <= 0) {
      this.roomErrors = 'Please select atleast 1 Room!';
      jQuery('#roomErrors_' + key).html('Please select atleast 1 Room!');
      return false;
    }
  }
  closeDropDown(ev, key) {
    // console.log('Events:', [ev.path[2], ev, ev.path])
    // jQuery(ev.path[2]).removeClass('show');
    // jQuery(ev.path[3]).removeClass('show');
    jQuery('#dropdown_btn_' + key).removeClass('show');
    jQuery('#drowdown_list_' + key).removeClass('show');
  }
  getAllHotelList() {
    this.__ms.getData(this.__ms.backEndUrl + 'Cms/hotelLists').subscribe(resp => {
      this.hotelLists = resp.data;
    });
  }
  getSectorList() {
    this.__ms.getData(this.__ms.backEndUrl + 'Cms/sectorLists').subscribe(resp => {
      this.sectorLists = resp.data;
    });
  }
  getVehicleList() {
    this.__ms.getData(this.__ms.backEndUrl + 'Cms/vehicleLists').subscribe(resp => {
      this.vehicleLists = resp.data;
    });
  }
  getHotelsByType(type) {
    const select = this.hotelLists.find(_ => _.type == type);
    return select ? select.hotels : select;
  }

  getHotelByLocation(ev: any, key: number) {
    let formArray = this.umrahCalculatorForm.controls['hotelRows'] as FormArray;
    let formGroup = formArray.controls[key] as FormGroup;
    formGroup.controls['hotelName'].setValue('');
    formGroup.controls['ID'].setValue('');
    let location: string;
    if (isObject(ev)) {
      location = ev.source.value;
    } else {
      location = ev;
    }
    if (key > 0) {
      let formGroup = formArray.controls[(key - 1)] as FormGroup;
      let chkLocation = formGroup.controls['locations'].value;
      let duplicateErrors = '';
      if (chkLocation == location) {
        duplicateErrors = 'Please select another location...!';
        jQuery('#duplicate_error_' + key).html(duplicateErrors);
        return false;
      } else {
        jQuery('#duplicate_error_' + key).html(duplicateErrors);
      }
    }
    this.__ms.getData(this.__ms.backEndUrl + 'Umrah/hotelLists').subscribe(resp => {
      let hotels;
      if (location == 'Makkah') {
        hotels = resp.data[0]['hotels'];
      } else if (location == 'Madinah') {
        hotels = resp.data[1]['hotels'];
      }
      this.__manageNameControl(key, hotels);
    });
    // let formArray = this.umrahCalculatorForm.controls['hotelRows'] as FormArray;
    // let formGroup = formArray.controls[key] as FormGroup;
    // formGroup.controls['hotelName'].setValue(ev.source.value);
  }

  private __filterHotels(value: string, hotelLists, key): string[] {
    const filterValue = value.toLowerCase();
    let filterResult = hotelLists.filter(option => option.hotelName.toLowerCase().includes(filterValue));
    if (filterResult.length > 0) {
      let formArray = this.umrahCalculatorForm.controls['hotelRows'] as FormArray;
      let formGroup = formArray.controls[key] as FormGroup;
      formGroup.controls['ID'].setValue(filterResult[0].ID);
      return filterResult;
    }
  }
  __manageNameControl(index: number, hotelLists) {
    var arrayControl = this.umrahCalculatorForm.get('hotelRows') as FormArray;
    this.filteredOptions[index] = arrayControl.at(index).get('hotelName').valueChanges
      .pipe(
        startWith<string>(''),
        map(value => typeof value === 'string' ? value : value),
        map(name => name ? this.__filterHotels(name, hotelLists, index) : hotelLists.slice())
      );
  }
  getOptionText(evt, type) {
    let optionText = evt.source.selected.viewValue;
    if (type == "sector") {
      this.umrahCalculatorForm.controls['sectorName'].setValue(optionText);
    } else if (type == "vehicle") {
      this.umrahCalculatorForm.controls['vehicleName'].setValue(optionText);
    }
  }

}
