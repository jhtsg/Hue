import { AccessTime, BeachAccess, Notifications, Publish, ScheduleSend } from "@mui/icons-material";
import { Badge, CircularProgress, IconButton, ListItem, Menu, MenuItem } from "@mui/material";
import useApi from "../../hooks/useApi";
import { getAlerts } from "../../../api/Comm";
import { useState } from "react";
import CommissionAlert from "../../../model/commission/CommissionAlert";
import { useNavigate } from "react-router-dom";
import ApiAlert from "../../shared/ApiAlert";

export default function AlertButton() {

    const [anchorEl, setAnchorEl] = useState(null as null | HTMLElement);
    const alertsApi = useApi(getAlerts, true)
    const nav = useNavigate();

    const handleClose = () => {
        setAnchorEl(null);
    };

    return <>
        <IconButton onClick={(e) => {
            setAnchorEl(e.currentTarget)
            alertsApi.fetch()
        }}>
            <Badge badgeContent={alertsApi.data?.length ?? 0} color="secondary">
                <Notifications />
            </Badge>
        </IconButton>
        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose} slotProps={{ paper: { style: { width: "400px" } } }}>
            <ListItem>{alertsApi.data?.length ?? 0} Alert(s)</ListItem>
            <ApiAlert result={alertsApi.error} />
            {alertsApi.loading ?
                <ListItem><div style={{ textAlign: "center", width: "100%", padding: "20px" }}><CircularProgress color="secondary" /></div></ListItem>
                : (alertsApi.data?.length ?? 0) === 0 ?
                    <ListItem><div style={{ textAlign: "center", width: "100%", padding: "20px" }}>
                        <BeachAccess />
                        <div>No Alerts!</div>
                    </div></ListItem>
                    : alertsApi.data?.map(a => <MenuItem onClick={() => {
                        handleClose();
                        nav(`/commissions/${a.id}`)
                    }}>
                        <AlertHandler alert={a} />
                    </MenuItem>)}
        </Menu>
    </>

}

function AlertHandler(props: { alert: CommissionAlert }) {

    const { alert } = props;

    return <div style={{ display: "flex", alignItems: 'center' }}>
        {alert.status === 2 ? <AccessTime /> : alert.status === 3 ? <ScheduleSend /> : <></>}
        <div style={{ flex: "1", marginLeft: "15px" }}>
            <div style={{ fontSize: ".9em" }}><b>{alert.name}</b></div>
            <div style={{ fontSize: ".7em" }}>{alert.status === 2 ? `This commission was expected ${alert.daysOverdue} day(s) ago` : alert.status === 3 ? `This commission should've been posted ${alert.daysOverdue} day(s) ago` : "Uh..."}</div>
        </div>
    </div>
}