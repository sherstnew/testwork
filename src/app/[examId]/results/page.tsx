"use client";

import { getResults } from "@/lib/utils/results";
import { useEffect, useState } from "react";
import { IResult } from "@/types/IResult";
import { useParams } from "next/navigation";
import moment from "moment";

moment.locale("ru");

const resultGridClassName =
    "grid w-full grid-cols-[minmax(220px,520px)_58px_86px_112px] gap-x-4 max-[600px]:grid-cols-[minmax(0,1fr)_30px_52px_76px] max-[600px]:gap-x-1";
const nameClassName = "min-w-0 break-words [overflow-wrap:anywhere]";
const cellClassName = "flex min-w-0 justify-center";
const headerClassName =
    "border-b border-[#d8d8d8] pb-2 text-base text-[#555555] max-[600px]:text-sm";
const rowClassName =
    "border-b border-[#e3e3e3] py-3 text-xl last:border-b-0 max-[600px]:py-3 max-[600px]:text-base";

export default function ResultsPage() {
    const [results, setResults] = useState<IResult[]>([]);

    const { examId } = useParams();

    useEffect(() => {
        getResults(examId ?? "")
            .then((res) => {
                setResults(res);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [examId]);

    return results && results.length !== 0 ? (
        <div className="flex h-full w-fit max-w-full flex-col overflow-x-hidden max-[600px]:w-full">
            <div className={`${resultGridClassName} ${headerClassName}`}>
                <span className="min-w-0 text-left">Имя</span>
                <span className={cellClassName}>Баллы</span>
                <span className={cellClassName}>Время</span>
                <span className="flex min-w-0 justify-end">Дата</span>
            </div>
            <div className="flex h-[90%] w-full flex-col overflow-y-auto">
                {results.map((result: IResult, index: number) => (
                    <div
                        className={`${resultGridClassName} ${rowClassName} items-start`}
                        key={index}
                    >
                        <div className={nameClassName}>{result.name}</div>
                        <div className={cellClassName}>{result.result}</div>
                        <div className={cellClassName}>{`${String(Math.floor((600 - result.time) / 60)).padStart(2, "0")}:${String((600 - result.time) % 60).padStart(2, "0")}`}</div>
                        <div className="flex min-w-0 justify-end">
                            {moment(result.createdAt).format("DD.MM.YYYY")}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ) : results === null ? (
        "Загрузка..."
    ) : (
        "Результатов пока нет..."
    );
}
