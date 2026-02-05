import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

interface SplashContextType {
  /** Whether splash is currently visible */
  isVisible: boolean;
  /** Show the splash screen */
  showSplash: () => void;
  /** Hide the splash screen */
  hideSplash: () => void;
  /** Set splash completion callback */
  onComplete: (callback: () => void) => void;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

export function SplashProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);
  const [completionCallback, setCompletionCallback] = useState<() => void>(
    () => {},
  );

  const showSplash = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hideSplash = useCallback(() => {
    setIsVisible(false);
    completionCallback();
  }, [completionCallback]);

  const onComplete = useCallback((callback: () => void) => {
    setCompletionCallback(() => callback);
  }, []);

  return (
    <SplashContext.Provider
      value={{ isVisible, showSplash, hideSplash, onComplete }}
    >
      {children}
    </SplashContext.Provider>
  );
}

export function useSplash() {
  const context = useContext(SplashContext);
  if (!context) {
    throw new Error('useSplash must be used inside SplashProvider');
  }
  return context;
}
