import { useState, useEffect } from "react";

const useMediaQueries = () => {
  const isMediaQuery = window.matchMedia("(max-width: 1100px)");
  const isMediaQuery2 = window.matchMedia("(max-width: 1281px)");
  const isMediaQuery3 = window.matchMedia("(max-width: 1281px) and (min-width: 1030px)");

  const [matches, setMatches] = useState(isMediaQuery.matches);
  const [matches2, setMatches2] = useState(isMediaQuery2.matches);
  const [matches3, setMatches3] = useState(isMediaQuery3.matches);

  const handleMediaQueryChange = () => {
    setMatches(isMediaQuery.matches);
    setMatches2(isMediaQuery2.matches);
    setMatches3(isMediaQuery3.matches);
  };

  useEffect(() => {
    isMediaQuery.addEventListener("change", handleMediaQueryChange);
    isMediaQuery2.addEventListener("change", handleMediaQueryChange);
    isMediaQuery3.addEventListener("change", handleMediaQueryChange);

    return () => {
      isMediaQuery.removeEventListener("change", handleMediaQueryChange);
      isMediaQuery2.removeEventListener("change", handleMediaQueryChange);
      isMediaQuery3.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return { matches, matches2, matches3 };
};

export default useMediaQueries;
