import { useState } from "react";
import "./App.css";
import Dropzone from "./components/Dropzone";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const [loading, setLoading] = useState<boolean>(false);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <h1>Pitch feedback</h1>
      <Dropzone />
    </>
  );
}

export default App;
