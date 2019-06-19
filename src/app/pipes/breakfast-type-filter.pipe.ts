import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'breakfastTypeFilter'
})
export class BreakfastTypeFilterPipe implements PipeTransform {

  transform(items: any[], types: string): any[] {
    if (!types || types.length === 0) return items;
    console.log("items:",items[0].breakfast_type);
    console.log("types:",types);
    // return items.filter(item => types.includes(item.breakfast_type.id));
    return items.filter(item => types.indexOf(item.breakfast_type.id) === 0);
  }

}
