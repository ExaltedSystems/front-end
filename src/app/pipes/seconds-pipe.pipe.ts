import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsPipe'
})
export class SecondsPipePipe implements PipeTransform {

  transform(value: any): any {
    // set minutes to seconds
    var seconds = value * 60
    
    // calculate (and subtract) whole hours
    var hours = Math.floor(seconds / 3600) % 24;
    seconds -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(seconds / 60) % 60;

    return hours + 'h ' + minutes + 'm ';
  }

}
