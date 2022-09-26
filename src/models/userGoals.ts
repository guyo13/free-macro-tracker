export interface IUserGoals {
  profile_id: number;
  year: number;
  month: number;
  day: number;
}

export default class UserGoals implements IUserGoals {
  readonly profile_id: number;
  readonly year: number;
  readonly month: number;
  readonly day: number;

  constructor(profile_id: number, year: number, month: number, day: number) {
    UserGoals.valiadate(profile_id, year, month, day);
    this.profile_id = profile_id;
    this.year = year;
    this.month = month;
    this.day = day;
  }

  static from(userGoals: IUserGoals): UserGoals {
    return this.fromObject(userGoals);
  }

  static fromObject(object: any): UserGoals {
    const { profile_id, year, month, day } = object;
    return new this(profile_id, year, month, day);
  }

  static valiadate(profile_id: any, year: any, month: any, day: any) {
    if (!Number.isInteger(year) || year < 0) {
      throw `Year must be a positive integer. Got '${year}'`;
    }
    if (!Number.isInteger(month) || month < 0 || month > 11) {
      throw `Month must be a valid Month number. Got '${month}'`;
    }
    if (!Number.isInteger(day) || day < 1 || day > 31) {
      throw `Day must be an integer in range of 1-31. Got '${day}'`;
    }
    if (!Number.isInteger(profile_id)) {
      throw `Profile ID must be a valid integer. Got '${profile_id}'`;
    }
  }
}
