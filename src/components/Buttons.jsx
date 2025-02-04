import React from "react";

const Buttons = () => {
  const operatorClass = "bg-[#5987e4] text-white";
  return (
    <div className="grid grid-cols-4 grid-rows-5 gap-0 leading-[39px] text-[40px]">
      <div className={`${operatorClass} grid-item`}> +</div>
      <div className={`${operatorClass} grid-item`}> - </div>
      <div className={`${operatorClass} grid-item`}> × </div>
      <div className={`${operatorClass} grid-item`}> ÷</div>
      <div className="grid-item bg-white">7</div>
      <div className="grid-item bg-white">8</div>
      <div className="grid-item bg-white bg-white">9</div>
      <div className="col-start-1 row-start-3 grid-item bg-white">4</div>
      <div className="col-start-2 row-start-3 grid-item bg-white">5</div>
      <div className="col-start-3 row-start-3 grid-item bg-white">6</div>
      <div className="col-start-1 row-start-4 grid-item bg-white">1</div>
      <div className="col-start-2 row-start-4 grid-item bg-white">2</div>
      <div className="col-start-3 row-start-4 grid-item bg-white">3</div>
      <div className="row-span-4 col-start-4 row-start-2 flex justify-center items-center bg-[#FF6E25] opacity-69">
        {" "}
        ={" "}
      </div>
      <div className="row-start-5 grid-item bg-white">0</div>
      <div className="row-start-5 grid-item bg-white">.</div>
      <div className="row-start-5 grid-item">C</div>
      {/* 
      //Operators 
      // Number 0 - 9 
      // Decimal 
      // Equal (which will take up majority of the Buttons section) <-- Can be done using Grid*/}
    </div>
  );
};

export default Buttons;
