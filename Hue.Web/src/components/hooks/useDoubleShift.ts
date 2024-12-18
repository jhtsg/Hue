import { useEffect, useState } from 'react';

const useDoubleShift = (callback: () => void, threshold: number = 300) => {
    const [lastShiftTime, setLastShiftTime] = useState<number | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Shift') {
                const now = Date.now();
                if (lastShiftTime && now - lastShiftTime < threshold) {
                    callback(); // Trigger the callback on double Shift
                }
                setLastShiftTime(now);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [lastShiftTime, threshold, callback]);

    return; // No return value needed for this hook
};

export default useDoubleShift;
