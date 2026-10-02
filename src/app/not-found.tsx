import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex w-full flex-col items-start gap-5">
      <h1 className="text-4xl max-[600px]:text-2xl">Страница не найдена</h1>
      <p className="text-xl max-[600px]:text-base">
        Проверьте адрес страницы или вернитесь к списку экзаменов.
      </p>
      <Link href="/" className="text-xl underline max-[600px]:text-base">
        На главную
      </Link>
    </div>
  );
}
