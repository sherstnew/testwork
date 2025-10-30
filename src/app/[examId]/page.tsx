'use client';

import styles from './page.module.scss';
import { Roboto_Slab } from 'next/font/google';
import { startTest } from '../../utils/startTest';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { loadTest } from '../../utils/loadTest';
import { finishTest } from '../../utils/finishTest';
import { IQuestion } from '../../types/IQuestion';
import { getExam } from '../../utils/getExam';
import { useParams } from 'next/navigation';
import { IExam } from '../../types/IExam';
import NotFoundPage from '../not-found';
import moment from 'moment';

const font = Roboto_Slab({ subsets: ['cyrillic'] });
moment.locale('ru');

export default function HomePage() {
  const [cookies, setCookies] = useCookies();
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [result, setResult] = useState<number>(0);
  const [time, setTime] = useState<number>(-1);

  const [currentExam, setCurrentExam] = useState<IExam>();

  const [initialLength, setInitialLength] = useState(0);

  const [name, setName] = useState('');

  const [answer, setAnswer] = useState<string>('');

  const [status, setStatus] = useState<'initial' | 'progress' | 'finished' | 'loading'>(
    'initial'
  );

  const { examId } = useParams();

  useEffect(() => {
    if (time !== -1) {
      setTimeout(() => {
        if (time === 0) {
          finishTest(cookies['TESTWORK_SESSION_ID'], result, name, time, examId)
          .then((result: any) => {
            setName(result.name);
            setStatus('finished');
          })
          .catch((error) => {
            console.log(error);
            restartTest();
          });
        } else {
          setTime(time => time - 1);
        };
      }, 1000);
    };
  }, [time]);

  useEffect(() => {
    if (cookies['TESTWORK_SESSION_ID']) {
      loadTest(cookies['TESTWORK_SESSION_ID'])
        .then((session) => {
          setQuestions(session.questions);
          setName(session.name);
          setStatus('progress');
          setInitialLength(session.questions.length);
          setTime(600);
          setResult(0);
        })
        .catch((error) => {
          console.log(error);
          restartTest();
        });
    };
  }, []);

  useEffect(() => {
    getExam(examId).then((exam: IExam) => {
      if (exam) {
        setCurrentExam(exam);
        setStatus(status => status === 'progress' ? 'progress' : 'initial');
      } else {
        console.log('Cannot get Exam by id');
      }
    })
    .catch((error) => {
      console.log(error);
    })
  }, []);

  const runTest = async () => {
    startTest(name, examId)
      .then((session) => {
        setCookies('TESTWORK_SESSION_ID', session._id);
        setQuestions(session.questions);
        setResult(0);
        setName(session.name);
        setInitialLength(session.questions.length);
        setStatus('progress');
        setTime(600);
      })
      .catch((error) => {
        console.log(error);
        restartTest();
      });
  };

  const answerQuestion = () => {
    if (questions[0].answer === answer) {
      setResult((result: number) => result + 1);
    };

    if (questions.length === 1) {
      // finish test
      finishTest(cookies['TESTWORK_SESSION_ID'], result, name, time, examId)
        .then((result: any) => {
          setName(result.name);
          setStatus('finished');
        })
        .catch((error) => {
          console.log(error);
          restartTest();
        });
    } else {
      const quests = [...questions];
      quests.shift();
      setQuestions(quests);
    };
  };

  const restartTest = () => {
    setQuestions([]);
    setResult(0);
    setInitialLength(0);
    setStatus('initial');
    setCookies('TESTWORK_SESSION_ID', '');
    setName('');
    setTime(-1);
  };

  const date = new Date();

  return status === 'initial' && currentExam ? (
    <div className={styles.form}>
      <span className={styles.subheader}>{currentExam.name}</span>
      <header className={styles.header}>Введите своё имя и фамилию:</header>
      <section className={styles.section}>
        <input
          name='name'
          type='text'
          className={styles.input}
          placeholder='Введите имя и фамилию'
          style={font.style}
          onChange={(event) => setName(event.target.value)}
        />
      </section>
      <section className={styles.section}>
        <button className={styles.button} style={font.style} onClick={runTest}>
          Начать
        </button>
      </section>
    </div>
  ) : status === 'progress' && questions[0] ? (
    <div className={styles.question}>
      <div className={styles.info}>
        <div className={styles.questions}>
          {`${initialLength - questions.length + 1}/${initialLength}`}
        </div>
        <div className={styles.time}>
          {`${String(Math.floor(time / 60)).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}`}
        </div>
      </div>
      <header className={styles.question__header}>{`${questions[0].text}`}</header>
      <div className={styles.options}>
        {questions[0].options.map((option: string, index: number) => (
          <div key={index} className={styles.options__radio} onClick={() => setAnswer(option)}>
            <input
              className={styles.radio}
              type='radio'
              name={String(index)}
              checked={answer === option}
              onChange={() => {}}
            />
            <label className={styles.label} htmlFor={String(index)}>
              {option}
            </label>
          </div>
        ))}
      </div>
      <button className={styles.button} onClick={answerQuestion} style={font.style}>Ответить</button>
    </div>
  ) : status === 'finished' ? (
    <div className={styles.result}>
      <div className={styles.result__regular}>Ваш результат:</div>
      <div className={styles.result__points}>{`${result}/${initialLength}`}</div>
      <div className={styles.result__regular}>{moment(date).format('DD.MM.YYYY')}</div>
      <button className={styles.button} onClick={restartTest} style={font.style}>Выйти</button>
    </div>
  ) : (
    <NotFoundPage />
  );
}