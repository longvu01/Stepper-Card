import UnitStepperCard from "./components/UnitStepperCard";

const App = () => {
  return (
    <div className="w-screen h-screen bg-zinc-800 flex items-center justify-center text-neutral-100 antialiased">
      <div className="w-72 bg-neutral-900 p-4 rounded-lg">
        <UnitStepperCard />
      </div>
    </div>
  );
};

export default App;
