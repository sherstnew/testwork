import { getResults } from './getResults';
import { IResult } from '@/types/IResult';
import { IRating } from '@/types/IRating';

export const formRating = async (examId: string|string[]) => {
  let results: IResult[] = await getResults(examId);

  let names: string[] = [];
  const resultsByName: IResult[][] = [];

  results = results.map((result) => {
    result.name = result.name.trim();
    return result;
  });

  results.forEach((result: IResult) => {
    if (!names.includes(result.name) && result.name !== 'Аноним') {
      names.push(result.name);
    }
  });

  names.forEach((name: string) => {
    resultsByName.push(
      results.filter((result: IResult) => result.name === name)
    );
  });

  const rating: IRating[] = [];

  for (let i = 0; i < resultsByName.length; i++) {
    const ratingItem: IRating = {
      name: resultsByName[i][0].name,
      rightAnswersPercent: '0',
      averageTime: '0',
    };

    const rightAnswersPercent =
      (resultsByName[i].reduce(
        (accumulator, object) => accumulator + object.result,
        0
      ) /
      (resultsByName[i].length * 20)
      * 100
    ).toFixed();

    const averageTime = (
      resultsByName[i].reduce(
        (accumulator, object) => accumulator + object.time,
        0
      ) / resultsByName[i].length
    ).toFixed();

    ratingItem.rightAnswersPercent = rightAnswersPercent;
    ratingItem.averageTime = averageTime;

    rating.push(ratingItem);
  }

  return rating;
};
