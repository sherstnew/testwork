import type { Metadata } from "next";
import { Jost  } from "next/font/google";
import styles from './styles/layout.module.scss';
import "./styles/globals.css";

const font = Jost({ subsets: ["cyrillic"] });

export const metadata: Metadata = {
  title: "Тест",
  description: "Тестирующая система",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <header className={styles.header}>Тест</header>
        <main className={styles.main}>
          {children}
        </main>
        <footer className={styles.footer}>Буденко Т.А., Шерстнев Д.В., 2024</footer>
      </body>
    </html>
  );
}
