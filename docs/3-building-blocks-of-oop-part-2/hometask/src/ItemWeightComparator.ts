import { ItemComparator } from "./ItemComparator";
import { Item } from "./Item";

export class ItemWeightComparator implements ItemComparator {
  compare(first: Item, second: Item): number {
    if(first.weight !== second.weight) return first.weight > second.weight ? 1 : -1;
    return first.compareTo(second);
  }
}