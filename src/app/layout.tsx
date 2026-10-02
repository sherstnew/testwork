'use client';

import { useParams, usePathname } from 'next/navigation';
import localFont from 'next/font/local';
import './globals.css';
import Link from 'next/link';

const font = localFont({
  src: '../lib/fonts/Pliant-VariableFont_wdth,wght.ttf',
  display: 'swap',
});
const linkClassName = 'max-[600px]:w-[40%]';
const activeLinkClassName = `${linkClassName} text-[#43be54]`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { examId } = useParams();
  const pathname = usePathname();
  const isActiveLink = (href: string) => pathname === href;

  return (
    <html lang='en'>
      <head>
        <title>Тест</title>
      </head>
      <body className={font.className}>
        <header className="flex w-[80%] h-[20%] items-center content-center justify-start gap-[50px] text-4xl font-medium max-[600px]:flex-wrap max-[600px]:justify-between max-[600px]:gap-2.5 max-[600px]:text-xl max-[600px]:font-normal max-[600px]:underline">
          <Link
            href={`/`}
            className={isActiveLink('/') ? activeLinkClassName : linkClassName}
          >
            Главная
          </Link>
          {examId ? (
            <>
              <Link
                href={`/${examId ? examId : ''}`}
                className={
                  isActiveLink(`/${examId ? examId : ''}`)
                    ? activeLinkClassName
                    : linkClassName
                }
              >
                Тест
              </Link>
              <Link
                href={`/${examId ? examId : 'test'}/results`}
                className={
                  isActiveLink(`/${examId ? examId : 'test'}/results`)
                    ? activeLinkClassName
                    : linkClassName
                }
              >
                Результаты
              </Link>
              <Link
                href={`/${examId ? examId : 'test'}/rating`}
                className={
                  isActiveLink(`/${examId ? examId : 'test'}/rating`)
                    ? activeLinkClassName
                    : linkClassName
                }
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
