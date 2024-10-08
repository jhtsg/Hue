import { useEffect } from "react";

export const usePageTitle = (title?: string) => {
    const setPageTitle = (t?: string) => {
        const subtitle = t && t.length > 0 ? ` - ${t}` : "";
        document.title = `Hue${subtitle}`
    }

    useEffect(() => {
        setPageTitle(title)
    }, [title])

    return setPageTitle;

}