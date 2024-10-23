// CREDIT: https://medium.com/@jacobvejlinjensen/how-to-create-a-smooth-appear-on-scroll-transition-with-tailwind-css-and-react-82f2a32ab295
import { useEffect, useState } from "react";

export function useIsVisible<T extends Element>(ref: React.RefObject<T>): boolean {
  const [isIntersecting, setIntersecting] = useState<boolean>(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]: IntersectionObserverEntry[]) => {
      setIntersecting(entry.isIntersecting);
    });

    observer.observe(ref.current);
    
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}
