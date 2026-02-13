"use client";
import { useEffect, useState } from "react";

type SetValue<T> = T | ((val: T) => T);

function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: SetValue<T>) => void] {
  // State to store our value
  // Pass  initial state function to useState so logic is only executed once
  //useLocalStorage 훅을 처음 사용할 때는 로컬 저장소에 값이 없으면 초기값으로 John Doe가 설정됩니다. 하지만 이미 로컬 저장소에 값이 설정되어 있다면 해당 값을 가져오게 됩니다.
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      if (typeof window !== "undefined") {
        // browser code
        const item = window.localStorage.getItem(key);
        // Parse stored json or if none return initialValue
        return item ? JSON.parse(item) : initialValue;
      }
    } catch (error) {
      // If error also return initialValue
      return initialValue;
    }
  });

  // useEffect to update local storage when the state changes
  useEffect(() => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        typeof storedValue === "function"
          ? storedValue(storedValue)
          : storedValue;
      // Save state
      if (typeof window !== "undefined") {
        // browser code
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
