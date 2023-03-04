import { ItemComparator } from "./ItemComparator";
import { Item } from "./Item";

export class ItemWeightComparator implements ItemComparator {
  compare(first: Item, second: Item): number {
    if (first.weight > second.weight) {
      return 1;
    }
    if (first.weight < second.weight) {
      return -1;
    }

    return first.compareTo(second);
  }
}