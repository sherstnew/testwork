"use client";

import { IRating } from "@/types/IRating";
import { formRating } from "@/lib/utils/rating";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const paramClassName =
    "flex min-w-0 items-start justify-center text-center";
const ratingGridClassName =
    "grid w-full grid-cols-[64px_minmax(220px,520px)_86px_86px] gap-x-4 max-[600px]:grid-cols-[42px_minmax(0,1fr)_54px_58px] max-[600px]:gap-x-1";
const nameClassName =
    "min-w-0 break-words text-left [overflow-wrap:anywhere] max-[600px]:text-center";
const headerClassName =
    "border-b border-[#d8d8d8] pb-2 text-base text-[#555555] max-[600px]:text-sm";
const rowClassName =
    "border-b border-[#e3e3e3] py-3 text-xl last:border-b-0 max-[600px]:py-3 max-[600px]:text-base";

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
        <div className="flex h-full w-fit max-w-full flex-col content-start items-start justify-start max-[600px]:w-full">
            {rating && rating.length > 0 ? (
                <>
                    <div className={`${ratingGridClassName} ${headerClassName}`}>
                        <span className={paramClassName}>Место</span>
                        <span className="min-w-0 text-left max-[600px]:text-center">
                            Имя
                        </span>
                        <span className={paramClassName}>Процент</span>
                        <span className={paramClassName}>Время</span>
                    </div>
                    <div className="flex h-[90%] w-full flex-col overflow-y-auto">
                        {rating.map((ratingItem: IRating, index: number) => (
                            <div
                                className={`${ratingGridClassName} ${rowClassName}`}
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
