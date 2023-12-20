// App.tsx

import React, { useEffect } from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import Quiz from './components/quiz/Quiz'
import Result from './components/result/Result'
import Header from './components/header/Header'
import questions from './mock'

import './App.css'

const App: React.FC = () => {
  const { state, dispatch } = useQuiz();

    interface QuizQuestion {
      question_id: number;
      question: string;
      choices: string[];
      answer_index: number;
      correctAnswer?: string;
      hint: string;
    }
  
    function getRandomQuizQuestions(questions: QuizQuestion[], numQuestions: number): QuizQuestion[] {
      const shuffledQuestions = questions.slice().sort(() => Math.random() - 0.5);
      return shuffledQuestions.slice(0, numQuestions);
    }
    const startQuiz = () => {
      const fetchData = async () => {
        try {
          const response = await fetch('https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple');
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          //choose 5 randomly 
        
          //dispatch action with the question . 
          dispatch({ type: 'FETCH_QUESTIONS_SUCCESS',  questions: data.results });

          //setQuestions(data);
        } catch (error) {
          console.error('Error fetching questions:', error);
          
        }
      };
      //fetchData()
      const randomQuestions = getRandomQuizQuestions( questions , 5)
      dispatch({ type: 'FETCH_QUESTIONS_SUCCESS',  questions: randomQuestions });

    };

    return (
      <div className="App">
        <div className='app-container'>
          <Header/>
          {!state.startQuiz && !state.finishQuiz &&
          <div className="button-container">
            <button className='button' onClick={startQuiz} >
                    Start Quiz
            </button>       
          </div>}
          {state.startQuiz && !state.finishQuiz && <Quiz/>}
          {state.finishQuiz && <Result/>}
        </div>
      </div>
    );
  };
  
  const AppWithQuizProvider: React.FC = () => {
    return (
      <QuizProvider>
          <App />
        </QuizProvider>
    );
  };
  
  export default AppWithQuizProvider;
  