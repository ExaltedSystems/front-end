import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
	nav : any;
  constructor(private _ms: MainService) {
   }

  ngOnInit() {
  	this.getNavBar();
  }
  getNavBar(){
  	this._ms.getData(this._ms.backEndUrl+'Cms/navbarTopmenuLinks').subscribe(res => {
      this.nav = res.data;
      console.log(this.nav);
    });
  }
}
