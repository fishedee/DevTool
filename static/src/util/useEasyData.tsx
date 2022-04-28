import { useRef } from "react";

type InitFunction<T> = () => T;

function useEasyData<T>(initer: InitFunction<T>): T {
    const isFirst = useRef<boolean>(true);
    const data = useRef<T>();
    if (isFirst.current == true) {
        data.current = initer();
        isFirst.current = false;
    }
    return data.current as T;
}

export default useEasyData;