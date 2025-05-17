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
    wpmData,
    setWpmData,
    rawWpmData,
    setRawWpmData,
    errorsData,
    setErrorsData,
    timeElapsed,
    setTimeElapsed,
    WPM,
    setWPM,
  } = props;

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

  useEffect(() => {
    if (input.length >= 1 && !timerRef.current) {
      startTimeRef.current = startTimeRef.current || new Date().getTime();

      timerRef.current = setInterval(() => {
        const timeNow = new Date().getTime();
        const elapsed = (timeNow - startTimeRef.current) / 1000;
        setTimeElapsed(Math.round(elapsed));
        const diff =
          timeLimit - Math.round((timeNow - startTimeRef.current) / 1000);

        const correctChars =
          inputRef.current.querySelectorAll(".word .correct").length;
        const incorrectChars = inputRef.current.querySelectorAll(
          ".word .letter.incorrect:not(.extra):not(.missed):not(.correct)"
        ).length;
        // inputRef.current.querySelectorAll(".word .incorrect").length; // TILL NOW
        const missedLetters = inputRef.current.querySelectorAll(
          ".word .letter.missed"
        ).length;
        const extraLetters = inputRef.current.querySelectorAll(
          ".word .letter.extra"
        ).length;
        const remainingChars = missedLetters + extraLetters;

        const wordsTyped = correctChars / 5;
        const wpmCalc =
          elapsed === 0 ? 0 : Math.round((wordsTyped / elapsed) * 60);

        const rawWordsTyped =
          (correctChars + incorrectChars + remainingChars) / 5;
        const rawWpmCalc =
          elapsed === 0 ? 0 : Math.round((rawWordsTyped / elapsed) * 60);

        setWpmData((prev) => {
          const existingIndex = prev.findIndex(
            (entry) => entry.time === Math.round(elapsed)
          );

          if (existingIndex !== -1) {
            // Update existing entry
            return prev.map((entry, index) =>
              index === existingIndex ? { ...entry, wpm: wpmCalc } : entry
            );
          } else {
            // Add new entry
            return [...prev, { time: Math.round(elapsed), wpm: wpmCalc }];
          }
        });

        setRawWpmData((prev) => {
          const existingIndex = prev.findIndex(
            (entry) => entry.time === Math.round(elapsed)
          );

          if (existingIndex !== -1) {
            // Update existing entry
            return prev.map((entry, index) =>
              index === existingIndex ? { ...entry, rawWpm: rawWpmCalc } : entry
            );
          } else {
            // Add new entry
            return [...prev, { time: Math.round(elapsed), rawWpm: rawWpmCalc }];
          }
        });

        setErrorsData((prev) => {
          const currentTime = Math.round(elapsed);

          // Find previous second's errors to calculate the new errors for the current second
          const lastEntry = prev.find(
            (entry) => entry.time === currentTime - 1
          );
          const lastTotalErrors = lastEntry ? lastEntry.totalErrors : 0;

          // Get total incorrect characters (cumulative) and calculate only new errors in this second
          const totalIncorrect = incorrectChars;
          const newErrors = Math.max(totalIncorrect - lastTotalErrors, 0); // Prevent negative values

          // Find if the current second already exists
          const existingIndex = prev.findIndex(
            (entry) => entry.time === currentTime
          );

          if (existingIndex !== -1) {
            // Update existing entry
            return prev.map((entry, index) =>
              index === existingIndex
                ? { ...entry, errors: newErrors, totalErrors: totalIncorrect }
                : entry
            );
          } else {
            // Add new entry with newErrors and totalErrors tracking
            return [
              ...prev,
              {
                time: currentTime,
                errors: newErrors,
                totalErrors: totalIncorrect,
              },
            ];
          }
        });

        if (showBtnRef.current) {
          setTimeLeft(diff);
          if (diff <= 0 || !showBtnRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        }
      }, 200);
    }
  }, [input.length]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        startTimeRef.current = null;
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

      if (currentLetterText != " ") {
        const letterToInvalidate = [
          ...currentWordRef.current.querySelectorAll(
            ".letter:not(.correct):not(.incorrect)"
          ),
        ];
        letterToInvalidate.forEach((letter) => {
          removeClass(letter, "text-red-500 incorrect");
          addClass(letter, "text-red-500 incorrect missed");
        });
      }

      if (startTimeRef.current) {
        setWPM((prev) => {
          const wordText = currentWordRef.current.innerText.replace(" ", "");
          const existingIndex = prev.findIndex(
            (entry) => entry.wordText === wordText
          );

          let elapsedTime = Math.round(
            Math.round((new Date().getTime() - startTimeRef.current) / 1000)
          );

          const correctChars =
            currentWordRef.current.querySelectorAll(".correct").length;

          if (existingIndex !== -1) {
            return prev.map((entry, index) =>
              index === existingIndex
                ? {
                    ...entry,
                    timeElapsed: elapsedTime,
                    timeTaken:
                      entry.timeTaken +
                      elapsedTime -
                      WPM[WPM.length - 1].timeElapsed,
                    correctChars: correctChars,
                  }
                : entry
            );
          } else {
            return [
              ...prev,
              {
                wordText: wordText,
                timeElapsed: elapsedTime,
                timeTaken: elapsedTime - WPM[WPM.length - 1].timeElapsed,
                correctChars: correctChars,
              },
            ];
          }
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
            removeClass(currentLetterRef.current, "missed");
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
          removeClass(currentLetterRef.current, "missed");
        }
      }

      if (!currentLetterRef.current.className.includes("current")) {
        addClass(currentWordRef.current.lastChild, "current");
        currentLetterRef.current = currentWordRef.current.lastChild;
        removeClass(currentLetterRef.current, "text-red-500 incorrect");
        removeClass(currentLetterRef.current, "text-white correct");
        removeClass(currentLetterRef.current, "missed");
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
