import { useEffect, useRef, useState } from "react";
import TypingTest from "./components/TypingTest";
import Results from "./components/Results";
import { generateRandomSentence } from "./logic";
import { Button } from "./components/ui/moving-border";
import { cn } from "@/lib/utils";
import GameInfo from "./components/GameInfo";
import Header from "./components/Header";
import { createContext } from "react";
import { removeClass, addClass } from "./components/TypingTest";
import Loader from "./components/Loader";

function App() {
  const [forceReRender, setForceReRender] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [timeLimit, setTimeLimit] = useState(30);
  const [wordLimit, setWordLimit] = useState(30);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [showBtn, setShowBtn] = useState(true);
  const [input, setInput] = useState([]);
  const inputRef = useRef(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [text, setText] = useState(null);
  const [incorrectLetters, setIncorrectLetters] = useState({});
  const currentWordRef = useRef(0);
  const currentLetterRef = useRef(0);
  const timerRef = useRef(null);
  const cursorRef = useRef(null);
  const startTimeRef = useRef(null);
  const [WPM, setWPM] = useState([
    {
      wordText: "",
      correctChars: 0,
      timeElapsed: 0,
      timeTaken: 0,
    },
  ]);
  const [wpmData, setWpmData] = useState([]);
  const [rawWpmData, setRawWpmData] = useState([]);
  const [errorsData, setErrorsData] = useState([{ time: 0, errors: 0 }]);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const FinishGame = () => {
    if (
      currentWordRef.current &&
      currentLetterRef.current &&
      inputRef.current
    ) {
      if (
        inputRef.current.lastChild.lastChild === currentLetterRef.current ||
        timeLeft === 0
      ) {
        return true;
      }
    }

    return false;
  };

  const updateCaretPosition = () => {
    if (
      cursorRef.current &&
      currentLetterRef.current.className.includes("current")
    ) {
      const rect = currentLetterRef.current.getBoundingClientRect();
      const parentRect = document
        .getElementById("words")
        .getBoundingClientRect();

      if (rect.bottom > window.innerHeight - 100) {
        window.scrollBy({
          top: rect.height + 10,
          behavior: "smooth",
        });
      }
      cursorRef.current.style.top = `${rect.top - parentRect.top}px`;
      cursorRef.current.style.left = `${rect.left - parentRect.left - 6}px`;
      cursorRef.current.style.height = `${rect.height}px`;
    } else {
      const rect = currentWordRef.current.getBoundingClientRect();
      const parentRect = document
        .getElementById("words")
        .getBoundingClientRect();

      if (rect.bottom > window.innerHeight - 100) {
        window.scrollBy({
          top: rect.height + 10,
          behavior: "smooth",
        });
      }
      cursorRef.current.style.top = `${rect.top - parentRect.top}px`;
      cursorRef.current.style.left = `${rect.right - parentRect.left - 5}px`;
      cursorRef.current.style.height = `${rect.height}px`;
    }
  };

  function newGame() {
    setInput([]);
    currentWordRef.current = 0;
    currentLetterRef.current = 0;
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (startTimeRef.current) {
      startTimeRef.current = null;
    }
    timerRef.current = null;
    setTimeLeft(timeLimit);
    setIncorrectLetters({});
    setWpmData([]);
    setTimeElapsed(0);
    setRawWpmData([]);
    setErrorsData([{ time: 0, errors: 0 }]);
    setWPM([
      {
        wordText: "",
        correctChars: 0,
        timeElapsed: 0,
        timeTaken: 0,
      },
    ]);

    const wordsContainer = document.getElementById("words");
    if (wordsContainer) {
      wordsContainer
        .querySelectorAll(".current, .correct, .incorrect , .missed")
        .forEach((el) => {
          el.classList.remove(
            "current",
            "correct",
            "incorrect",
            "text-white",
            "text-red-500",
            "missed"
          );
        });

      const firstWord = wordsContainer.querySelector(".word");
      // const firstWord = wordsContainer.querySelector("#word");
      if (firstWord) {
        addClass(firstWord, "current");
        currentWordRef.current = firstWord;
        const firstLetter = firstWord.querySelector("span");
        if (firstLetter) {
          addClass(firstLetter, "current");
          currentLetterRef.current = firstLetter;
        }
      }
    }
  }

  const props = {
    input,
    setInput,
    text,
    inputRef,
    setCorrectCount,
    setTotalCount,
    timeLimit,
    setTimeLimit,
    wordLimit,
    setWordLimit,
    timeLeft,
    setTimeLeft,
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
    gameOver,
    setGameOver,
    forceReRender,
    setForceReRender,
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
  };

  useEffect(() => {
    const random_text = generateRandomSentence(wordLimit);
    setText(random_text);
    setTimeLeft(timeLimit);
  }, [wordLimit, timeLimit, showBtn, forceReRender]);

  useEffect(() => {
    if (!gameOver && FinishGame()) {
      setGameOver(true);
    } else {
      setGameOver(false);
    }
  }, [timeLeft, currentLetterRef.current, currentWordRef.current]);

  if (!text) {
    return <Loader />;
  }

  return (
    <div className="mx-15 mt-2">
      <Header />

      {gameOver ? (
        <Results props={props} />
      ) : (
        <div>
          <GameInfo props={props} />
          <TypingTest props={props} />
        </div>
      )}
    </div>
  );
}

export default App;
