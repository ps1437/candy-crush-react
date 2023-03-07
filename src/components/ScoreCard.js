import React from "react";

export default function ScoreCard({ score }) {
  return (
    <div className="flex items-center flex-col text-white text-3xl">
      <h1 className="text-4xl  mb-8">Candy crush</h1>
      <div className="flex justify-center items-center space-x-8">
        <p> Score </p>{" "}
        <div class="w-20 h-20 text-2xl bg-red-500   rounded-full  border-white border-4 flex justify-center items-center">
          <p>{score}</p>
        </div>
      </div>
    </div>
  );
}
