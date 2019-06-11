import { Pipe, PipeTransform } from '@angular/core';
import { MainService } from './services/main.service';
import AirPortsList from 'src/assets/js/locations.json';
import AirPortNames from 'src/assets/js/AirPortNames.json';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'airPorts'
})
export class AirPortsPipe implements PipeTransform {

  airPortList:any;

  constructor(private __ms: MainService) { }
  // flag is optional if flag == 1 it return airport Name else return city 
  transform(value: any, flag?:any): any {
    if(!flag){
      this.airPortList = AirPortsList;
      return this.__filterFlyFrom(this.airPortList, value);
    }else if(flag == '1'){
      this.airPortList = AirPortNames;
      let airPortName:string = this.__filterFlyFrom(this.airPortList, value);
      return airPortName[0].substring(4);
    }
    else if(flag == '2'){
      this.airPortList = AirPortsList;
      let airPortName:string = this.__filterFlyFrom(this.airPortList, value);
      airPortName = airPortName[0];
      let airpSplt = airPortName.split(',');
      return airpSplt[0] + ',' + airpSplt[1];
    }
  }
  __filterFlyFrom(sectors, val) {
    // console.log('sectors', sectors)
    return sectors.filter(sector => sector.slice(0, 3).toLowerCase().indexOf(val.toLowerCase()) != -1)
    
  }
  
}
