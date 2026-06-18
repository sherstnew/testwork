"use client";

import { getExam } from "@/lib/utils/exams";
import { finishTest, loadTest, startTest, updateTest } from "@/lib/utils/tests";
import { useCallback, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { IQuestion } from "@/types/IQuestion";
import { useParams } from "next/navigation";
import { IExam } from "@/types/IExam";
import { IResult } from "@/types/IResult";
import NotFoundPage from "../not-found";
import moment from "moment";

moment.locale("ru");
const buttonClassName =
    "mt-[30px] h-10 w-[200px] cursor-pointer rounded-[10px] border-0 bg-[#43be54] text-lg text-white outline-none disabled:cursor-default";
const sectionClassName = "w-full";
const optionClassName =
    "flex min-h-[58px] w-full cursor-pointer items-center gap-4 rounded-lg border border-[#d8d8d8] bg-white px-4 py-3 text-xl transition-colors hover:border-[#43be54] max-[600px]:min-h-[52px] max-[600px]:gap-3 max-[600px]:px-3 max-[600px]:py-2.5 max-[600px]:text-base";
const selectedOptionClassName = "border-[#43be54] bg-[#eef9f0]";

export default function HomePage() {
    const [cookies, setCookies] = useCookies();
    const [questions, setQuestions] = useState<IQuestion[]>([]);
    const [result, setResult] = useState<number>(0);
    const [time, setTime] = useState<number>(-1);

    const [currentExam, setCurrentExam] = useState<IExam>();

    const [initialLength, setInitialLength] = useState(0);

    const [name, setName] = useState("");

    const [answer, setAnswer] = useState<string>("");
    type Incorrect = { text: string; given: string; correct: string };
    const [incorrects, setIncorrects] = useState<Incorrect[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const [status, setStatus] = useState<
        "initial" | "progress" | "finished" | "loading"
    >("initial");

    const { examId } = useParams();

    const restartTest = useCallback(() => {
        setQuestions([]);
        setResult(0);
        setInitialLength(0);
        setStatus("initial");
        setCookies("TESTWORK_SESSION_ID", "");
        setName("");
        setTime(-1);
        setIncorrects([]);
        setAnswer("");
    }, [setCookies]);

    useEffect(() => {
        if (time !== -1) {
            const timeoutId = setTimeout(() => {
                if (time === 0) {
                    setSubmitting(true);
                    finishTest(
                        cookies["TESTWORK_SESSION_ID"],
                        result,
                        name,
                        time,
                        examId ?? "",
                    )
                        .then((result: IResult) => {
                            setName(result.name);
                            setStatus("finished");
                        })
                        .catch((error) => {
                            console.log(error);
                            restartTest();
                        })
                        .finally(() => setSubmitting(false));
                } else {
                    setTime((time) => time - 1);
                }
            }, 1000);

            return () => clearTimeout(timeoutId);
        }
    }, [cookies, examId, name, restartTest, result, time]);

    useEffect(() => {
        if (cookies["TESTWORK_SESSION_ID"]) {
            loadTest(cookies["TESTWORK_SESSION_ID"])
                .then((session) => {
                    if (
                        session.examId &&
                        String(session.examId) !== String(examId ?? "")
                    ) {
                        restartTest();
                        return;
                    }

                    setQuestions(session.questions);
                    setName(session.name);
                    setStatus("progress");
                    setInitialLength(
                        session.initialLength ?? session.questions.length,
                    );
                    setTime(session.time ?? 600);
                    setResult(session.result ?? 0);
                    setIncorrects(session.incorrects ?? []);
                    setAnswer(session.selectedAnswer ?? "");
                })
                .catch((error) => {
                    console.log(error);
                    restartTest();
                });
        }
    }, [cookies, examId, restartTest]);

    useEffect(() => {
        getExam(examId ?? "")
            .then((exam: IExam) => {
                if (exam) {
                    setCurrentExam(exam);
                    setStatus((status) =>
                        status === "progress" ? "progress" : "initial",
                    );
                } else {
                    console.log("Cannot get Exam by id");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [examId]);

    const runTest = async () => {
        startTest(name, examId ?? "")
            .then((session) => {
                setCookies("TESTWORK_SESSION_ID", session._id);
                setQuestions(session.questions);
                setResult(session.result ?? 0);
                setName(session.name);
                setInitialLength(
                    session.initialLength ?? session.questions.length,
                );
                setStatus("progress");
                setTime(session.time ?? 600);
                setIncorrects(session.incorrects ?? []);
                setAnswer(session.selectedAnswer ?? "");
            })
            .catch((error) => {
                console.log(error);
                restartTest();
            });
    };

    const selectAnswer = (option: string) => {
        setAnswer(option);

        if (cookies["TESTWORK_SESSION_ID"]) {
            updateTest(cookies["TESTWORK_SESSION_ID"], {
                selectedAnswer: option,
            }).catch((error) => {
                console.log(error);
            });
        }
    };

    const answerQuestion = useCallback(() => {
        if (submitting || !answer || !questions[0]) return;
        setSubmitting(true);

        let res = result;
        let nextIncorrects = incorrects;
        if (questions[0].answer === answer) {
            res += 1;
            setResult(res);
        } else {
            nextIncorrects = [
                ...incorrects,
                {
                    text: questions[0].text,
                    given: answer ?? "",
                    correct: questions[0].answer,
                },
            ];
            setIncorrects(nextIncorrects);
        }

        if (questions.length === 1) {
            // finish test
            finishTest(
                cookies["TESTWORK_SESSION_ID"],
                res,
                name,
                time,
                examId ?? "",
            )
                .then((result: IResult) => {
                    setName(result.name);
                    setStatus("finished");
                })
                .catch((error) => {
                    console.log(error);
                    restartTest();
                })
                .finally(() => setSubmitting(false));
        } else {
            const quests = [...questions];
            quests.shift();
            updateTest(cookies["TESTWORK_SESSION_ID"], {
                questions: quests,
                result: res,
                incorrects: nextIncorrects,
                selectedAnswer: "",
            })
                .then(() => {
                    setQuestions(quests);
                    setResult(res);
                    setIncorrects(nextIncorrects);
                    setAnswer("");
                })
                .catch((error) => {
                    console.log(error);
                    restartTest();
                })
                .finally(() => setSubmitting(false));
        }
    }, [
        answer,
        cookies,
        examId,
        incorrects,
        name,
        questions,
        restartTest,
        result,
        submitting,
        time,
    ]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter" && status === "progress" && answer) {
                event.preventDefault();
                answerQuestion();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [answer, answerQuestion, status]);

    const date = new Date();
    const currentQuestionNumber = initialLength - questions.length + 1;
    const progressPercent =
        initialLength > 0 ? (currentQuestionNumber / initialLength) * 100 : 0;
    const questionText = questions[0]?.text ?? "";
    const questionTextClassName =
        questionText.length > 220
            ? "text-xl leading-snug max-[600px]:text-sm"
            : questionText.length > 140
              ? "text-xl leading-snug max-[600px]:text-base"
              : "text-xl leading-snug max-[600px]:text-lg";

    return status === "initial" && currentExam ? (
        <div className="flex flex-wrap items-start justify-start gap-[25px]">
            <span className="w-full text-2xl max-[600px]:text-lg">
                {currentExam.name}
            </span>
            <header className="w-full text-4xl max-[600px]:text-2xl">
                Введите своё имя и фамилию:
            </header>
            <section className={sectionClassName}>
                <input
                    name="name"
                    type="text"
                    className="h-[50px] w-[30%] rounded-[10px] border-0 pl-5 text-lg outline-none placeholder:text-[#5a5a5a] max-[600px]:w-[90%]"
                    placeholder="Введите имя и фамилию"
                    onChange={(event) => setName(event.target.value)}
                />
                <section className={sectionClassName}>
                    <button className={buttonClassName} onClick={runTest}>
                        Начать
                    </button>
                </section>
            </section>
        </div>
    ) : status === "progress" && questions[0] ? (
        <div className="flex h-full w-full max-w-[820px] flex-col">
            <div className="mb-5 flex flex-nowrap items-center justify-between gap-4 text-2xl max-[600px]:mb-3 max-[600px]:text-lg">
                <div>{`${currentQuestionNumber}/${initialLength}`}</div>
                <div
                    className={
                        time <= 30
                            ? "text-[#b00020]"
                            : time <= 120
                              ? "text-[#9a6a00]"
                              : ""
                    }
                >
                    {`${String(Math.floor(time / 60)).padStart(2, "0")}:${String(
                        time % 60,
                    ).padStart(2, "0")}`}
                </div>
            </div>
            <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-[#dedede] max-[600px]:mb-4">
                <div
                    className="h-full rounded-full bg-[#43be54] transition-[width]"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
            <div className="mb-5 flex h-[156px] items-center overflow-hidden rounded-lg bg-white px-5 py-2.5 max-[600px]:h-[124px] max-[600px]:px-4 max-[600px]:py-2">
                <header
                    className={`${questionTextClassName} max-h-full overflow-hidden`}
                >
                    {questionText}
                </header>
            </div>
            <div className="grid w-full grid-cols-1 gap-3">
                {questions[0].options.map((option: string, index: number) => (
                    <label
                        key={index}
                        className={`${optionClassName} ${
                            answer === option ? selectedOptionClassName : ""
                        }`}
                        htmlFor={`option-${index}`}
                    >
                        <input
                            id={`option-${index}`}
                            className="sr-only"
                            type="radio"
                            name="answer"
                            checked={answer === option}
                            onChange={() => selectAnswer(option)}
                        />
                        <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-white transition-colors max-[600px]:h-5 max-[600px]:w-5 ${
                                answer === option
                                    ? "border-[#43be54]"
                                    : "border-[#9a9a9a]"
                            }`}
                        >
                            <span
                                className={`h-3 w-3 rounded-full transition-colors max-[600px]:h-2.5 max-[600px]:w-2.5 ${
                                    answer === option
                                        ? "bg-[#43be54]"
                                        : "bg-[#c7c7c7]"
                                }`}
                            />
                        </span>
                        <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                            {option}
                        </span>
                    </label>
                ))}
            </div>
            <button
                className={`${buttonClassName} max-[600px]:mt-5 max-[600px]:w-full`}
                onClick={answerQuestion}
                disabled={submitting || !answer}
            >
                Ответить
            </button>
        </div>
    ) : status === "finished" ? (
        <div>
            <div className="text-[32px]">Ваш результат:</div>
            <div className="text-[64px]">{`${result}/${initialLength}`}</div>
            <div className="text-[32px]">
                {moment(date).format("DD.MM.YYYY")}
            </div>
            <div className="mt-6 w-full max-w-[760px] text-left">
                <div className="mb-3 text-xl font-semibold">
                    Неправильные ответы
                </div>
                {incorrects.length === 0 ? (
                    <div className="rounded-lg border border-[#b9dfbf] bg-[#f3fbf4] px-4 py-3 text-[#2e7d32]">
                        Все ответы верны
                    </div>
                ) : (
                    <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                        {incorrects.map((it, idx) => (
                            <li
                                key={idx}
                                className="rounded-lg border border-[#dddddd] bg-white px-3.5 py-3"
                            >
                                <div className="mb-2.5 grid grid-cols-[24px_minmax(0,1fr)] gap-2.5">
                                    <span className="pt-0.5 text-center text-sm text-[#777777]">
                                        {idx + 1}
                                    </span>
                                    <div className="min-w-0 break-words font-semibold leading-snug [overflow-wrap:anywhere]">
                                        {it.text}
                                    </div>
                                </div>
                                <div className="grid gap-1.5 pl-[34px] text-base max-[600px]:pl-0">
                                    <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                        <span className="text-sm text-[#777777]">
                                            Ваш ответ:
                                        </span>
                                        <span className="min-w-0 break-words text-[#b00020] [overflow-wrap:anywhere]">
                                            {it.given || "—"}
                                        </span>
                                    </div>
                                    <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                        <span className="text-sm text-[#777777]">
                                            Правильно:
                                        </span>
                                        <span className="min-w-0 break-words text-[#2e7d32] [overflow-wrap:anywhere]">
                                            {it.correct}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button className={buttonClassName} onClick={restartTest}>
                Выйти
            </button>
        </div>
    ) : (
        <NotFoundPage />
    );
}
