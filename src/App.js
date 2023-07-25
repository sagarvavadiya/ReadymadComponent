import "./App.css";
import TestComponent from "./Components/TestComponent/TestComponent";
import LazyLoadingRoute from "./Components/LazyLoadingRoute";

function App() {
  return (
    <>
      <LazyLoadingRoute />
      <TestComponent />
    </>
  );
}

export default App;
