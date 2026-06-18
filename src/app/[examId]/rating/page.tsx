"use client";

import { IRating } from "@/types/IRating";
import { formRating } from "@/lib/utils/rating";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const paramClassName =
    "flex min-w-0 items-start justify-center text-center";
const ratingGridClassName =
    "grid w-full grid-cols-[46px_minmax(0,1fr)_64px_64px] gap-x-2 max-[600px]:grid-cols-[42px_minmax(0,1fr)_54px_58px] max-[600px]:gap-x-1";
const nameClassName =
    "min-w-0 break-words text-center [overflow-wrap:anywhere]";

export default function RatingPage() {
    const [rating, setRating] = useState<IRating[] | null>(null);

    const { examId } = useParams();

    useEffect(() => {
        formRating(examId ?? "")
            .then((ratingData) => {
                setRating(
                    ratingData.sort((a, b) => {
                        if (a.rightAnswersPercent > b.rightAnswersPercent) {
                            return -1;
                        }
                        if (a.rightAnswersPercent < b.rightAnswersPercent) {
                            return 1;
                        }
                        return 0;
                    }),
                );
            })
            .catch((err) => {
                console.log(err);
            });
    }, [examId]);

    return (
        <div className="flex h-full w-full flex-wrap content-start items-start justify-start gap-5 max-[600px]:text-base">
            {rating && rating.length > 0 ? (
                <>
                    <div className={ratingGridClassName}>
                        <span className={paramClassName}>Место</span>
                        <span className={paramClassName}>Имя</span>
                        <span className={paramClassName}>Процент</span>
                        <span className={paramClassName}>Время</span>
                    </div>
                    <div className="flex h-[90%] w-full flex-wrap content-start items-start justify-start gap-[30px] overflow-y-auto pr-[30px] max-[600px]:pr-0">
                        {rating.map((ratingItem: IRating, index: number) => (
                            <div
                                className={ratingGridClassName}
                                key={index}
                            >
                                <span className={paramClassName}>
                                    {String(index + 1)}
                                </span>
                                <span className={nameClassName}>
                                    {ratingItem.name}
                                </span>
                                <span className={paramClassName}>
                                    {ratingItem.rightAnswersPercent}
                                </span>
                                <span
                                    className={paramClassName}
                                >{`${String(Math.floor((600 - Number(ratingItem.averageTime)) / 60)).padStart(2, "0")}:${String((600 - Number(ratingItem.averageTime)) % 60).padStart(2, "0")}`}</span>
                            </div>
                        ))}
                    </div>
                </>
            ) : rating === null ? (
                "Загрузка..."
            ) : (
                "Результатов пока нет..."
            )}
        </div>
    );
}
