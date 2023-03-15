import { Consumable } from "./Consumable";

export class Pizza extends Consumable {
  readonly numberOfSlices;
  numberOfEatenSlices: number = 0;

  constructor(value: number, weight: number, numberOfSlices: number, isSpoiled?: boolean) {
    super('pizza', value, weight, isSpoiled);
    this.numberOfSlices = numberOfSlices;
  }

  getNumberOfEatenSlices(): number {
    return this.numberOfEatenSlices;
  }

  use(): string {
    if(!this.numberOfSlices || this.numberOfSlices === this.numberOfEatenSlices) return "There's nothing left of the pizza to consume.";
    if(this.numberOfSlices) {
      ++this.numberOfEatenSlices;
      return "You consumed a slice of the pizza.";
    }
  }
}
