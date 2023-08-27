import { ThreeDots } from "react-loader-spinner";
type SpinnerProps = {
  height? : string;
  width? : string;
}
const Spinner = ({height, width} : SpinnerProps) => {
  return (
    <ThreeDots
      height={height ? height : "80"}
      width={width ? width : "80"}
      radius="9"
      color="#fffd01"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      visible={true}
    />
  );
};

export default Spinner;
