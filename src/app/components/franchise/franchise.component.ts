import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainService } from "src/app/services/main.service";
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-franchise',
  templateUrl: './franchise.component.html',
  styleUrls: ['./franchise.component.css']
})
export class FranchiseComponent implements OnInit {
  franchiseForm: FormGroup;
  constructor(private __ms: MainService, private __fb: FormBuilder, private __dd: DeviceDetectorService,
  private __router: Router, private __meta: Meta, private __title: Title) {

  }

  ngOnInit() {
    this.franchiseForm = this.__fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      mobile_no: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(19), Validators.pattern('^(?=.*[0-9])[ +0-9]+$')]],
      investment: ["", Validators.required],
      tel_no :[""]
    });
  }
  onSubmit(inputs){
    console.log(inputs);
  }
}
