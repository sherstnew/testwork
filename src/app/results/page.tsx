'use client'

import styles from './page.module.scss';
import { getResults } from './../../utils/getResults';
import { useEffect, useState } from 'react';
import { IResult } from '@/types/IResult';
import moment from 'moment';

moment.locale('ru');

export default function ResultsPage() {

  const [results, setResults] = useState<IResult[]>([]);

  useEffect(() => {
    getResults()
    .then(res => {
      setResults(res);
    })
    .catch(error => {
      console.log(error);
    })
  }, []);

  return (
    results.length !== 0
    ?
    <div className={styles.results}>
      {
        results.map((result: IResult, index: number) => (
          <div className={styles.result} key={index}>
            <div className={styles.name}>{result.name}</div>
            <div className={styles.result}>{result.result}</div>
            <div className={styles.time}>{`${String(Math.floor(result.time / 60)).padStart(2, '0')}:${String(result.time % 60).padStart(2, '0')}`}</div>
            <div className={styles.date}>{moment(result.createdAt).format('DD.MM.YYYY')}</div>
          </div>
        ))
      }
    </div>
    :
    'Загрузка...'
  )
}