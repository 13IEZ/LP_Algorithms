import { Weapon } from "./Weapon";

export class Sword extends Weapon {
  constructor(baseDamage: number, baseDurability: number, value: number, weight: number) {
    super('sword', baseDamage, baseDurability, value, weight);
  }

  polish(): void {
    const maximumDamageModifier = (this.baseDamage * 25) / 100;
    const newDamageModifier = this.damageModifier + Weapon.MODIFIER_CHANGE_RATE;

    const maximumEffectiveDamage = this.baseDamage + maximumDamageModifier;
    const currentEffectiveDamage = super.getEffectiveDamage();

    if (newDamageModifier > maximumDamageModifier) {
      this.damageModifier = maximumDamageModifier;
    } else if (currentEffectiveDamage < maximumEffectiveDamage) {
      this.damageModifier = newDamageModifier;
    }
  }
}