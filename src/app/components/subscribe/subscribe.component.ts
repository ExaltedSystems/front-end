import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainService } from 'src/app/services/main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {
  subscribeForm: FormGroup;
  subscriberSuccessMsg: string;
  subscriberErrorMsg: string;
  isLoad: boolean = false;
  constructor(private __fb: FormBuilder, private __ms: MainService, private __router: Router) { }

  ngOnInit() {
    this.subscribeForm = this.__fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  subscribeNow(inputs) {
    if(this.subscribeForm.valid) {
      this.isLoad = true;
      Object.assign(inputs, {
        ipAddress: this.__ms.ipAddress,
        pageUrl: this.__router.url,
      });
      this.__ms.postData(this.__ms.backEndUrl + 'cms/addSubscriber', inputs).subscribe(result => {
        if(result.status){
          this.subscriberSuccessMsg = result.message;
        } else {
          this.subscriberErrorMsg = result.message;
          this.subscribeForm.controls['email'].setErrors({ 'incorrect': true });
        }
        window.setTimeout(()=>{
          this.subscribeForm.get('email').setValue('');
          this.subscribeForm.controls['email'].markAsUntouched(); 
          this.subscriberSuccessMsg = '';
          this.subscriberErrorMsg = '';
        }, 20000)
        this.isLoad = false;
      });
    }
  }

}
