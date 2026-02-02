import { useState, useEffect, useCallback } from 'react';
import './App.css';

interface TestSettings {
  numberFrom: number;
  numberTo: number;
  questionCount: number;
  mode: 'learning' | 'exam';
  timeLimit?: number;
}

interface Question {
  num1: number;
  num2: number;
  correctAnswer: number;
}

interface TestResult {
  question: Question;
  userAnswer: number | null;
  isCorrect: boolean;
  timeSpent: number;
}

const StartScreen = ({ onStart }: { onStart: (settings: TestSettings) => void }) => {
  const [numberFrom, setNumberFrom] = useState(1);
  const [numberTo, setNumberTo] = useState(10);
  const [questionCount, setQuestionCount] = useState(10);
  const [mode, setMode] = useState<'learning' | 'exam'>('learning');
  const [timeLimit, setTimeLimit] = useState<number | undefined>(undefined);

  return (
    <div className="fade-in" style={{ 
      padding: '15px', 
      maxWidth: '400px', 
      margin: '0 auto', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      minHeight: '100vh', 
      color: 'white',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="slide-in" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ marginBottom: '8px' }}>📚 Таблица умножения</h1>
        <p style={{ fontSize: '0.9rem' }}>Изучай математику легко и весело!</p>
      </div>
      
      <div className="scale-in card-transition" style={{ 
        background: 'rgba(255, 255, 255, 0.95)', 
        borderRadius: '15px', 
        padding: '15px', 
        color: '#333',
        marginBottom: '10px',
        flex: 1,
        overflow: 'auto'
      }}>
        <h2 style={{ marginBottom: '15px' }}>⚙️ Настройки</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            🎯 С какой цифры:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
            {[1,2,3,4,5,6,7,8,9,10].map(num => (
              <button
                key={num}
                className="button-transition"
                style={{
                  padding: '8px',
                  border: numberFrom === num ? '2px solid #3182ce' : '2px solid transparent',
                  borderRadius: '8px',
                  background: numberFrom === num ? '#4299e1' : 'white',
                  color: numberFrom === num ? 'white' : '#2d3748',
                  cursor: num > numberTo ? 'not-allowed' : 'pointer',
                  opacity: num > numberTo ? 0.4 : 1
                }}
                onClick={() => num <= numberTo && setNumberFrom(num)}
                disabled={num > numberTo}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            🏁 До какой цифры:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
            {[1,2,3,4,5,6,7,8,9,10].map(num => (
              <button
                key={num}
                className="button-transition"
                style={{
                  padding: '8px',
                  border: numberTo === num ? '2px solid #3182ce' : '2px solid transparent',
                  borderRadius: '8px',
                  background: numberTo === num ? '#4299e1' : 'white',
                  color: numberTo === num ? 'white' : '#2d3748',
                  cursor: num >= numberFrom ? 'pointer' : 'not-allowed',
                  opacity: num < numberFrom ? 0.4 : 1
                }}
                onClick={() => num >= numberFrom && setNumberTo(num)}
                disabled={num < numberFrom}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            📊 Количество вопросов:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {[5,10,15,20].map(count => (
              <button
                key={count}
                className="button-transition"
                style={{
                  padding: '10px',
                  border: questionCount === count ? '2px solid #3182ce' : '2px solid transparent',
                  borderRadius: '10px',
                  background: questionCount === count ? '#4299e1' : 'white',
                  color: questionCount === count ? 'white' : '#2d3748',
                  cursor: 'pointer'
                }}
                onClick={() => setQuestionCount(count)}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>⏱️ Таймер:</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            <button
              className="button-transition"
              style={{
                padding: '10px',
                border: timeLimit === undefined ? '2px solid #3182ce' : '2px solid transparent',
                borderRadius: '10px',
                background: timeLimit === undefined ? '#4299e1' : 'white',
                color: timeLimit === undefined ? 'white' : '#2d3748',
                cursor: 'pointer'
              }}
              onClick={() => setTimeLimit(undefined)}
            >
              Откл
            </button>
            {[5, 10, 15].map(time => (
              <button
                key={time}
                className="button-transition"
                style={{
                  padding: '10px',
                  border: timeLimit === time ? '2px solid #3182ce' : '2px solid transparent',
                  borderRadius: '10px',
                  background: timeLimit === time ? '#4299e1' : 'white',
                  color: timeLimit === time ? 'white' : '#2d3748',
                  cursor: 'pointer'
                }}
                onClick={() => setTimeLimit(time)}
              >
                {time}с
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            🎮 Режим:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              className="button-transition"
              style={{
                padding: '12px',
                border: mode === 'learning' ? '2px solid #38a169' : '2px solid transparent',
                borderRadius: '10px',
                background: mode === 'learning' ? '#48bb78' : 'white',
                color: mode === 'learning' ? 'white' : '#2d3748',
                cursor: 'pointer'
              }}
              onClick={() => setMode('learning')}
            >
              📖 Обучение
            </button>
            <button
              className="button-transition"
              style={{
                padding: '12px',
                border: mode === 'exam' ? '2px solid #38a169' : '2px solid transparent',
                borderRadius: '10px',
                background: mode === 'exam' ? '#48bb78' : 'white',
                color: mode === 'exam' ? 'white' : '#2d3748',
                cursor: 'pointer'
              }}
              onClick={() => setMode('exam')}
            >
              🎓 Экзамен
            </button>
          </div>
        </div>

        <button 
          className="button-transition bounce"
          style={{
            width: '100%',
            padding: '15px',
            background: 'linear-gradient(135deg, #4299e1, #3182ce)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer'
          }}
          onClick={() => onStart({ numberFrom, numberTo, questionCount, mode, timeLimit })}
        >
          🚀 Начать тест
        </button>
      </div>

      <div className="fade-in" style={{ 
        background: 'rgba(255, 255, 255, 0.9)', 
        borderRadius: '10px', 
        padding: '8px', 
        color: '#333', 
        fontSize: '0.8rem' 
      }}>
        <p style={{ margin: '0 0 4px 0', color: '#4a5568' }}>
          <strong>Диапазон:</strong> {numberFrom} - {numberTo}
        </p>
        <p style={{ margin: '0', color: '#4a5568' }}>
          <strong>{mode === 'learning' ? 'Обучение' : 'Экзамен'}:</strong> {mode === 'learning' ? 'с подсказками' : 'без подсказок'}
        </p>
      </div>
    </div>
  );
};

const TestScreen = ({ settings, onFinish }: { settings: TestSettings; onFinish: (results: TestResult[]) => void }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrent] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [startTime, setStartTime] = useState(() => Date.now());
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [questionKey, setQuestionKey] = useState(0);

  const successMessages = [
    '✅ Молодец! Правильно!',
    '✅ Отлично! Верный ответ!',
    '✅ Супер! Ты справился!',
    '✅ Браво! Точно в цель!',
    '✅ Превосходно! Правильно!'
  ];

  const errorMessages = [
    '❌ Неправильно, попробуй ещё раз',
    '❌ Ошибочка, не расстраивайся',
    '❌ Неверный ответ, давай подумаем',
    '❌ Мимо, но ты почти у цели',
    '❌ Не совсем точно, попробуй снова'
  ];

  const nextQuestion = useCallback((currentResults: TestResult[]) => {
    if (currentIndex + 1 >= questions.length) {
      onFinish(currentResults);
    } else {
      setCurrent(prev => prev + 1);
      setUserAnswer('');
      setStartTime(Date.now());
      setQuestionKey(prev => prev + 1);
      if (settings.timeLimit) {
        setTimeLeft(settings.timeLimit);
      }
    }
  }, [currentIndex, questions.length, onFinish, settings.timeLimit]);



  useEffect(() => {
    const newQuestions: Question[] = [];
    for (let i = 0; i < settings.questionCount; i++) {
      const num1 = Math.floor(Math.random() * (settings.numberTo - settings.numberFrom + 1)) + settings.numberFrom;
      const num2 = Math.floor(Math.random() * 10) + 1;
      newQuestions.push({
        num1,
        num2,
        correctAnswer: num1 * num2
      });
    }
    setQuestions(newQuestions);
    if (settings.timeLimit) {
      setTimeLeft(settings.timeLimit);
    }
  }, [settings.questionCount, settings.numberFrom, settings.numberTo, settings.timeLimit]);

  useEffect(() => {
    if (timeLeft === null || showFeedback) return;
    
    if (timeLeft <= 0) {
      const question = questions[currentIndex];
      const answer = userAnswer ? parseInt(userAnswer) : null;
      const currentTime = Date.now();
      const result: TestResult = {
        question,
        userAnswer: answer,
        isCorrect: answer === question.correctAnswer,
        timeSpent: currentTime - startTime
      };
      
      const newResults = [...results, result];
      setResults(newResults);
      
      if (settings.mode === 'learning') {
        setFeedback('⏰ Время вышло!');
        setShowFeedback(true);
        setUserAnswer(question.correctAnswer.toString());
        
        setTimeout(() => {
          setShowFeedback(false);
          nextQuestion(newResults);
        }, 2000);
      } else {
        nextQuestion(newResults);
      }
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, showFeedback, questions, currentIndex, userAnswer, startTime, results, settings.mode, nextQuestion]);

  const handleNumberClick = (num: string) => {
    if (showFeedback) return;
    if (userAnswer.length < 3) {
      setUserAnswer(prev => prev + num);
    }
  };

  const handleSubmit = () => {
    if (!userAnswer || showFeedback) return;
    const answer = parseInt(userAnswer);
    const question = questions[currentIndex];
    const isCorrect = answer === question.correctAnswer;
    const currentTime = Date.now();
    const result: TestResult = {
      question,
      userAnswer: answer,
      isCorrect,
      timeSpent: currentTime - startTime
    };
    const newResults = [...results, result];
    setResults(newResults);

    if (settings.mode === 'learning') {
      const randomIndex = Math.floor(Math.random() * (isCorrect ? successMessages.length : errorMessages.length));
      const feedbackMsg = isCorrect ? successMessages[randomIndex] : errorMessages[randomIndex];
      setFeedback(feedbackMsg);
      setShowFeedback(true);
      
      if (!isCorrect) {
        setUserAnswer(question.correctAnswer.toString());
      }
      
      setTimeout(() => {
        setShowFeedback(false);
        nextQuestion(newResults);
      }, isCorrect ? 1200 : 2000);
    } else {
      nextQuestion(newResults);
    }
  };

  if (questions.length === 0) return <div className="fade-in">Загрузка...</div>;
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const lastResult = results[results.length - 1];

  return (
    <div className="fade-in" style={{
      padding: '15px',
      maxWidth: '400px',
      margin: '0 auto',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="slide-in" style={{ marginBottom: '20px' }}>
        <div style={{
          width: '100%',
          height: '6px',
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '3px',
          marginBottom: '10px'
        }}>
          <div className="progress-bar" style={{
            height: '100%',
            background: '#4CAF50',
            width: `${progress}%`,
            borderRadius: '3px',
            transition: 'width 0.8s ease-out'
          }}></div>
        </div>
        <div style={{ color: 'white', fontWeight: '600' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>{currentIndex + 1} из {questions.length}</div>
            {timeLeft !== null && (
              <div className={timeLeft <= 3 ? 'timer-warning' : ''} style={{ color: timeLeft <= 3 ? '#ff6b6b' : 'white' }}>
                ⏱️ {timeLeft}с
              </div>
            )}
          </div>
        </div>
      </div>

      <div key={questionKey} className="scale-in question-transition card-transition" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '25px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px'
        }}>
          <span style={{ color: '#4299e1' }}>{currentQuestion.num1}</span>
          <span style={{ color: '#e53e3e' }}>×</span>
          <span style={{ color: '#4299e1' }}>{currentQuestion.num2}</span>
          <span style={{ color: '#38a169' }}>=</span>
          {userAnswer ? (
            <span style={{ 
              color: showFeedback && !lastResult?.isCorrect ? '#e53e3e' : '#2d3748',
              border: '2px solid transparent',
              borderRadius: '8px',
              padding: '5px 15px',
              minWidth: '60px',
              textAlign: 'center'
            }}>
              {userAnswer}
            </span>
          ) : (
            <span style={{
              color: '#a0aec0',
              border: '2px dashed #cbd5e0',
              borderRadius: '8px',
              padding: '5px 15px',
              minWidth: '60px',
              textAlign: 'center'
            }}>?</span>
          )}
        </div>
      </div>

      {showFeedback && (
        <div className={`feedback-enter ${lastResult?.isCorrect ? 'feedback-success' : 'feedback-error'}`} style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          padding: '15px',
          marginBottom: '15px',
          textAlign: 'center',
          fontSize: '1rem',
          fontWeight: '600',
          borderLeft: `4px solid ${lastResult?.isCorrect ? '#4CAF50' : '#f44336'}`,
          color: lastResult?.isCorrect ? '#2e7d32' : '#c62828',
          minHeight: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {feedback}
        </div>
      )}

      <div className="scale-in" style={{
        marginTop: 'auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '15px',
        padding: '15px'
      }}>
        {[[1, 2, 3], [4, 5, 6], [7, 8, 9]].map((row, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            {row.map(num => (
              <button 
                key={num} 
                className="button-transition"
                style={{
                  padding: '15px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  background: showFeedback ? '#f7fafc' : 'white',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  cursor: showFeedback ? 'not-allowed' : 'pointer',
                  color: showFeedback ? '#a0aec0' : '#2d3748',
                  opacity: showFeedback ? 0.6 : 1
                }}
                onClick={() => handleNumberClick(num.toString())}
                disabled={showFeedback}
              >
                {num}
              </button>
            ))}
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <button 
            className="button-transition"
            style={{
              padding: '15px',
              border: '1px solid #feb2b2',
              borderRadius: '12px',
              background: showFeedback ? '#f7fafc' : '#fed7d7',
              fontSize: '1.3rem',
              cursor: showFeedback ? 'not-allowed' : 'pointer',
              opacity: showFeedback ? 0.6 : 1
            }}
            onClick={() => setUserAnswer('')}
            disabled={showFeedback}
          >
            ⌫
          </button>
          <button 
            className="button-transition"
            style={{
              padding: '15px',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              background: showFeedback ? '#f7fafc' : 'white',
              fontSize: '1.3rem',
              cursor: showFeedback ? 'not-allowed' : 'pointer',
              opacity: showFeedback ? 0.6 : 1
            }}
            onClick={() => handleNumberClick('0')}
            disabled={showFeedback}
          >
            0
          </button>
          <button 
            className="button-transition"
            style={{
              padding: '15px',
              border: '1px solid #9ae6b4',
              borderRadius: '12px',
              background: (showFeedback || !userAnswer) ? '#f7fafc' : '#c6f6d5',
              fontSize: '1.3rem',
              cursor: (showFeedback || !userAnswer) ? 'not-allowed' : 'pointer',
              opacity: (showFeedback || !userAnswer) ? 0.6 : 1
            }}
            onClick={handleSubmit}
            disabled={showFeedback || !userAnswer}
          >
            ✓
          </button>
        </div>
      </div>
    </div>
  );
};

const ResultScreen = ({ results, onRestart }: { results: TestResult[]; onRestart: () => void }) => {
  const correctCount = results.filter(r => r.isCorrect).length;
  const percentage = Math.round((correctCount / results.length) * 100);
  
  const getGrade = () => {
    if (percentage >= 90) return { emoji: '🏆', text: 'Отлично!', color: '#4CAF50' };
    if (percentage >= 75) return { emoji: '🥈', text: 'Хорошо!', color: '#2196F3' };
    if (percentage >= 60) return { emoji: '🥉', text: 'Неплохо!', color: '#FF9800' };
    return { emoji: '📚', text: 'Нужно подучить', color: '#F44336' };
  };

  const grade = getGrade();

  return (
    <div className="fade-in" style={{
      padding: '15px',
      maxWidth: '400px',
      margin: '0 auto',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div className="scale-in" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div className="bounce" style={{
          width: '100px',
          height: '100px',
          border: `3px solid ${grade.color}`,
          borderRadius: '50%',
          margin: '0 auto 15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.95)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '5px' }}>{grade.emoji}</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: grade.color }}>{percentage}%</div>
        </div>
        <h2 style={{ margin: '0', fontSize: '1.5rem', color: grade.color }}>{grade.text}</h2>
      </div>

      <div className="slide-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div className="card-transition" style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          padding: '15px',
          textAlign: 'center',
          color: '#2d3748'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>✅</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4299e1', marginBottom: '3px' }}>
            {correctCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: '600' }}>Правильно</div>
        </div>
        <div className="card-transition" style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          padding: '15px',
          textAlign: 'center',
          color: '#2d3748'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>❌</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4299e1', marginBottom: '3px' }}>
            {results.length - correctCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: '600' }}>Ошибок</div>
        </div>
      </div>

      <div className="scale-in card-transition" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '15px',
        color: '#2d3748'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#4a5568', fontSize: '1.1rem' }}>📋 Результаты</h3>
        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
          {results.map((result, index) => (
            <div key={index} className={`result-item card-transition`} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              marginBottom: '8px',
              borderRadius: '10px',
              borderLeft: `3px solid ${result.isCorrect ? '#4CAF50' : '#f44336'}`,
              background: result.isCorrect ? '#f0fff4' : '#fff5f5'
            }}>
              <div style={{ fontWeight: '600', fontSize: '1rem', color: '#2d3748' }}>
                {result.question.num1} × {result.question.num2} = 
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#4299e1' }}>
                  {result.userAnswer ?? '—'}
                </span>
                {!result.isCorrect && (
                  <span style={{ fontSize: '0.8rem', color: '#e53e3e', fontWeight: '600' }}>
                    ({result.question.correctAnswer})
                  </span>
                )}
              </div>
              <div style={{ fontSize: '1.2rem' }}>
                {result.isCorrect ? '✅' : '❌'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        className="button-transition bounce"
        style={{
          width: '100%',
          padding: '15px',
          background: 'linear-gradient(135deg, #4299e1, #3182ce)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1.1rem',
          fontWeight: '700',
          cursor: 'pointer',
          marginBottom: '15px'
        }}
        onClick={onRestart}
      >
        🔄 Новый тест
      </button>

      {percentage >= 80 && (
        <div className="bounce" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎉</div>
          <div style={{ fontSize: '1rem', fontWeight: '600' }}>Отличный результат!</div>
        </div>
      )}
    </div>
  );
};

function App() {
  const [screen, setScreen] = useState<'start' | 'test' | 'result'>('start');
  const [settings, setSettings] = useState<TestSettings | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [screenKey, setScreenKey] = useState(0);

  const startTest = (testSettings: TestSettings) => {
    setSettings(testSettings);
    setScreen('test');
    setScreenKey(prev => prev + 1);
  };

  const finishTest = (testResults: TestResult[]) => {
    setResults(testResults);
    setScreen('result');
    setScreenKey(prev => prev + 1);
  };

  const backToStart = () => {
    setScreen('start');
    setSettings(null);
    setResults([]);
    setScreenKey(prev => prev + 1);
  };

  return (
    <div key={screenKey} className="app">
      {screen === 'start' && <StartScreen onStart={startTest} />}
      {screen === 'test' && settings && <TestScreen settings={settings} onFinish={finishTest} />}
      {screen === 'result' && <ResultScreen results={results} onRestart={backToStart} />}
    </div>
  );
}

export default App;