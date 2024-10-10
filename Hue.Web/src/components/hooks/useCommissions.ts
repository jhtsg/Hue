import { useEffect, useState } from "react";
import CommissionFilterOptions from "../../model/commission/CommissionFilterOptions";
import { getCommissions, getCommissionsCount } from "../../api/Comm";
import useApi from "./useApi";
import Commission from "../../model/commission/Commission";


export const useCommissions = (filter: CommissionFilterOptions) => {

    const [comms, setComms] = useState([] as Commission[])
    const [page, setPage] = useState(0)

    const commsApi = useApi(getCommissions)
    const countApi = useApi(getCommissionsCount)

    const refresh = () => {
        setComms([])
        setPage(0);
        countApi.fetch(undefined, undefined, filter)
        showMore(0, []);
    }

    const hasMore = countApi.data?.count !== comms.length

    const showMore = (pageOverride?: number, commsOverride?: Commission[]) => {

        commsApi.fetch((moreComms) => {
            if (moreComms) {
                setComms([...(commsOverride ?? comms), ...moreComms])
                setPage((pageOverride ?? page) + 1)
            }
        }, undefined, { ...filter, Page: pageOverride ?? page } as CommissionFilterOptions)

    }

    useEffect(refresh, [])




    return { comms, hasMore, showMore: () => showMore(), refresh, loading: commsApi.loading || countApi.loading, count: countApi.data?.count };

}