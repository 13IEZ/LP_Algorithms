import { Comparable } from "./Comparable";

export class Item implements Comparable<Item> {
  readonly name: string;
  readonly id: number;

  value: number;
  weight: number;

  static idCounter: number = 0;

  constructor(name: string, value: number, weight: number) {
    this.name = name;
    this.value = value;
    this.weight = weight;
    this.id = Item.idCounter + 1;
    ++Item.idCounter;
  }


  static resetIdCounter(): void {
    this.idCounter = 0;
  }

  getId(): number {
    return this.id;
  }

  use(): void {}

  toString(): string {
    return `${this.name} - Value: ${this.value.toFixed(2)}, Weight: ${this.weight.toFixed(2)}`
  }

  compareTo(other: Item): number {
    if(this.value > other.value) return 1;
    if(this.value < other.value) return -1;
    if(this.value === other.value && this.name !== other.name) return -1;
    if(this.name === other.name && this.value === other.value) return 0;
  }
}