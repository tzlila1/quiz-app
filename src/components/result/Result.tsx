import React from "react";
import {  useQuiz } from '../../context/QuizContext';
import { IoMdThumbsUp } from "react-icons/io";
import { FaRegSmileWink } from "react-icons/fa";

import './Result.css'

const Result: React.FC = () => {
    const { state, dispatch } = useQuiz();
    const {userScore, questions, totalTime} = state

return( 
      <div className='result-container'>
            <div className="score-container">
              <b>{userScore}</b> of {questions.length} questions answered correctly, 

              in <b>{totalTime/1000}</b> seconds
            </div>
            <div className="message-container">
              {userScore > questions.length / 2 ? (
                <p className="good-job">
                  <span className='text-icon'> <IoMdThumbsUp /></span>
                 Good Job!</p>
              ) : (
                <p className="can-do-better">
                  You can do better next time 
                <span className='text-icon'> <FaRegSmileWink /></span>

</p>
              )}
            </div>
        </div>


)

}
export default Result;