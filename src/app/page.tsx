'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllExams } from '@/lib/utils/exams';
import { IExam } from '@/types/IExam';

function formatExamDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return [minutes > 0 && `${minutes} мин`, remainingSeconds > 0 && `${remainingSeconds} сек`]
    .filter(Boolean)
    .join(' ') || '0 сек';
}

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
    <div className="grid h-[90%] w-full auto-rows-min grid-cols-1 content-start gap-4 overflow-y-auto pb-6 md:grid-cols-2">
      {exams.length ? (
        exams
          .toSorted((a, b) => a.name.localeCompare(b.name))
          .map((exam) => (
            <Link
              href={`/${exam._id}`}
              key={exam._id}
              className="flex min-h-[160px] min-w-0 flex-col justify-between gap-3 rounded-2xl border border-[#d9e8dc] bg-white p-5 shadow-[0_6px_24px_rgba(23,72,35,0.06)] transition-[background-color,border-color,box-shadow] hover:border-[#43be54] hover:bg-[#f8fdf9] hover:shadow-[0_10px_30px_rgba(23,72,35,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#43be54]"
            >
              <span className="min-w-0 break-words text-xl font-semibold leading-snug text-[#172b1b] [overflow-wrap:anywhere]">
                {exam.name}
              </span>
              <span className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#56705b]">
                <span>Время: {formatExamDuration(exam.availableTime)}</span>
                <span>Вопросов: {exam.questionsLimit}</span>
              </span>
            </Link>
          ))
      ) : (
        <div className="text-xl">Экзамены не найдены</div>
      )}
    </div>
  );
}
