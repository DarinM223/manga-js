import React from 'react'

export type Dimensions = {
  width: number | null,
  height: number | null,
}

export function useMeasure(): [(node: HTMLImageElement | null) => void, Dimensions] {
  const [dimensions, setDimensions] = React.useState<Dimensions>({
    width: null,
    height: null,
  });

  const previousObserver: React.RefObject<ResizeObserver | null> = React.useRef(null);

  const customRef = React.useCallback((node: HTMLImageElement | null) => {
    if (previousObserver.current) {
      previousObserver.current.disconnect();
      previousObserver.current = null;
    }

    if (node?.nodeType === Node.ELEMENT_NODE) {
      const observer = new ResizeObserver(([entry]) => {
        if (entry && entry.borderBoxSize) {
          const { inlineSize: width, blockSize: height } =
            entry.borderBoxSize[0];

          setDimensions({ width, height });
        }
      });

      observer.observe(node);
      previousObserver.current = observer;
    }
  }, []);

  return [customRef, dimensions];
}