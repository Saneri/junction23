import { useState } from "react";
import "./App.css";
import Dropzone from "./components/Dropzone";
import LoadingScreen from "./components/LoadingScreen";
import { analyze, uploadFileToS3 } from "./core";
import { loadingTexts } from "./loadingTexts";
import { getResult } from "./services/uploads";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string[]>([]);
  const [resultText, setResultText] = useState<string | null>(null);
  const [resultPage, setResultPage] = useState<boolean>(false);

  const handleFileSubmit = async (file: File) => {
    setLoadingText(loadingTexts);
    setLoading(true);
    const uploadPayload = await uploadFileToS3(file);
    if (!uploadPayload) {
      setLoading(false);
      return;
    }
    const analysisPayload = await analyze(uploadPayload.key);
    if (!analysisPayload) {
      setLoading(false);
      return;
    }

    while (resultText == null) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const text = await getResult(analysisPayload.id);

      if (text) {
        setLoading(false);
        setResultText(text);
        setResultPage(true);
      }
    }
  };
  if (resultPage) {
    return (
      <>
        <h1>Pitchbot</h1>
        <div>{resultText}</div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <h1>Pitchbot</h1>
        <LoadingScreen texts={loadingText} />
      </>
    );
  }

  return (
    <>
      <h1>Pitchbot</h1>
      <Dropzone handleFileSubmit={handleFileSubmit} />
    </>
  );
}

export default App;
