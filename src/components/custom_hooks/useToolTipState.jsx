import { useState } from "react";

export const useTooltipState = (initialStates) => {
    const [tooltipStates, setTooltipStates] = useState(initialStates);
  
    const handleEnter = (key, index) => {
      setTooltipStates(prevStates => ({
        ...prevStates,
        [key]: { ...prevStates[key], [index]: true },
      }));
    };
  
    const handleLeave = (key, index) => {
      setTooltipStates(prevStates => ({
        ...prevStates,
        [key]: { ...prevStates[key], [index]: false },
      }));
    };
  
    const handleClick = (key, index) => {
      setTooltipStates(prevStates => ({
        ...prevStates,
        [key]: { ...prevStates[key], [index]: false },
      }));
    };
  
    return [tooltipStates, handleEnter, handleLeave, handleClick];
  };
    