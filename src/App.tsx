// App.tsx

import React, { useEffect } from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import Quiz from './components/quiz/Quiz'
import Result from './components/result/Result'
import Header from './components/header/Header'
import questions from './mock'
import {Actions, QuizStatus} from './const'
import styled from 'styled-components';

// Styled components
const AppWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const AppContainer = styled.div`
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: 500px;
  width: 80vh;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const ButtonContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const StartButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 400px;

  &:hover {
    background-color: #2980b9;
  }
`;

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
  
    const getRandomQuizQuestions = (questions: QuizQuestion[], numQuestions: number): QuizQuestion[] => {
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
          dispatch({ type: Actions.fetchSuccess,  questions: data.results });

          //setQuestions(data);
        } catch (error) {
          console.error('Error fetching questions:', error);
          
        }
      };
      //fetchData()
      const randomQuestions = getRandomQuizQuestions( questions , 5)
      dispatch({ type: Actions.fetchSuccess,  questions: randomQuestions });

    };

    return (
      <AppWrapper>
        <AppContainer>
          <Header/>
          { state.quizStatus === QuizStatus.initial &&
          <ButtonContainer>
            <StartButton onClick={startQuiz} >
                    Start Quiz
            </StartButton>       
          </ButtonContainer>}
          {state.quizStatus === QuizStatus.started  && <Quiz/>}
          {state.quizStatus === QuizStatus.finished  && <Result/>}
        </AppContainer>
      </AppWrapper>
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
  