'use client'

import styles from './page.module.scss';
import { getResults } from '../../../utils/getResults';
import { useEffect, useState } from 'react';
import { IResult } from '@/types/IResult';
import { useParams } from 'next/navigation';
import moment from 'moment';

moment.locale('ru');

export default function ResultsPage() {

  const [results, setResults] = useState<IResult[]>([]);

  const { examId } = useParams();

  useEffect(() => {
    getResults(examId)
    .then(res => {
      setResults(res);
    })
    .catch(error => {
      console.log(error);
    })
  }, []);

  return (
    results && results.length !== 0 && results.length
    ?
    <div className={styles.results}>
      {
        results.map((result: IResult, index: number) => (
          <div className={styles.result} key={index}>
            <div className={styles.name}>{result.name}</div>
            <div className={styles.points}>{result.result}</div>
            <div className={styles.time}>{`${String(Math.floor((600 - result.time) / 60)).padStart(2, '0')}:${String((600 - result.time) % 60).padStart(2, '0')}`}</div>
            <div className={styles.date}>{moment(result.createdAt).format('DD.MM.YYYY')}</div>
          </div>
        ))
      }
    </div>
    :
    'Загрузка... (или же результатов пока нет)'
  )
}