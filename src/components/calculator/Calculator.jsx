import React from "react";
import { Display } from "./Display";
import Buttons from "./Buttons";

const Calculator = () => {
  return (
    <div className="rounded-tl-2xl rounded-bl-2xl border border-black w-[400px] h-[475px] bg-[#d9d9d9]">
      {" "}
      <Display />
      <Buttons />
    </div>
  );
};

export default Calculator;
