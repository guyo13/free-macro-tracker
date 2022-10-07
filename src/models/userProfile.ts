import {
  convertBodyWeightToKg,
  convertHeightToCm,
  katchMcArdle,
  mifflinStJeor,
} from "../utils/calculations";
import { isPercent, isPositiveNumber, isString } from "../utils/utils";
import type { IMacroSplit } from "./macroSplit";
import MacroSplit from "./macroSplit";
import { validateRecord, type RecordId } from "./record";
import type IDBRecord from "./record";

export enum BodyWeightUnits {
  Kg = " Kg",
  Lbs = "Lbs",
}
export enum BodyHeightUnits {
  Cm = " Cm",
  Inch = "Inch",
}
export enum UserGender {
  Male = "Male",
  Female = "Female",
}
export enum EnergyConsumptionFormula {
  KM = "Katch-McArdle",
  MSJ = "Mifflin-St Jeor",
}
export enum UserActivityLevel {
  Sedentary = "Sedentary",
  Light = "Light",
  Moderate = "Moderate",
  High = "High",
  Very_High = "Very High",
  Custom = "Custom",
}

export interface IUserProfile extends IDBRecord {
  profile_id: RecordId;
  name?: string;
  age: number;
  sex: UserGender;
  bodyWeight: number;
  bodyWeightUnits: BodyWeightUnits; // TODO - Use unit names from the default unit chart
  bodyfat?: number;
  height: number;
  heightUnits: BodyHeightUnits;
  activityLevel: UserActivityLevel;
  activityMultiplier: number;
  formula: EnergyConsumptionFormula;
  bmr: number;
  tdee: number;
  macroSplit?: IMacroSplit;
}

export default class UserProfile implements IUserProfile {
  readonly profile_id: RecordId;
  readonly name?: string;
  readonly age: number;
  readonly sex: UserGender;
  readonly bodyWeight: number;
  readonly bodyWeightUnits: BodyWeightUnits;
  readonly bodyfat?: number;
  readonly height: number;
  readonly heightUnits: BodyHeightUnits;
  readonly activityLevel: UserActivityLevel;
  readonly activityMultiplier: number;
  readonly formula: EnergyConsumptionFormula;
  readonly bmr: number;
  readonly tdee: number;
  readonly lastModified: String;
  readonly tzMinutes: number;
  readonly macroSplit?: IMacroSplit;

  constructor(
    profile_id: RecordId,
    age: number,
    sex: UserGender,
    bodyWeight: number,
    bodyWeightUnits: BodyWeightUnits,
    height: number,
    heightUnits: BodyHeightUnits,
    activityLevel: UserActivityLevel,
    activityMultiplier: number,
    name?: string,
    bodyfat?: number,
    lastModified?: String,
    tzMinutes?: number,
    macroSplit?: IMacroSplit
  ) {
    UserProfile.validate(
      profile_id,
      age,
      sex,
      bodyWeight,
      bodyWeightUnits,
      height,
      heightUnits,
      activityLevel,
      activityMultiplier,
      name,
      bodyfat,
      lastModified,
      tzMinutes,
      macroSplit
    );
    this.profile_id = profile_id;
    this.name = name;
    this.bodyWeight = bodyWeight;
    this.bodyWeightUnits = bodyWeightUnits;
    this.height = height;
    this.heightUnits = heightUnits;
    this.age = age;
    this.sex = sex;
    this.bodyfat = bodyfat ?? null;
    this.activityLevel = activityLevel;
    this.activityMultiplier = activityMultiplier;
    this.lastModified = lastModified;
    this.tzMinutes = tzMinutes;
    this.macroSplit = macroSplit;

    const bodyWeightKg = convertBodyWeightToKg(bodyWeight, bodyWeightUnits);
    const heightCm = convertHeightToCm(height, heightUnits);
    if (bodyfat) {
      const bodyfatReal = bodyfat / 100;
      this.formula = EnergyConsumptionFormula.KM;
      this.bmr = katchMcArdle(bodyWeightKg, bodyfatReal);
    } else {
      this.formula = EnergyConsumptionFormula.MSJ;
      this.bmr = mifflinStJeor(bodyWeightKg, heightCm, age, sex);
    }
    this.tdee = this.bmr * activityMultiplier;
  }

  get id(): RecordId {
    return this.profile_id;
  }

  static from(userProfile: IUserProfile): UserProfile {
    return this.fromObject(userProfile);
  }

  static fromObject(object: any): UserProfile {
    const {
      profile_id,
      age,
      sex,
      bodyWeight,
      bodyWeightUnits,
      height,
      heightUnits,
      activityLevel,
      activityMultiplier,
      name,
      bodyfat,
      lastModified,
      tzMinutes,
      macroSplit,
    } = object;
    return new this(
      profile_id,
      age,
      sex,
      bodyWeight,
      bodyWeightUnits,
      height,
      heightUnits,
      activityLevel,
      activityMultiplier,
      name,
      bodyfat,
      lastModified,
      tzMinutes,
      macroSplit
    );
  }

  static validate(
    profile_id: any,
    age: any,
    sex: any,
    bodyWeight: any,
    bodyWeightUnits: any,
    height: any,
    heightUnits: any,
    activityLevel: any,
    activityMultiplier: any,
    name?: any,
    bodyfat?: any,
    lastModified?: any,
    tzMinutes?: any,
    macroSplit?: any
  ) {
    validateRecord(profile_id, lastModified, tzMinutes);
    if (!Number.isInteger(age) || age < 1) {
      throw `Age must be a valid integer. Got '${age}'`;
    }
    if (!Object.values(UserGender).includes(sex)) {
      throw `Sex must be either Male or Female. Got '${sex}'`;
    }
    if (!isPositiveNumber(bodyWeight)) {
      throw `Bodyweight must be a positive number. Got '${bodyWeight}'`;
    }
    if (!Object.values(BodyWeightUnits).includes(bodyWeightUnits)) {
      throw `Bodyweight must be either Kg or Lbs. Got '${bodyWeightUnits}'`;
    }
    if (!isPositiveNumber(height)) {
      throw `Height must be a positive number. Got '${height}'`;
    }
    if (!Object.values(BodyHeightUnits).includes(heightUnits)) {
      throw `Height units must be either Cm or Inch. Got '${heightUnits}'`;
    }
    if (!Object.values(UserActivityLevel).includes(activityLevel)) {
      throw `Invalid Activity Level. Got '${activityLevel}'`;
    }
    if (!isPositiveNumber(activityMultiplier)) {
      throw `Activity Multiplier must be a positive number. Got '${activityMultiplier}'`;
    }
    if (name && !isString(name)) {
      throw "Invalid name.";
    }
    if (bodyfat && (!Number.isFinite(bodyfat) || !isPercent(bodyfat))) {
      throw `Body fat must be a valid percent. Got '${bodyfat}'`;
    }
    const { Calories, Protein, Carbohydrate, Fat } = macroSplit;
    MacroSplit.validate(Calories, Protein, Carbohydrate, Fat);
  }
}
