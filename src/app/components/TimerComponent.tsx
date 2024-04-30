import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import Marquee from "react-fast-marquee";
interface TimerProps {
  start: boolean,
  end: boolean,
  minutes: number,
  setMinutes: Dispatch<SetStateAction<number>>,
  seconds: number,
  setSeconds: Dispatch<SetStateAction<number>>,
}
interface ResponseProps {
  _id: string,
  name: string,
  scores: number
}
const TimerComponent = ({
  start,
  end,
  minutes,
  setMinutes,
  seconds,
  setSeconds,
}: TimerProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [scores, setScores] = useState<ResponseProps[]>([]);
  const colorArray = ['#006703', '#e01559', '#2e38ff', '#ff00fa', '#eb8e07']
  const getScores = async () => {
    const response = await fetch('/api/scores');
    const { data } = await response.json();
    setScores(data);
  }
  useEffect(() => {
    let intervalId: any;
    if (isRunning) {
      intervalId = setInterval(() => {
        if (seconds === 59) {
          setMinutes((prevMinutes) => prevMinutes + 1);
          setSeconds(0);
        } else {
          setSeconds((prevSeconds) => prevSeconds + 1);
        }
      }, 1000);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, seconds]);

  useEffect(() => {

    if (start && !end) {
      getScores()
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }, [start, end]);
  return (
    <div className="sm:absolute w-full sm:max-w-[19rem] p-4 sm:top-20 top-0 left-0 text-white">
      <div className="p-2 text-[20px] text-lg flex w-fit bg-[#242424] mr-2 mb-2 rounded-lg">
        <p className="bg-[#121212] rounded-lg p-2">{`${minutes
          .toString()
          .padStart(2, "0")}`}</p>
        <p className="p-2">:</p>
        <p className="bg-[#121212] rounded-lg p-2">{`${seconds.toString().padStart(2, "0")}`}</p>
      </div>
      <div className="bg-[#121212] p-4 hidden sm:block rounded-md">
        <ul className="space-y-2">
          {scores.map((score: ResponseProps, index: number) => (
            <li style={{ background: colorArray[index % colorArray.length] }} className="w-[15rem] flex justify-start space-x-4 px-4 py-2 rounded-2xl" key={index} >
              <p>{index + 1}</p>
              <div className="flex w-full justify-between">
                <h1 className="font-light">{score.name}</h1>
                <p className="font-light">{Math.floor(score.scores / 60).toString().padStart(2, '0')} : {Math.floor(score.scores % 60).toString().padStart(2, '0')}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="block w-full sm:hidden bg-[#121212] p-2 rounded-lg">
        <Marquee>
          {scores.map((score: ResponseProps, index: number) => (
            <div key={index} style={{ background: colorArray[index % colorArray.length] }} className="w-[15rem] flex justify-start space-x-4 mr-2 px-4 py-2 rounded-2xl" >
              <p>{index + 1}</p>
              <div className="flex w-full justify-between">
                <h1 className="font-light">{score.name}</h1>
                <p className="font-light">{Math.floor(score.scores / 60).toString().padStart(2, '0')} : {Math.floor(score.scores % 60).toString().padStart(2, '0')}</p>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default TimerComponent;
