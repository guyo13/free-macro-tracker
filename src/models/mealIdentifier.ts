export interface IMealIdentifier {
  meal_year: number;
  meal_month: number;
  meal_day: number;
  profile_id: number;
}

export default class MealIdentifier implements IMealIdentifier {
  readonly meal_year: number;
  readonly meal_month: number;
  readonly meal_day: number;
  readonly profile_id: number;

  constructor(
    meal_year: number,
    meal_month: number,
    meal_day: number,
    profile_id: number
  ) {
    MealIdentifier.valiadate(meal_year, meal_month, meal_day, profile_id);
    this.meal_year = meal_year;
    this.meal_month = meal_month;
    this.meal_day = meal_day;
    this.profile_id = profile_id;
  }

  static from(mealIdentifier: IMealIdentifier) {
    const { meal_year, meal_month, meal_day, profile_id } = mealIdentifier;
    return new this(meal_year, meal_month, meal_day, profile_id);
  }

  static fromObject(object: any) {
    const { meal_year, meal_month, meal_day, profile_id } = object;
    return new this(meal_year, meal_month, meal_day, profile_id);
  }

  static valiadate(
    meal_year: any,
    meal_month: any,
    meal_day: any,
    profile_id: any
  ) {
    if (!Number.isInteger(meal_year) || meal_year < 0) {
      throw `Meal Year must be a positive integer. Got '${meal_year}'`;
    }
    if (!Number.isInteger(meal_month) || meal_month < 0 || meal_month > 11) {
      throw `Meal Month must be a valid Month number. Got '${meal_month}'`;
    }
    if (!Number.isInteger(meal_day) || meal_day < 1 || meal_day > 31) {
      throw `Meal Day must be an integer in range of 1-31. Got '${meal_day}'`;
    }
    if (!Number.isInteger(profile_id)) {
      throw `Profile ID must be a valid integer. Got '${profile_id}'`;
    }
  }
}
