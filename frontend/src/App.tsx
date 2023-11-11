import { useState } from "react";
import "./App.css";
import Dropzone from "./components/Dropzone";
import LoadingScreen from "./components/LoadingScreen";
import { uploadFileToS3 } from "./core";
import { loadingTexts } from "./loadingTexts";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string[]>([]);

  const handleFileSubmit = async (file: File) => {
    setLoadingText(loadingTexts);
    setLoading(true);
    if (!(await uploadFileToS3(file))) {
      setLoading(false);
      return;
    }
    //infinite loading for now
  };

  if (loading) {
    return <LoadingScreen texts={loadingText} />;
  }

  return (
    <>
      <h1>Pitch feedback</h1>
      <Dropzone handleFileSubmit={handleFileSubmit} />
    </>
  );
}

export default App;
