
import { Injectable } from '@angular/core';

@Injectable()
export class MathUtilitiesService {
  constructor(
  ) {
  }

  /**
   * Return the rounded down value to the nearest digits.
   * Similar to Ms. Excel ROUNDDOWN()
   * https://support.office.com/en-us/article/rounddown-function-2ec94c73-241f-4b01-8c6f-17e6d7968f53
   *
   * floor(3456.7890, 3)  => 3456.789
   * floor(3456.7890, 2)  => 3456.78
   * floor(3456.7890, 1)  => 3456.7
   * floor(3456.7890, 0)  => 3456
   * floor(3456.7890, -1) => 3450
   * floor(3456.7890, -2) => 3400
   * floor(3456.7890, -3) => 3000
   * floor(3456.7890, -4) => 0
   * floor(3456.7890, -5) => 0
   */
  floor(value: number, digits: number) {
    const absoluteNumber = Math.abs(value);
    const multiplier = 10 ** (digits || 0);
    const result = Math.floor(absoluteNumber * multiplier) / multiplier;
    return value < 0 ? -1 * result : result;
  }
}

