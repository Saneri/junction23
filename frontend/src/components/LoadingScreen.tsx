import { InfinitySpin } from "react-loader-spinner";

type LoadingScreenProsp = {
  text: string;
};

const LoadingScreen = (props: LoadingScreenProsp) => {
  const { text } = props;
  return (
    <>
      <div>
        <InfinitySpin width="200" color="#4fa94d" />
      </div>
      <h4>{text}</h4>
    </>
  );
};

export default LoadingScreen;
