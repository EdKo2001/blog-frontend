import { useEffect, useCallback, DependencyList } from "react";

import useFirstRender from "./useFirstRender";

const useDebounce = (
  effect: () => void,
  dependencies: DependencyList,
  delay = 800
) => {
  const callback = useCallback(effect, dependencies);
  const firstRender = useFirstRender();

  useEffect(() => {
    if (!firstRender) {
      const timeout = setTimeout(callback, delay);
      return () => clearTimeout(timeout);
    }
    return;
  }, [callback, delay]);
};

export default useDebounce;
