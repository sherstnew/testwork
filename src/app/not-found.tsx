'use client';

import { IExam } from '@/types/IExam';
import styles from './not-found.module.scss';
import { getAllExams } from '@/utils/getAllExams';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NotFoundPage() {
  const [exams, setExams] = useState<IExam[]>();

  useEffect(() => {
    getAllExams()
      .then((allExams) => {
        if (allExams) {
          setExams(allExams);
        } else {
          console.log('Cannot find Exams');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return exams ? (
    <div className={styles.notfound}>
      {exams.map((exam) => (
        <Link href={`/${exam._id}`} key={exam._id} className={styles.exam}>
          - {exam.name}
        </Link>
      ))}
    </div>
  ) : (
    'Загрузка...'
  );
}
