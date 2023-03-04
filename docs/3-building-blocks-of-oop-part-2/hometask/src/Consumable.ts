import { Item } from "./Item";

export class Consumable extends Item {
  isConsumed: boolean = false;
  isSpoiled: boolean = false;

  constructor(name: string, value: number, weight: number, isSpoiled?: boolean) {
    super(name, value, weight);
    this.isSpoiled = isSpoiled;
  }

  use(): string {
    if(this.isConsumed) return `There's nothing left of the ${this.name} to consume.`;
    if(this.isSpoiled) return `You consumed the ${this.name}.\nYou feel sick.`;
    return `You consumed the ${this.name}.`;
  }
}