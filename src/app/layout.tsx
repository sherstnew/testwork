'use client';

import { useParams } from 'next/navigation';
import localFont from 'next/font/local';
import './globals.css';
import Link from 'next/link';

const font = localFont({
  src: '../lib/fonts/Pliant-VariableFont_wdth,wght.ttf',
  display: 'swap',
});
const linkClassName = 'max-[600px]:w-[40%]';

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
        <header className="flex w-[80%] h-[20%] items-center content-center justify-start gap-[50px] text-4xl font-medium max-[600px]:flex-wrap max-[600px]:justify-between max-[600px]:gap-2.5 max-[600px]:text-xl max-[600px]:font-normal max-[600px]:underline">
          <Link href={`/`} className={linkClassName}>
            Главная
          </Link>
          {examId ? (
            <>
              <Link href={`/${examId ? examId : ''}`} className={linkClassName}>
                Тест
              </Link>
              <Link
                href={`/${examId ? examId : 'test'}/results`}
                className={linkClassName}
              >
                Результаты
              </Link>
              <Link
                href={`/${examId ? examId : 'test'}/rating`}
                className={linkClassName}
              >
                Рейтинг
              </Link>
            </>
          ) : (
            ''
          )}
        </header>
        <main className="flex min-h-[70%] w-[80%] flex-wrap items-start justify-start max-[600px]:w-[90%]">
          {children}
        </main>
        <footer className="flex h-[10%] w-[80%] items-center justify-start text-[#adadad]">
          {process.env.NEXT_PUBLIC_CREDITS}
        </footer>
      </body>
    </html>
  );
}
