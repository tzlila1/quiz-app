import React, { useEffect, useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import {TIME_PER_QUESTION , TIME_FOR_HINT} from '../../const'
import { FaLightbulb } from "react-icons/fa";
import  './Quiz.css'

const Quiz: React.FC = () => {
  const { state, dispatch } = useQuiz();
  const { currentQuestionIndex, questions } = state;
  const [timer, setTimer] = useState<number>(TIME_PER_QUESTION)
  const [intervalID, setIntervalID ] = useState<any>()
  const [optionSelected, setOptionSelected] = useState<string>('')
  const [showCorrectOption, setShowCorrectOption] = useState<boolean>(false)
  const [showHint, setShowHint] = useState<boolean>(false)
  const currentQuestion = questions[currentQuestionIndex];
  const correctOption = currentQuestion.choices[currentQuestion.answer_index];

  useEffect(() => {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1 );
      }, 1000);

      // clear interval and initialize state params
      setIntervalID(interval)
      setOptionSelected('')
      setShowCorrectOption(false)
      setShowHint(false)
      // Clear interval when component unmounts 
      return () => {
        clearInterval(interval)
      }
  }, [currentQuestionIndex]);


  
  useEffect(() => {
    // show hint after 10 seconds
    if (timer === TIME_FOR_HINT){
      setShowHint(true)
    }
    // Handle timer reaching 0
    if (timer === 0) {
     //time is up - show the correct option 
      setShowCorrectOption(true)
     // Move to the next question 1 second after answer is displayed
      setTimeout( ()=> moveToNextQuestion() ,1000)
      // clear Interval
      clearInterval(intervalID)
    }

 
  }, [timer]);

  const moveToNextQuestion = () => {
    // Move to the next question and reset the timer
    dispatch({ type: 'MOVE_TO_NEXT_QUESTION' });
    setTimer(TIME_PER_QUESTION)
    // check if quiz finish
    if(currentQuestionIndex === questions.length - 1) {
       dispatch({ type: 'FINISH_QUIZ' });
       }

  };

  const onOptionSelected = (option: string) => {
    setOptionSelected(option)
    if(correctOption === option){
      dispatch({type:"CORRECT_OPTION_SELECTED"});
    }
    dispatch({type:"OPTION_SELECTED", time:(TIME_PER_QUESTION - timer) });


  }

  const renderAnswers = () => {
    
    return currentQuestion.choices.map((option, index) => (
    <div className='option-container'>
      <input
        value={option}
        name='option'
        className={`option ${ optionSelected === option  ? 'selected-option' : ''}  ${ showCorrectOption && correctOption === option  ? 'correct-option' : ''}`   }
        key={index} 
        disabled= {!!optionSelected || showCorrectOption} 
        onClick={()=> onOptionSelected(option)}/>
    </div>
    ));
  };
  

  return (
    <div className='quiz-container'>
      <div className="timer-container">
        <div className="timer">
          {timer}
        </div>
      </div>

      <div className='question'>
        {currentQuestionIndex + 1}. {questions[currentQuestionIndex].question}
      </div>

      <div className='options-container'>
        {renderAnswers()}
      </div>

      {showHint &&
       <div className='hint'>
        <FaLightbulb />  {questions[currentQuestionIndex].hint} 
       </div> }

    </div>
  );
};

export default Quiz;