import { useEffect, useState } from "react";

const useTimer = (initialSeconds: number) => {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

    useEffect(() => {
        if (secondsLeft <= 0) return;
        const intervalId = setInterval(() => {
            setSecondsLeft((prev) => prev - 1);
        }
        , 1000);

        return () => clearInterval(intervalId);
    }, [secondsLeft]);

    return secondsLeft;
}

export default useTimer;