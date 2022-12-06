import React from "react";

const Button = ({text, icon, style, type, onClick}) => {

  const type1 = 'bg-primary hover:bg-purple-200 border-1 border-primary hover:text-gray-300 hover:bg-transparent text-black'
  const type2 = 'bg-alternate text-gray-300 border-2 border-alternate hover:bg-transparent '
  return (
    <button 
      className={`rounded-xl ${type == 1 ? type1 : type2} ${style} text-sm  font-bold transition-all delay-[10]`}
      onClick = {onClick}
    >
      {icon} {text}
    </button>
  );
};

// Button.defaultProps = {
//     color : ''
// }
export default Button;
