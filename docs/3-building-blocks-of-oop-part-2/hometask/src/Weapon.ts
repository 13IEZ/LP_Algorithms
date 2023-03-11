import { Item } from "./Item";

export abstract class Weapon extends Item {
  static readonly MODIFIER_CHANGE_RATE: number = 0.05;

  baseDamage: number;
  damageModifier: number;
  baseDurability: number;
  durabilityModifier: number;

  constructor(name: string, baseDamage: number, baseDurability: number, value: number, weight: number) {
    super(name, value, weight);
    this.baseDamage = baseDamage;
    this.baseDurability = baseDurability;
    this.damageModifier = 0;
    this.durabilityModifier = 0;
  }

  use(): string {
    const isWillBeBroke = this.baseDurability - Weapon.MODIFIER_CHANGE_RATE < Weapon.MODIFIER_CHANGE_RATE;
    const isBroken = this.baseDurability < Weapon.MODIFIER_CHANGE_RATE;
    const isActive = this.baseDurability > Weapon.MODIFIER_CHANGE_RATE;

    if(isBroken) {
      return `You can't use the ${this.name}, it is broken.`;
    }

    if(isWillBeBroke) {
      this.baseDurability -= Weapon.MODIFIER_CHANGE_RATE;
      return `You use the ${this.name}, dealing ${Weapon.MODIFIER_CHANGE_RATE} points of damage.\nThe ${this.name} breaks.`
    }

    if(isActive) {
      this.baseDurability -= Weapon.MODIFIER_CHANGE_RATE;
      return `You use the ${this.name}, dealing ${Weapon.MODIFIER_CHANGE_RATE} points of damage.`;
    }
  }

  toString(): string {
    const damage = this.getEffectiveDamage().toFixed(2);
    const durability = (this.getEffectiveDurability() * 100).toFixed(2);
    return `${super.toString()}, Damage: ${damage}, Durability: ${durability}%`;
  }

  getEffectiveDamage(): number {
    return this.damageModifier + this.baseDamage;
  }

  getEffectiveDurability(): number
  getEffectiveDurability(modifier: number): number
  getEffectiveDurability(modifier?: number): number {
    if(modifier) {
      return this.baseDurability + modifier;
    }
    return this.baseDurability + this.durabilityModifier;
  }
}
