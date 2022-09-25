export enum UnitType {
  Mass = "mass",
  Volume = "volume",
  Arbitrary = "arbitrary",
}
export interface Unit {
  readonly name: string;
  readonly description: string;
  readonly type: UnitType;
  readonly value_in_grams: number; // TODO - change to camel case and migrate db
  readonly value_in_ml: number;
}
