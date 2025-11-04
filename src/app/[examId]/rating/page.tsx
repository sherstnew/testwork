'use client'

import styles from './page.module.scss'
import { IRating } from '@/types/IRating';
import { formRating } from '@/lib/utils/formRating';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RatingPage() {

  const [rating, setRating] = useState<IRating[]>([]);

  const { examId } = useParams();

  useEffect(() => {
    formRating(examId)
    .then(ratingData => {
      setRating(ratingData.sort((a, b) => {
        if (a.rightAnswersPercent > b.rightAnswersPercent) {
          return -1;
        };
        if (a.rightAnswersPercent < b.rightAnswersPercent) {
          return 1;
        }
        return 0;
      }));
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

  return (
    <div className={styles.rating}>
      {
        rating.length > 0 ?
        <>
          <div className={styles.rating__header}>
            <span className={styles.param}>Место</span>
            <span className={styles.param}>Имя</span>
            <span className={styles.param}>Процент</span>
            <span className={styles.param}>Время</span>
          </div>
          <div className={styles.rating__list}>
            {
              rating.map((ratingItem: IRating, index: number) => (
                <div className={styles.list__item} key={index}>
                  <span className={styles.param}>{String(index + 1)}</span>
                  <span className={styles.param}>{ratingItem.name}</span>
                  <span className={styles.param}>{ratingItem.rightAnswersPercent}</span>
                  <span className={styles.param}>{`${String(Math.floor((600 - Number(ratingItem.averageTime)) / 60)).padStart(2, '0')}:${String((600 - Number(ratingItem.averageTime)) % 60).padStart(2, '0')}`}</span>
                </div>
              ))
            }
          </div>
        </>
        :
        'Загрузка...  (или же результатов пока нет)'
      }
    </div>
  )
}