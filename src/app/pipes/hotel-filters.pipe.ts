import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hotelFilters'
})
export class HotelFiltersPipe implements PipeTransform {

  transform(items: any[], types: string[]): any[] {
    if (!types || types.length === 0) return items;
    return items.filter(item => types.includes(item.prperty_name));
  }

   // transform(items: any, filter: any, isAnd: bool): any {
  //   if (filter && Array.isArray(items)) {
  //     let filterKeys = Object.keys(filter);
  //     if (isAnd) {
  //       return items.filter(item =>
  //           filterKeys.reduce((memo, keyName) =>
  //               (memo && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] === "", true));
  //     } else {
  //       return items.filter(item => {
  //         return filterKeys.some((keyName) => {
  //           return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] === "";
  //         });
  //       });
  //     }
  //   } else {
  //     return items;
  //   }
  // }

}

