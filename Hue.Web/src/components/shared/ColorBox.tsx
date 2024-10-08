import { InputAdornment, TextField } from "@mui/material";

export default function ColorBox(props: {
    color: string,
    setColor: (val: string) => void
}) {

    const { color, setColor } = props

    return <TextField label="Color" value={color}
        onChange={(e) => setColor(e.target.value)} fullWidth
        slotProps={{
            input: {
                startAdornment: <InputAdornment position="start">
                    <div style={{ padding: "10px", backgroundColor: color, borderRadius: '4px' }} />
                </InputAdornment>
            }
        }}
    />

}