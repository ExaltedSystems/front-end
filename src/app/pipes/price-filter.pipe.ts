import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFilter'
})
export class PriceFilterPipe implements PipeTransform {

  transform(items: any[], types: string[]): any[] {
    if (!types || types.length === 0) return items;
    return items.filter(item => item.price >= types[0] && item.price <= types[1]);
  }

}
