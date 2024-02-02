import { IResult } from './IResult';

export interface IRating {
  name: IResult['name'];
  rightAnswersPercent: string;
  averageTime: string;
}