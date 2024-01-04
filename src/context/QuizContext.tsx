// QuizContext.tsx

import React, { createContext, useReducer, useContext, useState } from 'react';
import { Actions, QuizStatus} from '../const'

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
  totalTime: number;
  userScore: number;
  quizStatus: string ;

}

type QuizAction =
  | { type: Actions.fetchSuccess; questions: Question[] }
  | { type: Actions.fecthFailure; error: string } // handle the error , need to add functionaluty 
  | { type: Actions.moveToNextQuestion }
  | { type: Actions.correctOptionSelected}
  | { type: Actions.optionSelected; time: number }
  | { type: Actions.finishQuiz };

  

const initialState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  totalTime: 0,
  userScore: 0,
  quizStatus: QuizStatus.initial
  
};


const QuizContext = createContext<{
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
} | undefined>(undefined);



const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case Actions.fetchSuccess:
        console.log(action)
      return { ...state, questions: action.questions, quizStatus: QuizStatus.started };

    case Actions.moveToNextQuestion:
        const newIndex = state.currentQuestionIndex + 1
        if (newIndex === state.questions.length){
           // restart timer 
           return state
        }
      return { ...state, currentQuestionIndex: newIndex };
    case Actions.correctOptionSelected:
        const newUserScore = state.userScore + 1
        return { ...state, userScore:newUserScore};
    case Actions.finishQuiz:
        return { ...state, quizStatus: QuizStatus.finished};
    case Actions.optionSelected:
      const newTotalTime = state.totalTime 
      return { ...state, totalTime:newTotalTime};
    
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
