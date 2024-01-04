import React, { useEffect, useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import {TIME_PER_QUESTION , TIME_FOR_HINT, Actions} from '../../const'
import { FaLightbulb } from "react-icons/fa";
import  './Quiz.css'
import styled from 'styled-components';
import { InputHTMLAttributes } from 'react';


// Styled components
const QuizContainer = styled.div`
  border-radius: 8px;
  padding: 10px 20px;
`;

const TimerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 15px;
`;

const Timer = styled.div`
  font-size: 30px;
  font-weight: bold;
  width: 60px;
  height: 60px;
  border: 3px solid #3498db;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  color: #3498db;
`;

const Question = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

interface OptionProps extends InputHTMLAttributes<HTMLInputElement> {
  isSelected?: boolean;
  isShowCorrectOption?: boolean
}

const Option = styled.input<OptionProps>`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  background-color:${(props) => (props.isSelected?   '  #e0e0e0' : '' )};
  background-color:${(props) => (props.isShowCorrectOption?   '  #e7f8eb' : '' )};

  &:hover {
    background-color: #e0e0e0;
  }

  &:disabled {
    pointer-events: none;
    opacity: 1;
    color: #333;
  }
`;

const Hint = styled.div`
  padding-top: 10px;
  color: red;
  font-size: 18px;
`;


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
  const [startQuizTime, setStartQuizTime] =useState<number>(0)

  useEffect(() => {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1 );
      }, 1000);

      // set time to now 
      setStartQuizTime(Date.now())
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
    if (timer <= TIME_FOR_HINT){
      setShowHint(true)
    }
    // Handle timer reaching 0
    if (timer <= 0) {
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
    dispatch({ type: Actions.moveToNextQuestion });
    setTimer(TIME_PER_QUESTION)
    // check if quiz finish
    if(currentQuestionIndex === questions.length - 1) {
       dispatch({ type: Actions.finishQuiz });
       }

  };

  const onOptionSelected = (option: string) => {
    const timeToAnswer = Date.now() - (startQuizTime)
    console.log(timeToAnswer)
    setOptionSelected(option)
    if(correctOption === option){
      dispatch({type: Actions.correctOptionSelected, time: timeToAnswer});
      

    }
   // dispatch({type: Actions.optionSelected, time: timeToAnswer});


  }

  const renderAnswers = () => {
    
    return currentQuestion.choices.map((option, index) => (
    <div className='option-container'>
      <Option
        isSelected={optionSelected === option ? true : false }
        isShowCorrectOption ={showCorrectOption && correctOption === option }
        value={option}
        name='option'
        className={`option   ${ showCorrectOption && correctOption === option  ? 'correct-option' : ''}`   }
        key={index} 
        disabled= {!!optionSelected || showCorrectOption} 
        onClick={()=> onOptionSelected(option)}
        />


    </div>
    ));
  };
  

  return (
    <QuizContainer>
      <TimerContainer>
        <Timer>
          {timer}
        </Timer>
      </TimerContainer>

      <Question>
        {currentQuestionIndex + 1}. {questions[currentQuestionIndex].question}
      </Question>

      <OptionsContainer>
        {renderAnswers()}
      </OptionsContainer>

      {showHint &&
       <Hint>
        <FaLightbulb />  {questions[currentQuestionIndex].hint} 
       </Hint> }

    </QuizContainer>
  );
};

export default Quiz;