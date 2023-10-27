import enumify from "../utils/enumify";

enum ConsumableType {
  food = "Food Item",
  recipe = "Recipe Item",
}

export const { isValid } = enumify(ConsumableType);

export default ConsumableType;
