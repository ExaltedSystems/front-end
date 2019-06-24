import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
	nav : any;
  constructor(private __ms: MainService) {
   }

  ngOnInit() {
  	this.getNavBar();
  }
  getNavBar(){
  	this.__ms.getData(this.__ms.backEndUrl+'Cms/navbarTopmenuLinks').subscribe(res => {
      this.nav = res.data;
    });
  }
}
