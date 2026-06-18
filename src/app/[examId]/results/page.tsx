"use client";

import { getResults } from "@/lib/utils/results";
import { useEffect, useState } from "react";
import { IResult } from "@/types/IResult";
import { useParams } from "next/navigation";
import moment from "moment";

moment.locale("ru");

const resultGridClassName =
    "grid min-h-[30px] w-full grid-cols-[minmax(0,1fr)_46px_62px_96px] gap-x-3 text-xl max-[600px]:grid-cols-[minmax(0,1fr)_30px_52px_76px] max-[600px]:gap-x-1 max-[600px]:text-base";
const nameClassName = "min-w-0 break-words [overflow-wrap:anywhere]";
const cellClassName = "flex min-w-0 justify-center";

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
        <div className="h-full w-full overflow-y-auto overflow-x-hidden">
            {results.map((result: IResult, index: number) => (
                <div
                    className={`${resultGridClassName} mb-5 items-start`}
                    key={index}
                >
                    <div className={nameClassName}>{result.name}</div>
                    <div className={cellClassName}>
                        {result.result}
                    </div>
                    <div className={cellClassName}>{`${String(Math.floor((600 - result.time) / 60)).padStart(2, "0")}:${String((600 - result.time) % 60).padStart(2, "0")}`}</div>
                    <div className="flex min-w-0 justify-end">
                        {moment(result.createdAt).format("DD.MM.YYYY")}
                    </div>
                </div>
            ))}
        </div>
    ) : results === null ? (
        "Загрузка..."
    ) : (
        "Результатов пока нет..."
    );
}
