import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { CounterState } from "./CounterReducer";

export default function ContactPage()
{
    const {data} = useSelector((state:CounterState)=> state);
    return(
        <Typography variant="h2">
            {data}
        </Typography>
    )
}