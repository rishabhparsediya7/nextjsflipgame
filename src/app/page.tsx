'use client'
import Confetti from "react-confetti";
import { useState, useEffect, useRef } from "react";
import TimerComponent from "./components/TimerComponent";
import Image from "next/image";
import Footer from "./components/Footer";
import Nav from "./components/Nav";

export default function App() {
  const [startTimer, setStartTimer] = useState<boolean>(false);
  const [endTimer, setEndTimer] = useState<boolean>(false);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [winner, setWinner] = useState<boolean>(false);
  const imagesArray = [
    "apple",
    "banana",
    "mango",
    "kiwi",
    "strawberry",
    "watermelon",
    "peach",
    "pomegranate"
  ];
  const [name, setName] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  let flipArray = [1, 0, 4, 6, 5, 3, 7, 2, 4, 6, 7, 3, 2, 1, 0, 5];
  const MAX_INDEX = 16;
  const ref = useRef<HTMLDivElement[]>([]);
  const [numbers, setNumber] = useState<number[]>([]);
  const [display, setDisplay] = useState<boolean[]>(Array.from({ length: 16 }).fill(false) as boolean[]);
  const [turn, setTurn] = useState("1");
  const [indexes, setIndexes] = useState({ prev: -1, current: -1 });
  const showValue = (index: number) => {
    const newDisplay = [...display];
    newDisplay[index] = true;
    setDisplay(newDisplay);
  };
  const hideValue = (prev: number, index: number) => {
    const newDisplay = [...display];
    newDisplay[index] = false;
    newDisplay[prev] = false;
    setDisplay(newDisplay);
  };
  const checkValuesAreTrue = (prevIndex: number, currentIndex: number) => {
    const prevElement = ref.current[prevIndex];
    const currentElement = ref.current[currentIndex];
    if (!prevElement || !currentElement) {
      return false;
    }
    const previousValue = parseInt(
      prevElement.querySelector("h1")?.innerHTML || '0'
    );
    const currentValue = parseInt(
      currentElement.querySelector("h1")?.innerHTML || '0'
    );
    return previousValue === currentValue;
  };

  const handleDisplay = (index: number) => {
    showValue(index);
    if (turn === "1") {
      setIndexes((ind) => ({ ...ind, prev: index }));
      setTurn("2");
    } else if (turn === "2") {
      setIndexes((ind) => ({ ...ind, current: index }));
      const check = checkValuesAreTrue(indexes.prev, index);
      if (check) {
        console.log("previous numbers are same");
      } else {
        setTimeout(() => {
          hideValue(indexes.prev, index);
        }, 200);
      }
      setIndexes({ prev: -1, current: -1 });
      setTurn("1");
    }
  };
  const getNumbers = () => {
    for (let i = 0; i < flipArray.length; i++) {
      const index1 = Math.floor(Math.random() * MAX_INDEX);
      const index2 = Math.floor(Math.random() * MAX_INDEX);
      const temp = flipArray[index2];
      flipArray[index2] = flipArray[index1];
      flipArray[index1] = temp;
    }
    return flipArray;
  };
  const updateScores = async (score: number) => {
    const name = localStorage.getItem('name');
    const response = await fetch(`/api/scores`, {
      method: 'POST',
      body: JSON.stringify({ name: name, scores: score }),
    })
    const data = await response.json();
    console.log(data)
  }
  const getWinner = () => {
    const check = display.every((value) => value === true);
    if (check) {
      console.log(`${minutes}:${seconds}`);
      const score: number = minutes * 60 + seconds;
      console.log(score);
      updateScores(score);
      setWinner(true);
      setEndTimer(true);
      setTimeout(() => {
        window.location.reload();
      }, 10000);
      const newDisplay = Array.from({ length: 16 }).fill(false) as boolean[];
      setDisplay(newDisplay);
    }
    return check;
  };
  const handleModal = () => {
    localStorage.setItem("name", name);
    setStartTimer(true);
    setShow(false);
  };

  useEffect(() => {
    getNumbers();
  }, []);
  useEffect(() => {
    setNumber(flipArray);
    setHeight(window.innerHeight)
    setWidth(window.innerWidth)
    if (localStorage.getItem("name") !== null) {
      setStartTimer(true);
    }
    if (localStorage.getItem("name") === null) {
      setShow(true);
    }
  }, []);
  getWinner();
  return (
    <div className="App">
      <Nav />
      <TimerComponent
        minutes={minutes}
        setMinutes={setMinutes}
        seconds={seconds}
        setSeconds={setSeconds}
        start={startTimer}
        end={endTimer}
      />
      <div className="box p-4">
        {numbers.length === MAX_INDEX &&
          numbers.map((flip, index) => (
            <div
              ref={(e) => {
                if (e !== null && ref.current !== null)
                  ref.current[index] = e;
              }}
              onClick={() => handleDisplay(index)}
              key={index}
              className="flip-box"
            >
              <Image
                className={`${display[index] ? `block` : `hidden`} h-[50px] w-[50px]`}
                src={`/${imagesArray[flip]}.png`}
                alt={imagesArray[flip]}
                height={500}
                width={500}
              />
              <h1 style={{ display: "none" }}>{flip}</h1>
            </div>
          ))}
      </div>
      <div
        style={{ display: show ? "inline-flex" : "none" }}
        className="modal flex justify-center absolute p-2 sm:px-6 w-full"
      >
        <div className="modal-container border relative border-gray-600 bg-[#242424] flex h-[20rem] w-full sm:w-[25rem] rounded-xl">
          <div
            className="absolute top-0 right-4 cursor-pointer"
            // onClick={() => setShow(false)}
          >
            <h1 className="text-white text-2xl">×</h1>
          </div>
          <div className="w-full flex flex-col justify-center p-4 items-center text-white space-y-4">
            <h1 className="text-lg text-left">Enter your name</h1>
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#363636] w-full outline-none p-2 rounded-md"
              />
            </div>
            <div className="w-full">
              <button
                onClick={handleModal}
                className="p-2 bg-[#363636] uppercase tracking-wider border border-[#363636] hover:border-indigo-500 w-full rounded-md"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {winner === true ? (
        <h1 style={{ color: "white" }}>Yayyy! We solved this!</h1>
      ) : (
        <div className="p-10">
          {turn === "1" && (
            <h1 className="capitalize">Chose first symbol</h1>
          )}
          {turn === "2" && (
            <h1 className="capitalize">Chose second symbol</h1>
          )}
        </div>
      )}
      {winner && <Confetti width={width} height={height} />}
      <Footer />
    </div>
  );
}
