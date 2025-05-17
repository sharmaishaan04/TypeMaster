import { useEffect, useRef, useState } from "react";
import React from "react";
import { BackgroundGradient } from "../components/ui/background-gradient";

function addClass(el, name) {
  el.className += " " + name;
}
function removeClass(el, name) {
  el.className = el.className.replace(name, "");
}

function TypingTest({ props }) {
  const {
    input,
    setInput,
    text,
    inputRef,
    timeLimit,
    setTimeLeft,
    showBtn,
    newGame,
    timerRef,
    cursorRef,
    currentLetterRef,
    currentWordRef,
    incorrectLetters,
    setIncorrectLetters,
    updateCaretPosition,
    gameOver,
    startTimeRef,
  } = props;

  const [WPM, setWPM] = useState(0);
  const placeholder = text.toLowerCase().split(" ");
  const showBtnRef = useRef(showBtn);
  const [focusErr, setFocusErr] = useState(false);

  useEffect(() => {
    showBtnRef.current = showBtn;
    inputRef.current.focus();
    console.log("new Game started ");
    newGame();
    updateCaretPosition();
  }, [showBtn]);

  // useEffect(() => {
  //   if (!timerRef.current && showBtnRef.current && input.length >= 1) {
  //     const startTime = new Date().getTime();
  //     timerRef.current = setInterval(() => {
  //       const timeNow = new Date().getTime();
  //       const diff = timeLimit - Math.round((timeNow - startTime) / 1000);
  //       setTimeLeft(diff);
  //       console.log("clearing inside");
  //       if (diff <= 0 || !showBtnRef.current) {
  //         clearInterval(timerRef.current);
  //         timerRef.current = null;
  //       }
  //     }, 1000);
  //   }

  //   return () => {
  //     if (!showBtnRef.current) {
  //       console.log("clearing");
  //       clearInterval(timerRef.current);
  //     }
  //   };
  // }, [input]);

  useEffect(() => {
    if (input.length >= 1 && !timerRef.current && showBtnRef.current) {
      startTimeRef.current = startTimeRef.current || new Date().getTime();

      timerRef.current = setInterval(() => {
        const timeNow = new Date().getTime();
        const diff =
          timeLimit - Math.round((timeNow - startTimeRef.current) / 1000);
        setTimeLeft(diff);

        if (diff <= 0 || !showBtnRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          startTimeRef.current = null;
        }
      }, 1000);
    } else if (
      input.length >= 1 &&
      !showBtnRef.current &&
      !startTimeRef.current
    ) {
      startTimeRef.current = startTimeRef.current || new Date().getTime();
    }

    return () => {
      if (!showBtnRef.current && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [input.length]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        // startTimeRef.current = null;
      }
    };
  }, []);

  const keyDown = (e) => {
    e.preventDefault();
    if (!currentLetterRef.current) return;

    const key = e.key;
    const isSpace = key === " ";
    const isLetter = key.length === 1 && key !== " ";
    const currentLetterText = currentLetterRef.current?.innerText || " ";
    const isBackspace = key === "Backspace";
    const isFirstLetter =
      currentLetterRef.current === currentWordRef.current.firstChild;

    if (isLetter) {
      setInput((prev) => [...prev, key]);
      if (currentLetterRef.current.className.includes("current")) {
        addClass(
          currentLetterRef.current,
          key === currentLetterText
            ? "text-white correct"
            : "text-red-500 incorrect"
        );
        removeClass(currentLetterRef.current, "current");
        let nextLetter = currentLetterRef.current.nextSibling;
        if (nextLetter) {
          currentLetterRef.current = nextLetter;
          addClass(currentLetterRef.current, "current");
        }
      } else {
        setIncorrectLetters((prev) => ({
          ...prev,
          [currentWordRef.current.dataset.index]: [
            ...(prev[currentWordRef.current.dataset.index] || []),
            key,
          ],
        }));

        if (incorrectLetters.length > 0) {
          currentLetterRef.current = currentLetterRef.current.nextSibling;
        }
      }
    }

    if (isSpace) {
      setInput((prev) => [...prev, key]);
      // if (startTimeRef.current) {
      //   const elapsedTime =
      //     (new Date().getTime() - startTimeRef.current) / 1000;
      //   const correctChars =
      //     inputRef.current.querySelectorAll(".word .correct").length;
      //   const wpmCalc = (correctChars / 5 / (elapsedTime / 60)).toFixed(2);
      //   setWPM(wpmCalc);
      // }

      if (currentLetterText != " ") {
        const letterToInvalidate = [
          ...currentWordRef.current.querySelectorAll(".letter:not(.correct)"),
        ];
        letterToInvalidate.forEach((letter) => {
          // setInput((prev) => [...prev, letter.innerText]);
          removeClass(letter, "text-red-500 incorrect");
          addClass(letter, "text-red-500 incorrect");
        });
      }

      const nextWord = currentWordRef.current.nextSibling;
      if (nextWord) {
        removeClass(currentWordRef.current, "current");
        currentWordRef.current = nextWord;
        addClass(currentWordRef.current, "current");

        if (currentLetterText) {
          removeClass(currentLetterRef.current, "current");
        }
        currentLetterRef.current = currentWordRef.current.firstChild;
        addClass(currentLetterRef.current, "current");
      } else {
        removeClass(currentLetterRef.current, "current");
        currentLetterRef.current = currentWordRef.current.lastChild;
        addClass(currentLetterRef.current, "current");
      }
    }

    if (isBackspace) {
      if (
        currentLetterRef.current.className.includes("current") &&
        isFirstLetter
      ) {
        const previousWord = currentWordRef.current.previousSibling;
        if (previousWord) {
          removeClass(currentWordRef.current, "current");
          currentWordRef.current = previousWord;
          addClass(currentWordRef.current, "current");

          const previousLetter = currentWordRef.current.lastChild;
          if (previousLetter) {
            removeClass(currentLetterRef.current, "current");
            currentLetterRef.current = previousLetter;
            addClass(currentLetterRef.current, "current");
            removeClass(currentLetterRef.current, "text-red-500 incorrect");
            removeClass(currentLetterRef.current, "text-white correct");
          }
        }
      }

      if (
        currentLetterRef.current.className.includes("current") &&
        !isFirstLetter
      ) {
        const previousLetter = currentLetterRef.current.previousSibling;
        if (previousLetter) {
          removeClass(currentLetterRef.current, "current");
          currentLetterRef.current = previousLetter;
          addClass(currentLetterRef.current, "current");
          removeClass(currentLetterRef.current, "text-red-500 incorrect");
          removeClass(currentLetterRef.current, "text-white correct");
        }
      }

      if (!currentLetterRef.current.className.includes("current")) {
        addClass(currentWordRef.current.lastChild, "current");
        currentLetterRef.current = currentWordRef.current.lastChild;
        removeClass(currentLetterRef.current, "text-red-500 incorrect");
        removeClass(currentLetterRef.current, "text-white correct");
      }

      if (currentLetterRef.current.className.includes("extra")) {
        const wordIndex = currentWordRef.current.dataset.index;
        setIncorrectLetters((prev) => {
          const updatedLetters = { ...prev };
          if (updatedLetters[wordIndex]?.length) {
            updatedLetters[wordIndex] = updatedLetters[wordIndex].slice(0, -1);

            if (updatedLetters[wordIndex].length === 0) {
              delete updatedLetters[wordIndex];
            }
          }
          currentLetterRef.current = currentLetterRef.current.previousSibling;
          return updatedLetters;
        });
      }
    }

    updateCaretPosition();
  };

  return (
    <div className="my-10">
      {/* {WPM} */}
      <BackgroundGradient
        className="rounded-[22px] p-4 sm:p-10 bg-zinc-900 h-fit -m-1 "
        animate={true}
      >
        <div className="relative text-3xl ">
          <div
            ref={inputRef}
            onKeyDown={keyDown}
            tabIndex={0}
            id="words"
            className={`${
              focusErr ? "blur-sm" : ""
            } min-h-96 text-textsecondary focus:outline-none focus:border-none tracking-wider`}
            onBlur={() => {
              setFocusErr(true);
            }}
            onFocus={() => {
              setFocusErr(false);
            }}
          >
            {placeholder.map((word, wordIndex) => {
              return (
                <div
                  // id="word"
                  className="word inline-block m-3"
                  data-index={wordIndex}
                  key={wordIndex}
                  ref={wordIndex === 0 ? currentWordRef : null}
                >
                  {word.split("").map((letter, letterIndex) => (
                    <span
                      // id="letter"
                      key={letterIndex}
                      className="letter"
                      ref={
                        wordIndex === 0 && letterIndex === 0
                          ? currentLetterRef
                          : null
                      }
                    >
                      {letter}
                    </span>
                  ))}

                  {incorrectLetters[wordIndex]?.map((incorrectLetter, i) => (
                    <span
                      // id="letter"
                      key={i}
                      className="letter text-red-500 incorrect extra"
                    >
                      {incorrectLetter}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
          <div
            id="cursor"
            ref={cursorRef}
            className="text-primarycolor absolute top-2 animate-[pulse_0.7s_ease-out_infinite] "
          >
            |
          </div>
          {focusErr && (
            <div
              id="focus"
              className="absolute z-20 text-3xl w-full text-center top-[45%] text-white"
            >
              Click Here To Focus
            </div>
          )}
        </div>
      </BackgroundGradient>
    </div>
  );
}

export default TypingTest;
export { removeClass, addClass };
