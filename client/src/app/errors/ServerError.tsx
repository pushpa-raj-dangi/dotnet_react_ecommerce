import { Typography, Container, Paper, Divider,Button } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";

export default function ServerError(){
    const history = useHistory();
    
    const {state} = useLocation<any>();
    return(
        <Container component={Paper} sx={{m:4,p:4}}>
            {
                state?.error ? ( 
                    <>
                    <Typography variant="h5" gutterBottom>
                   {state.error.title}
            </Typography>
            <Divider/>
            <Typography>
                {state.error.detail || 'Internal Error'}
            </Typography>

                    </>
                ):(
                    <Typography variant="h5" gutterBottom>
                    Server Error
            </Typography>
                )
            }
           <Button color="secondary" onClick={()=>history.push('/catalog')}>Go to store</Button>
        </Container>
    )
}


