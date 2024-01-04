import { finished } from "stream"

export const  TIME_PER_QUESTION:number = 3
export const  TIME_FOR_HINT:number = TIME_PER_QUESTION - 2
export enum Actions {
    fetchSuccess = "FETCH_QUESTIONS_SUCCESS",
    fecthFailure = "FETCH_QUESTIONS_FAILURE",
    moveToNextQuestion = "MOVE_TO_NEXT_QUESTION",
    correctOptionSelected = "CORRECT_OPTION_SELECTED",
    optionSelected = "OPTION_SELECTED",
    finishQuiz = "FINISH_QUIZ"

  }

  export enum QuizStatus {
    initial = "initial",
    started = "started",
    finished = "finished"
  }

