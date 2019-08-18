import { Pipe, PipeTransform } from '@angular/core';
import airlines from '../../assets/js/airlines.json';

@Pipe({
  name: 'filterAirlineName'
})
export class FilterAirlineNamePipe implements PipeTransform {

  transform(searchText: string): any[] {
    let items: any = airlines;
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter((item: any) => {
      if (item.slice(0, 2).toLowerCase() === searchText) {
        // console.log('item:', item.slice(3))
        return item.slice(3);
      }
    });
  }

}
