import React, { useEffect, useState } from "react";
import "./App.css";

/*
Requirements:
  1. Forword functionality
    i. when no digin in the input
        Apply the new value in it and focus the immediate next input.
    ii. when input contains a digit
        a. If cursor is at the beginning: apply the new value to current input and slide it's
            older value towards right
        b. If cursor is ar the end: apply the new value to the next input and may be focus on the 
            next to next input. 
  2. Backward functionality
  3. Arrow functionality
  4. Paste functionality
*/

const OtpInput = ({ size = 6, onSubmit }) => {
  const [inputValues, setInputValues] = useState(() => {
    return new Array(size).fill("");
  });

  const focusNext = (currentInput) => {
    currentInput?.nextElementSibling?.focus();
  };
  const focusNextToNext = (currentInput) => {
    if (currentInput?.nextElementSibling?.nextElementSibling) {
      currentInput.nextElementSibling.nextElementSibling.focus();
    } else {
      focusNext(currentInput);
    }
  };
  const focusPrevious = (currentInput) => {
    currentInput?.previousElementSibling?.focus();
  };
  const handleBackspace = (event) => {
    if (event.key === "Backspace") {
      const inputIndex = Number(event.target.id);
      setInputValues((prev) => {
        const newValues = [...prev];
        newValues[inputIndex] = "";
        return newValues;
      });
      focusPrevious(event.target);
    }
  };
  const handleNumericInput = (event) => {
    const inputValue = Number(event.key);
    if (isNaN(inputValue)) return;
    const inputElement = event.target;
    let inputIndex = Number(event.target.id);
    if (inputValues[inputIndex].length === 0) {
      setInputValues((prev) => {
        const newValues = [...prev];
        newValues[inputIndex] = inputValue.toString();
        return newValues;
      });
      focusNext(event.target);
    } else {
      const cursorIndex = inputElement.selectionStart;
      if (cursorIndex === 0) {
        setInputValues((prev) => {
          const newValues = [...prev];
          if (inputIndex < size - 1) {
            newValues[inputIndex + 1] = prev[inputIndex];
          }
          newValues[inputIndex] = inputValue.toString();
          return newValues;
        });
        focusNextToNext(inputElement);
      } else if (inputIndex < size - 1) {
        setInputValues((prev) => {
          const newValues = [...prev];
          newValues[inputIndex + 1] = inputValue.toString();
          return newValues;
        });
        focusNextToNext(inputElement);
      }
    }
  };
  const handlePaste = (event) => {
    console.log(event, 'paste')
    event.preventDefault();
    const paste = event.clipboardData.getData("text").slice(0, size);
    const chars = paste.split("");
    const newValues = [...inputValues];
    let index = Number(event.target.id);
    for (let char of chars) {
      if (index >= size || isNaN(Number(char))) break;
      newValues[index++] = char;
    }
    setInputValues(newValues);
  };

  const handleArrows = (event) => {
    if (event.key === "ArrowRight") {
      focusNext(event.target);
    } else if (event.key === "ArrowLeft") {
      focusPrevious(event.target);
    }
  };
  const onKeyDown = (event) => {
    handleNumericInput(event);
    handleBackspace(event);
    handleArrows(event);
  };

  useEffect(() => {
    const allFieldsFilled = inputValues.every((val) => val !== "");
    if (allFieldsFilled) onSubmit(inputValues);
  }, [inputValues]);
  return (
    <div className="otp-container">
      <div className="otp-login-container">
        {inputValues.map((inputValue, index) => {
          return (
            <input
              autoFocus={index === 0}
              key={index.toString()}
              id={index.toString()}
              value={inputValue}
              onKeyDown={onKeyDown}
              maxLength={1}
              onPaste={handlePaste}
            ></input>
          );
        })}
      </div>
    </div>
  );
};

export default OtpInput;
