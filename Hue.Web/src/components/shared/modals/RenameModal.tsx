import { Button, CircularProgress, Dialog, DialogActions, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import ApiAlert from "../ApiAlert";

export default function RenameModal(props:{
    open: boolean,
    setOpen : (val:boolean)=>void,
    itemType:"drive"|"folder"|"file",
    defaultValue?:string,
    loading?:boolean,
    renameError?:any
    onOk:(newName:string)=>void,
}){

    const {defaultValue,onOk,open,setOpen,itemType,loading,renameError} = props;

    const [newName, setNewName] = useState("");

    useEffect(()=>{
        if(open) setNewName(defaultValue ?? "");
    },[open])

    return <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
    <div style={{ padding: "20px" }}>
        <ApiAlert result={renameError} style={{marginBottom:"20px"}}/>
        <div style={{marginBottom:"20px"}}>Specify a new name for this {itemType}:</div>
        <TextField 
            fullWidth
            label="New Name" disabled={loading} placeholder={defaultValue} 
            value={newName} onChange={(e)=>setNewName(e.target.value)}
        />

    </div>

    <DialogActions>
        {
            loading 
            ? <CircularProgress size={32}/>
            : <>
                <Button disabled={loading} onClick={() => setOpen(false)}>Cancel</Button>
                <Button disabled={loading} onClick={() => onOk(newName)}>OK</Button>
            </>

        }
    </DialogActions>

</Dialog>

}