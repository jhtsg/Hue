import { REFRESH_SPECIFIC_COLUMN_PREFIX } from "../contexts/RefreshContext"
import { useRefresh } from "./useRefresh"

export const useCommColumnRefreshers = () => {
    const { refresh: refreshBrainstorm } = useRefresh(REFRESH_SPECIFIC_COLUMN_PREFIX + "0")
    const { refresh: refreshScheduled } = useRefresh(REFRESH_SPECIFIC_COLUMN_PREFIX + "1")
    const { refresh: refreshInProgress } = useRefresh(REFRESH_SPECIFIC_COLUMN_PREFIX + "2")
    const { refresh: refreshDone } = useRefresh(REFRESH_SPECIFIC_COLUMN_PREFIX + "3")
    const { refresh: refreshPublished } = useRefresh(REFRESH_SPECIFIC_COLUMN_PREFIX + "4")

    //Today in absolutely insane things you would never be able to do normally
    const refreshers = [refreshBrainstorm, refreshScheduled, refreshInProgress, refreshDone, refreshPublished]

    return refreshers;
}

