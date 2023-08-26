import { ChangeEvent } from "react";

type HiddenImage = {
  imageRef : React.RefObject<HTMLInputElement>;
  handleChange : (e : ChangeEvent<HTMLInputElement>) => void
}

const HiddenImage = ({handleChange, imageRef} : HiddenImage) => {
  return (
    <>
      <input
        type="file"
        className="hidden"
        onChange={handleChange}
        accept="image/jpeg,image/png,image/jpg,image/gif"
        ref={imageRef}
      />
    </>
  );
};

export default HiddenImage;
