import { Item } from "./Item";

export class Consumable extends Item {
  isConsumed: boolean = false;
  isSpoiled: boolean = false;

  constructor(name: string, value: number, weight: number, isSpoiled?: boolean) {
    super(name, value, weight);
    this.isSpoiled = isSpoiled;
    this.isConsumed = false;
  }

  use(): string {
    const defaultResult = `You consumed the ${this.name}.`;
    if(this.isConsumed) return `There's nothing left of the ${this.name} to consume.`;
    this.isConsumed = true;
    if(this.isSpoiled) return `${defaultResult}\nYou feel sick.`;
    return defaultResult;
  }
}