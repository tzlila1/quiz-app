// QuizContext.tsx

import React, { createContext, useReducer, useContext, useState } from 'react';
import {TIME_PER_QUESTION} from '../const'

   interface Question {
      question_id: number;
      question: string;
      choices: string[];
      answer_index: number;
      correctAnswer?: string;
      hint: string;

    }

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  startQuiz:boolean;
  timer: number;
  userScore: number;
  finishQuiz: boolean;
}

type QuizAction =
  | { type: 'FETCH_QUESTIONS_SUCCESS'; questions: Question[] }
  | { type: 'FETCH_QUESTIONS_FAILURE'; error: string }
  | { type: 'MOVE_TO_NEXT_QUESTION' }
  | { type: 'CORRECT_OPTION_SELECTED' }
  | { type: 'FINISH_QUIZ' };

  

const initialState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  startQuiz: false,
  timer: TIME_PER_QUESTION,
  userScore: 0,
  finishQuiz: false
  
};


const QuizContext = createContext<{
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
} | undefined>(undefined);



const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'FETCH_QUESTIONS_SUCCESS':
        console.log(action)
      return { ...state, questions: action.questions, startQuiz: true };

    case 'MOVE_TO_NEXT_QUESTION':
        const newIndex = state.currentQuestionIndex + 1
        if (newIndex === state.questions.length){
           // restart timer 
           return state
        }
      return { ...state, currentQuestionIndex: newIndex };
    case 'CORRECT_OPTION_SELECTED':
        const newUserScore = state.userScore + 1
        return { ...state, userScore:newUserScore};
    case 'FINISH_QUIZ':
        return { ...state, finishQuiz:true};
    
    default:
      return state;
  }
};



const QuizProvider: React.FC <React.PropsWithChildren<{}>> = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);


  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
};

const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export { QuizProvider, useQuiz };
