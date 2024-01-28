'use client';

import styles from './styles/page.module.scss';
import { Jost } from 'next/font/google';
import { startTest } from '@/utils/startTest';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { loadTest } from '@/utils/loadTest';
import { useLocalStorage } from '@uidotdev/usehooks';
import { finishTest } from '@/utils/finishTest';
import moment from 'moment';

const font = Jost({ subsets: ['cyrillic'] });
moment.locale('ru');

export default function HomePage() {
  const [cookies, setCookies] = useCookies();
  const [questions, saveQuestions] = useLocalStorage<any>('questions', []);
  const [result, saveResult] = useLocalStorage<number>('result', 0);

  const [initialLength, setInitialLength] = useState(0);

  const [name, setName] = useState('');

  const [answer, setAnswer] = useState<string>('');

  const [status, setStatus] = useState<'initial' | 'progress' | 'finished'>(
    'initial'
  );

  useEffect(() => {
    if (cookies['TESTWORK_SESSION_ID']) {
      loadTest(cookies['TESTWORK_SESSION_ID'])
        .then((session) => {
          saveQuestions(session.questions);
          setStatus('progress');
          setInitialLength(session.questions.length);
        })
        .catch((error) => {
          console.log(error);
          restartTest();
        });
    }
  }, []);

  const runTest = async () => {
    startTest(name)
      .then((session) => {
        setCookies('TESTWORK_SESSION_ID', session._id);
        saveQuestions(session.questions);
        saveResult(0);
        setInitialLength(session.questions.length);
        setStatus('progress');
      })
      .catch((error) => {
        console.log(error);
        restartTest();
      });
  }

  const answerQuestion = () => {
    if (questions[0].answer === answer) {
      saveResult(result + 1);
    };

    if (questions.length === 1) {
      // finish test
      finishTest(cookies['TESTWORK_SESSION_ID'], result)
        .then((result: any) => {
          setName(result.name);
          setStatus('finished');
        })
        .catch((error) => {
          console.log(error);
          restartTest();
        });
    } else {
      const quests = questions;
      quests.shift();
      saveQuestions(quests);
    };
  };

  const restartTest = () => {
    saveQuestions([]);
    saveResult(0);
    setInitialLength(0);
    setStatus('initial');
    setCookies('TESTWORK_SESSION_ID', '');
  };

  const date = new Date();

  // написать форму с вопросом и сделать завершение теста

  return status === 'initial' ? (
    <div className={styles.form} onSubmit={runTest}>
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
      <header className={styles.question__header}>{`${initialLength - questions.length + 1}/${initialLength} ${questions[0].text}`}</header>
      <div className={styles.options}>
        {questions[0].options.map((option: string, index: number) => (
          <div key={index} className={styles.options__radio}>
            <input
              className={styles.radio}
              type='radio'
              name={String(index)}
              checked={answer === option}
              onChange={() => setAnswer(option)}
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
      <button className={styles.button} onClick={restartTest}>Выйти</button>
    </div>
  ) : (
    ''
  );
}
