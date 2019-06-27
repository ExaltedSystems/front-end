import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
 isLinear = false;
  personalInfoForm: FormGroup;
  familyInfoForm: FormGroup;

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
  	this.personalInfoForm = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.familyInfoForm = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

}
