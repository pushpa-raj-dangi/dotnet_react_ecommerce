import { Alert, AlertTitle, Button, Container, List, ListItem, ListItemText, Typography } from "@mui/material"
import { useState } from "react";
import agent from "../../app/api/agent"
export default function AboutPage(){
    const [validationErros,setValidationErros] = useState<string[]>([]);

    function getValidationError(){
        agent.TestErrors.getValidationError()
        .then(()=>{console.log('should no seed thies')})
        .catch(error=>setValidationErros(error))
    }
    return(
        <Container>
            <Typography gutterBottom variant="h2">Error for testing purposes</Typography>
            <Button variant="contained" onClick={()=>agent.TestErrors.get400Error().catch(error=>console.log(error))}>Test 400 Error</Button>
            <Button variant="contained" onClick={()=>agent.TestErrors.get401Error().catch(error=>console.log(error))}>Test 401 Error</Button>
            <Button variant="contained" onClick={()=>agent.TestErrors.get404Error().catch(error=>console.log(error))}>Test 404 Error</Button>
            <Button variant="contained" onClick={()=>agent.TestErrors.get500Error().catch(error=>console.log(error))}>Test 500 Error</Button>
            <Button variant="contained" onClick={getValidationError}>Test Validation Error</Button>

            {validationErros.length > 0 && <Alert severity='error'><AlertTitle>Validation Errors</AlertTitle>
            <List>
                {validationErros.map((error:any)=>( 
                    <ListItem>
                        <ListItemText>
                            {error}
                        </ListItemText>
                    </ListItem>))}
            </List>
            </Alert>}

        </Container>
    )
}

