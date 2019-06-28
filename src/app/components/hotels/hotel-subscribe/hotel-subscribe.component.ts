import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MainService } from 'src/app/services/main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotel-subscribe',
  templateUrl: './hotel-subscribe.component.html',
  styleUrls: ['./hotel-subscribe.component.css']
})
export class HotelSubscribeComponent implements OnInit {

  hotelSubscribeForm: FormGroup;
  subscriberSuccessMsg: string;
  subscriberErrorMsg: string;
  isLoad: boolean = false;
  constructor(private __fb: FormBuilder, private __ms: MainService, private __router: Router) { }

  ngOnInit() {
    this.hotelSubscribeForm = this.__fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  subscribeNow(inputs) {
      this.isLoad = true;
      Object.assign(inputs, {
      ipAddress: this.__ms.ipAddress,
      pageUrl: this.__router.url,
      queryFrom: "Hotel"
    });
    this.__ms.postData(this.__ms.backEndUrl + 'cms/addSubscriber', inputs).subscribe(result => {
      if(result.status){
        this.subscriberSuccessMsg = result.message;
      } else {
        this.subscriberErrorMsg = result.message;
      }
      window.setTimeout(()=>{
        this.hotelSubscribeForm.get('email').setValue('');
        this.hotelSubscribeForm.controls['email'].markAsUntouched(); 
        this.subscriberSuccessMsg = '';
        this.subscriberErrorMsg = '';
      }, 10000)
      this.isLoad = false;
    });
  }

}
