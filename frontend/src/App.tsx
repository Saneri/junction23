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

    let text = null;
    while (text == null) {
      text = await getResult(analysisPayload.id);

      if (text) {
        setLoading(false);
        setResultText(text);
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  };
  if (resultText) {
    return (
      <>
        <h4>result</h4>
        <div>{resultText}</div>
      </>
    );
  }

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
