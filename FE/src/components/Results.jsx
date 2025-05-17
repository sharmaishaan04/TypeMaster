import {
  LineChart,
  Line,
  Label,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Scatter,
  ScatterChart,
  ResponsiveContainer,
  ComposedChart,
  Legend,
  Area,
} from "recharts";
import { Button } from "./ui/moving-border";

const Results = ({ props }) => {
  const {
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
    setGameOver,
    WPM,
  } = props;

  const data = wpmData.map((point, index) => ({
    time: point.time,
    wpm: point.wpm,
    rawWpm: rawWpmData[index]?.rawWpm || 0,
    errors: errorsData[index]?.errors === 0 ? null : errorsData[index]?.errors,
  }));

  const elapsedTime = Math.round(
    (new Date().getTime() - startTimeRef.current) / 1000
  );

  const correctChars =
    inputRef.current.querySelectorAll(".word .correct").length;
  const incorrectChars = inputRef.current.querySelectorAll(
    ".word .letter.incorrect:not(.extra):not(.missed):not(.correct)"
  ).length;
  const missedLetters = inputRef.current.querySelectorAll(
    ".word .letter.missed"
  ).length;
  const extraLetters = inputRef.current.querySelectorAll(
    ".word .letter.extra"
  ).length;

  const charArray = [correctChars, incorrectChars, extraLetters, missedLetters];
  const remainingChars = missedLetters + extraLetters;

  const wordsTyped = correctChars / 5;
  const wpmCalc = (wordsTyped / elapsedTime) * 60;

  const rawWordsTyped = (correctChars + incorrectChars + remainingChars) / 5;
  const rawWpmCalc = (rawWordsTyped / elapsedTime) * 60;

  return (
    <div className="mx-20 relative">
      <div id="upperDiv" className="absolute -top-25 right-10">
        <Button
          onClick={() => {
            newGame();
            setGameOver(false);
          }}
          className="bg-transparent text-primarycolor text-xl h-12 w-12 border-2 border-primarycolor rounded-lg shadow-md shadow-primarycolor transition-all duration-200 hover:scale-105 hover:bg-primarycolor hover:text-black"
        >
          ↻
        </Button>
      </div>

      <div id="middleDiv" className="flex ">
        <div id="wpm&acc" className=" w-[10%] p-2 ">
          <div className="group relative hover:transition-all hover:delay-75">
            <div className="text-textsecondary text-4xl">wpm</div>
            <div className="text-primarycolor text-7xl">
              {Math.round(wpmCalc)}
            </div>
            <div className="rounded-md absolute z-10 invisible group-hover:visible group-hover:transition-all group-hover:delay-75 bg-black p-3 text-center text-md ">
              {wpmCalc}
            </div>
          </div>
          <div className="group relative hover:transition-all hover:delay-75">
            <div className="text-textsecondary text-4xl">acc</div>
            <div className="text-primarycolor text-7xl">
              {Math.round(
                (correctChars /
                  (correctChars + incorrectChars + remainingChars)) *
                  100
              )}
              %
            </div>
            <div className="rounded-md absolute z-10 invisible group-hover:visible group-hover:transition-all group-hover:delay-75 bg-black p-3 text-center text-md ">
              {(correctChars /
                (correctChars + incorrectChars + remainingChars)) *
                100}
            </div>
          </div>
        </div>
        <div
          id="graph"
          className="text-textsecondary bg-bgcolor "
          style={{
            width: "100%",
            height: 300,
            background: "#333",
            padding: "0px",
            color: "#666",
            borderRadius: "8px",
          }}
        >
          <ResponsiveContainer>
            <ComposedChart data={data}>
              <CartesianGrid stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="time" tick={{ fill: "#ccc" }} padding={10}>
                <Label value="Time(s)" position="bottom" />
              </XAxis>
              <YAxis
                // dataKey="wpm"
                yAxisId="left"

                // tick={{ fill: "#ccc" }}
                // label={{
                //   value: "WPM",
                //   angle: -90,
                //   position: "left",
                //   offset: +10,
                // }}
              >
                <Label
                  value="WPM"
                  position="insideLeft"
                  offset={0}
                  angle={-90}
                />
              </YAxis>

              <YAxis
                yAxisId="right"
                orientation="right"
                // tick={{ fill: "#ccc" }}
                label={{
                  value: "Errors",
                  angle: 90,
                  offset: -10,
                  position: "right",
                }}
              />

              <Tooltip
                contentStyle={{
                  background: "#333",
                  borderRadius: "5px",
                  color: "#fff",
                }}
              />

              <Area
                yAxisId="left"
                type="monotone"
                dataKey="rawWpm"
                stroke="gray"
                fill="gray"
                strokeWidth={2}
                dot={{ fill: "gray", r: 3 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="wpm"
                stroke="#fd4"
                strokeWidth={7}
                dot={{ fill: "#fd4", r: 3 }}
              />

              <Scatter
                yAxisId="right"
                dataKey="errors"
                fill="red"
                shape={({ cx, cy, value }) => (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    fontSize={12}
                    fill="red"
                  >
                    ✖
                  </text>
                )}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div id="lowerDiv" className="flex justify-between p-2">
        <div id="testInfo">
          <div className="text-2xl text-textsecondary">
            test info <span className="text-xl text-textprimary">Eng</span>
          </div>

          <div className="text-xl text-textprimary">
            wordLimit:{wordLimit} <br />
            {showBtn ? " timeLimit:" + timeLimit + "s" : ""}
          </div>
        </div>

        <div
          id="raw"
          className="group relative hover:transition-all hover:delay-75"
        >
          <div className="text-2xl text-textsecondary">raw</div>
          <div className="text-4xl text-primarycolor">
            {Math.round(rawWpmCalc)}
          </div>
          <div className="rounded-md absolute z-10 invisible group-hover:visible group-hover:transition-all group-hover:delay-75 bg-black p-3 text-center text-md ">
            {rawWpmCalc}
          </div>
        </div>
        <div
          id="characters"
          className="group relative hover:transition-all hover:delay-75"
        >
          <div className="text-2xl text-textsecondary">characters</div>
          <div className="">
            {charArray.length &&
              charArray.map((item, index) => (
                <span
                  children={item + (index != 3 ? "/" : "")}
                  key={index}
                  className="text-[#fd4] text-4xl"
                />
              ))}
          </div>
          <div className="rounded-md absolute z-10 invisible group-hover:visible group-hover:transition-all group-hover:delay-75 bg-black p-3 text-center text-md ">
            correct <br />
            incorrect <br />
            extra <br />
            missed
          </div>
        </div>
        <div id="consistency">
          <div className="text-2xl text-textsecondary">consistency</div>
          <div className="text-4xl text-primarycolor"></div>
        </div>
        <div id="time">
          <div className="text-2xl text-textsecondary">time</div>
          <div className="text-4xl text-primarycolor">{elapsedTime}s</div>
        </div>
      </div>

      <div id="replay&words">
        <div className="flex space-x-2 flex-wrap text-xl">
          {WPM.map(
            (item, index) =>
              index > 0 && (
                <span
                  key={index}
                  className="group text-textprimary flex  flex-col p-1 rounded-md hover:bg-textsecondary hover:text-bgcolor hover:transition-all hover:delay-75"
                >
                  <span>{item.wordText}</span>
                  <span className="text-center text-bgcolor invisible text-sm group-hover:transition-all group-hover:delay-75 group-hover:visible ">
                    WPM : {}
                  </span>
                </span>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
