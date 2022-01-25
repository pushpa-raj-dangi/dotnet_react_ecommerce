import { Typography, Container, Paper, Divider,Button } from "@mui/material";
import {Link} from 'react-router-dom'

export default function NotFound(){
    return(
        <Container component={Paper} sx={{p:5,minHeight:400}}>
<Typography gutterBottom variant='h3'>
        Ooops ! We could not find what you are looking.
</Typography>
<Divider/>
<Button fullWidth component={Link} to='/catalog'>Go back to shop</Button>
        </Container>
    )
}