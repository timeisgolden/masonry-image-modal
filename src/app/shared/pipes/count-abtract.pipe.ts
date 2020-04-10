import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countAbtract'
})
export class CountAbtractPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    if (value >= 1000 && value < 1000000) {
      return Math.round(value / 1000 * 10) / 10 + 'K'
    }else if (value >= 1000000) {
      return Math.round(value / 1000000 * 10) / 10 + 'M'
    }

    return value;
  }

}
