import Calculator from "./components/calculator/Calculator";
import History from "./components/History";

const App = () => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-[40px] leading-[39px] text-black my-8">
        <span className="text-[40px] font normal">My Calculator App</span>
      </h1>
      <div className="flex flex-row">
        <Calculator />
        <History />
      </div>
    </div>
  );
};

export default App;
