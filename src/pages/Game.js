import React, { useEffect, useState } from "react";
import useSound from "use-sound";
import ScoreCard from "../components/ScoreCard";
import { BOARD_WIDTH, CANDIES } from "../data/Data";
import blank from "../images/blank.png";
import boopSfx from "../sound-effect.mp3";

const notValid = [
  5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54,
  55, 62, 63, 64,
];

export default function Game() {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const [score, setScore] = useState(0);
  const [play, { stop,isPlaying }] = useSound(boopSfx);

  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < BOARD_WIDTH * BOARD_WIDTH; i++) {
      const randomColor = CANDIES[Math.floor(Math.random() * CANDIES.length)];
      randomColorArrangement.push(randomColor);
    }
    setCurrentColorArrangement(randomColorArrangement);
  };

  useEffect(() => {
    createBoard();
  }, []);

  const dragStart = (e) => {
    setSquareBeingDragged(e.target);
  };
  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target);
  };

  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [
        i,
        i + BOARD_WIDTH,
        i + BOARD_WIDTH * 2,
        i + BOARD_WIDTH * 3,
      ];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;

      if (
        columnOfFour.every(
          (square) =>
            currentColorArrangement[square] === decidedColor && !isBlank
        )
      ) {
        sound();
        return setBlankAndUpdteScore(columnOfFour, 4);
      }
    }
  };

  function sound() {
    if (!isPlaying) {
      stop();
      play();
    }
  }

  function setBlankAndUpdteScore(column, scoreAdded) {
    setScore((score) => score + scoreAdded);
    column.forEach((square) => (currentColorArrangement[square] = blank));
    return true;
  }
  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArrangement[i];

      const isBlank = currentColorArrangement[i] === blank;

      if (notValid.includes(i)) continue;

      if (
        rowOfFour.every(
          (square) =>
            currentColorArrangement[square] === decidedColor && !isBlank
        )
      ) {
        sound();
        return setBlankAndUpdteScore(rowOfFour, 4);
      }
    }
  };

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + BOARD_WIDTH, i + BOARD_WIDTH * 2];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;

      if (
        columnOfThree.every(
          (square) =>
            currentColorArrangement[square] === decidedColor && !isBlank
        )
      ) {
        sound();
        return setBlankAndUpdteScore(columnOfThree, 3);
      }
    }
  };

  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && currentColorArrangement[i] === blank) {
        let randomNumber = Math.floor(Math.random() * CANDIES.length);
        currentColorArrangement[i] = CANDIES[randomNumber];
      }

      if (currentColorArrangement[i + BOARD_WIDTH] === blank) {
        currentColorArrangement[i + BOARD_WIDTH] = currentColorArrangement[i];
        currentColorArrangement[i] = blank;
      }
    }
  };

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const notValid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
      ];
      const isBlank = currentColorArrangement[i] === blank;

      if (notValid.includes(i)) continue;

      if (
        rowOfThree.every(
          (square) =>
            currentColorArrangement[square] === decidedColor && !isBlank
        )
      ) {
        sound();
        return setBlankAndUpdteScore(rowOfThree, 3);
      }
    }
  };

  const dragEnd = () => {
    const squareBeingDraggedId = parseInt(
      squareBeingDragged.getAttribute("data-id")
    );
    const squareBeingReplacedId = parseInt(
      squareBeingReplaced.getAttribute("data-id")
    );

    currentColorArrangement[squareBeingReplacedId] =
      squareBeingDragged.getAttribute("src");
    currentColorArrangement[squareBeingDraggedId] =
      squareBeingReplaced.getAttribute("src");

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId + 1,
      squareBeingDraggedId - BOARD_WIDTH,
      squareBeingDraggedId + BOARD_WIDTH,
    ];

    const validMove = validMoves.includes(squareBeingReplacedId);

    const isAColumnOfFour = checkForColumnOfFour();
    const isARowOfFour = checkForRowOfFour();
    const isAColumnOfThree = checkForColumnOfThree();
    const isARowOfThree = checkForRowOfThree();

    if (
      squareBeingReplacedId &&
      validMove &&
      (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)
    ) {
      setSquareBeingDragged(null);
      setSquareBeingReplaced(null);
    } else {
      currentColorArrangement[squareBeingReplacedId] =
        squareBeingReplaced.getAttribute("src");
      currentColorArrangement[squareBeingDraggedId] =
        squareBeingDragged.getAttribute("src");
      setCurrentColorArrangement([...currentColorArrangement]);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100);
    return () => clearInterval(timer);
  }, [
    checkForColumnOfFour,
    checkForRowOfFour,
    checkForColumnOfThree,
    checkForRowOfThree,
    moveIntoSquareBelow,
    currentColorArrangement,
  ]);

  return (
    <div className="grid md:grid-cols-2  h-screen py-4 gap-8 ">
      <div className="grid grid-cols-8  gap-4 bg-black  border-white border-4 p-4 rounded-md">
        {currentColorArrangement.map((candyColor, index) => (
          <img
            key={index}
            className="w-16 h-16  "
            src={candyColor}
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <div className="flex items-center w-full flex-col justify-evenly ">
        <ScoreCard score={score} />

        <button
          onClick={() => setScore(0)}
          class="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
