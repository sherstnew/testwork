'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllExams } from '@/lib/utils/exams';
import { IExam } from '@/types/IExam';

export default function ExamsPage() {
  const [exams, setExams] = useState<IExam[]>();

  useEffect(() => {
    getAllExams()
      .then((allExams) => {
        setExams(allExams ?? []);
      })
      .catch((error) => {
        console.log(error);
        setExams([]);
      });
  }, []);

  if (!exams) {
    return 'Загрузка...';
  }

  return (
    <div className="flex h-[90%] w-full flex-wrap content-start items-start justify-start gap-5 overflow-y-auto">
      {exams.length ? (
        exams
          .toSorted((a, b) => a.name.localeCompare(b.name))
          .map((exam) => (
            <Link href={`/${exam._id}`} key={exam._id} className="w-full text-xl">
              - {exam.name}
            </Link>
          ))
      ) : (
        <div className="text-xl">Экзамены не найдены</div>
      )}
    </div>
  );
}
