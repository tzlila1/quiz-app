import React from "react";
import {  useQuiz } from '../../context/QuizContext';
import './Result.css'

const Result: React.FC = () => {
    const { state, dispatch } = useQuiz();
    const {userScore, questions} = state

return( 
      <div className='result-container'>
            <div className="score-container">
              {userScore} of {questions.length} questions answered correctly.
            </div>
            <div className="message-container">
              {userScore > questions.length / 2 ? (
                <p className="good-job">Good Job!</p>
              ) : (
                <p className="can-do-better">You can do better next time.</p>
              )}
            </div>
        </div>


)

}
export default Result;