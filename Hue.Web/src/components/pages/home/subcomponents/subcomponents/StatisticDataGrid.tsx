import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Statistic from "../../../../../model/statistics/Statistic";
import SafeAvatar from "../../../../shared/SafeAvatar";
import { artistImage } from "../../../../../api/Artist";
import { characterImage } from "../../../../../api/Char";
import { useNavigate } from "react-router-dom";

export default function StatisticDataGrid(props: {
    statistics: Statistic[]
    statisticType: 'ARTIST' | 'CHARACTER' | 'TAG'
    pageSize?: number
    onClick?: (id: Statistic) => void
}) {

    const { statisticType, statistics, pageSize, onClick } = props

    const nav = useNavigate();

    const rows = statistics ? [...statistics] : []
    const ColumnConfig = [
        {
            field: statisticType === 'TAG' ? 'color' : 'id', headerName: '', width: 64,
            renderCell: (params) => statisticType === 'TAG' ? <>
                <div style={{ width: "48px", height: "48px", background: params.value, borderRadius: "5px" }} />
            </> :
                <SafeAvatar size={48} src={
                    statisticType === 'ARTIST' ? artistImage(params.value)
                        : statisticType === 'CHARACTER' ? characterImage(params.value)
                            : ''
                } />
        },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'count', headerName: 'Comms' },
        {
            field: 'spent', headerName: 'Spent',
            renderCell: (params) => `$${(params.value as number).toLocaleString()}`
        }, {
            field: 'lastSeen', headerName: 'Last Seen',
            renderCell: (params) => !params.value ? "-" : new Date(params.value).toLocaleDateString()
        }
    ] as GridColDef[]

    const navToArtist = (id: number) => nav(`/artists/${id}`)
    const navToCharacter = (id: number) => nav(`/characters/${id}`)

    return <DataGrid autosizeOnMount
        rows={rows} columns={ColumnConfig}
        initialState={{ pagination: { paginationModel: { pageSize: pageSize ?? 5 } } }}
        pageSizeOptions={[pageSize ?? 5]}
        onCellClick={(cell) => {

            if (onClick) {
                console.log(cell)
                onClick(cell.row as Statistic);
                return;
            }

            if (statisticType === 'CHARACTER') {
                navToCharacter(cell.id as number)
            }
            else if (statisticType === 'ARTIST') {
                navToArtist(cell.id as number)
            }
        }}
    />
}