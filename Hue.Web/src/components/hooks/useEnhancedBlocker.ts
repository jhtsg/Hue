import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

export default function useEnhancedBlocker(dirty: boolean) {

    // Handle browser tab/window close
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (dirty) {
                event.preventDefault();
                event.returnValue = ''; // This shows the unsaved changes warning
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [dirty]);

    return useBlocker(dirty);
}
