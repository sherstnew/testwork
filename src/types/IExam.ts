import { IQuestion } from './IQuestion';
import { IResult } from './IResult';

export interface IExam {
  _id?: string;
  name: string;
  questions: IQuestion[];
  results: IResult[];
  questionsLimit: number;
  availableTime: number;
}