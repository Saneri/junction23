import { useState } from "react";
import "./App.css";
import Dropzone from "./components/Dropzone";
import LoadingScreen from "./components/LoadingScreen";
import { uploadFileToS3 } from "./core";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>("");

  const handleFileSubmit = async (file: File) => {
    setLoading(true);
    setLoadingText("Sending video to god knows where...");
    await uploadFileToS3(file);
  };

  if (loading) {
    return <LoadingScreen text={loadingText} />;
  }

  return (
    <>
      <h1>Pitch feedback</h1>
      <Dropzone handleFileSubmit={handleFileSubmit} />
    </>
  );
}

export default App;
