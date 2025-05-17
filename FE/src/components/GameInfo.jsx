import React, { useRef, useState } from "react";
import { Button } from "./ui/moving-border";

const GameInfo = ({ props }) => {
  const words = [10, 25, 50, 100];
  const times = [15, 30, 60, 120];
  const [active, setActive] = useState(times);

  const {
    timeLimit,
    setTimeLimit,
    wordLimit,
    setWordLimit,
    timeLeft,
    showBtn,
    setShowBtn,
    newGame,
    timerRef,
    cursorRef,
    currentLetterRef,
    currentWordRef,
    incorrectLetters,
    setIncorrectLetters,
    updateCaretPosition,
    setForceReRender,
  } = props;

  return (
    <div className="flex justify-between mt-3 items-center">
      <div className="w-40">
        {showBtn && (
          <Button className="bg-transparent text-primarycolor text-2xl h-12 w-12 border-2 border-primarycolor rounded-full shadow-md shadow-primarycolor transition-all duration-200 hover:scale-105">
            {timeLeft}
          </Button>
        )}
      </div>

      <div className="bg-zinc-900 rounded-lg px-4 py-2 flex justify-center items-center space-x-4 shadow shadow-primarycolor">
        <button
          className={`${
            showBtn ? "text-primarycolor font-semibold" : "text-textsecondary"
          } py-1 px-3 rounded-lg transition-all duration-200 hover:text-white`}
          onClick={() => {
            setShowBtn((prev) => true);
            setActive(times);
            setWordLimit(30);
            setTimeLimit(30);
          }}
        >
          time
        </button>

        <button
          className={`${
            !showBtn ? "text-primarycolor font-semibold" : "text-textsecondary"
          } py-1 px-3 rounded-lg transition-all duration-200 hover:text-white`}
          onClick={() => {
            setShowBtn((prev) => false);
            setWordLimit(25);
            setActive(words);
          }}
        >
          words
        </button>

        <div id="area" className="flex space-x-4">
          {active.map((item, index) => (
            <div
              key={index}
              className={`cursor-pointer text-lg px-2 py-1 rounded-lg transition-all duration-200 ${
                (showBtn && item === timeLimit) ||
                (!showBtn && item === wordLimit)
                  ? "text-primarycolor font-semibold scale-110"
                  : "text-textsecondary"
              } hover:text-white hover:scale-110`}
              onClick={() => {
                showBtn ? setTimeLimit(item) : setWordLimit(item);
                newGame();
                updateCaretPosition();
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={() => {
          newGame();
          updateCaretPosition();
          setActive(times);
          setWordLimit(30);
          setTimeLimit(30);
          setForceReRender((prev) => !prev);
        }}
        className="bg-transparent text-primarycolor text-xl h-12 w-40 border-2 border-primarycolor rounded-lg shadow-md shadow-primarycolor transition-all duration-200 hover:scale-105 hover:bg-primarycolor hover:text-black"
      >
        New Game
      </Button>
    </div>
  );
};

export default GameInfo;
