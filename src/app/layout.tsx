'use client';

import { useParams } from 'next/navigation';
import { Roboto_Slab } from 'next/font/google';
import styles from './layout.module.scss';
import './globals.css';
import Link from 'next/link';

const font = Roboto_Slab({ subsets: ['cyrillic'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { examId } = useParams();

  return (
    <html lang='en'>
      <head>
        <title>Тест</title>
      </head>
      <body className={font.className}>
        <header className={styles.header}>
          <Link href={`/`} className={styles.link}>
            Главная
          </Link>
          {examId ? (
            <>
              <Link href={`/${examId ? examId : ''}`} className={styles.link}>
                Тест
              </Link>
              <Link
                href={`/${examId ? examId : 'test'}/results`}
                className={styles.link}
              >
                Результаты
              </Link>
              <Link
                href={`/${examId ? examId : 'test'}/rating`}
                className={styles.link}
              >
                Рейтинг
              </Link>
            </>
          ) : (
            ''
          )}
        </header>
        <main className={styles.main}>{children}</main>
        <footer className={styles.footer}>
          Буденко Т.А., Шмелев М.Д., Шерстнев Д.В., 2025
        </footer>
      </body>
    </html>
  );
}
