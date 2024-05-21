import { useLocalStorage } from "react-use";

export function useSsrLocalStorage<T>(
  key: string,
  initial: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  if (typeof window === 'undefined') {
    return [initial, () => undefined];
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [storedValue, setStoredValue] = useLocalStorage<T>(key, initial);
    return [storedValue as T, setStoredValue as React.Dispatch<React.SetStateAction<T>>];
  }
}