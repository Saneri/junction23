import { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";

type LoadingScreenProsp = {
  texts: string[];
};

const LoadingScreen = (props: LoadingScreenProsp) => {
  const { texts } = props;
  const [message, setMessage] = useState<string>("");

  const messageDisplaySeconds = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      if (texts.length > 0) {
        const randomIndex = Math.floor(Math.random() * texts.length);
        setMessage(texts[randomIndex]);
      }
    }, messageDisplaySeconds * 1000);
    return () => clearInterval(interval);
  }, [texts]);

  return (
    <>
      <div>
        <InfinitySpin width="200" color="#4fa94d" />
      </div>
      <h4>{message}</h4>
    </>
  );
};

export default LoadingScreen;
