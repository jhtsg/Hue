import { CommissionStatus } from "../../../../../model/commission/CommissionEnums"
import CommColumn from "./Column"

export default function CommBoard(props: {
    year: number
}) {

    const { year } = props

    return <>

        <div style={{ display: 'flex', flexWrap: 'nowrap', width: '100%', marginTop: "20px", overflowX: 'auto' }} >
            {CommissionStatus.map((a, i) => <CommColumn code={i} year={year} title={a} />)}
        </div>
    </>

}