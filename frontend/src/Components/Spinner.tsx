import { Oval, ThreeDots } from "react-loader-spinner";
type SpinnerProps = {
  height?: string;
  width?: string;
  color?: string;
};
const Spinner = ({ height, width }: SpinnerProps) => {
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

export const OvalSpinner = ({ height, width, color }: SpinnerProps) => {
  return (
    <Oval
      height={height ? height : "80"}
      width={width ? width : "80"}
      color={color ? color : "#fffd01"}
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="#b3b113"
      strokeWidth={2}
      strokeWidthSecondary={2}
    />
  );
};

export default Spinner;
