import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.css']
})
export class ThankYouComponent implements OnInit {
  thankYouMsg: string = '';
  queryParams;
  constructor(private __ms:MainService, private __actRouter:ActivatedRoute) { }

  ngOnInit() {
    this.queryParams = this.__actRouter.snapshot.queryParams;

    let thankUrl = 'http://www.cheapfly.pk/rgtapp/index.php/services/Ticket/thankYou';
    let thankObj = {
      _token : this.queryParams._token
    };
    this.__ms.postData(thankUrl, thankObj).subscribe(res => {
      console.log(res)
      this.thankYouMsg = res['msg'];
    })
    // this.thankYouMsg;
  }

}
