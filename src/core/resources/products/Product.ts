import { Resource, ResourceT } from '../Resource';
import { Recipe } from './Recipe';

export type ProductType = 'iron-ingot';

export class Product implements ResourceT<ProductType> {
  type: ProductType;
  cost: number;
  recipe: Recipe;

  constructor(type: ProductType, cost: number = 0) {
    this.type = type;
    this.cost = cost;
    this.recipe = new Recipe();
  }
}
