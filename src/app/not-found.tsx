'use client';

import { IExam } from '@/types/IExam';
import { getAllExams } from '@/lib/utils/exams';
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
    <div className="flex h-[90%] w-full flex-wrap content-start items-start justify-start gap-5 overflow-y-auto">
      {exams.toSorted((a, b) => a.name.localeCompare(b.name)).map((exam) => (
        <Link href={`/${exam._id}`} key={exam._id} className="w-full text-xl">
          - {exam.name}
        </Link>
      ))}
    </div>
  ) : (
    'Загрузка...'
  );
}
