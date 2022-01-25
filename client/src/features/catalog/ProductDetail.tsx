import { Divider,TextField, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/product";
import NotFound from  "../../app/errors/NotFound" 
import  LoadingComponent  from "../../app/layout/LoadingComponent";
import { useStoreContext } from "../../app/context/StoreContext";

import { LoadingButton } from '@mui/lab';


export default function ProductDetail(){
    const { basket,setBasket, removeItem } = useStoreContext();
    const {id} = useParams<{id: string}>();
    

    const [product,setProduct]  = useState<Product|null>(null);
    const [loading,setLoading] = useState(true);

    const [quantity,setQuantity]  = useState(0);
    const [submitting,setSubmitting] = useState(false);

    const item = basket?.items.find(i=>i.productId === product?.id);
    

    useEffect(()=>{
        console.log(id);
        if(item) setQuantity(item.quantity);
       agent.Catalog.details(parseInt(id)).then(x=>setProduct(x))
       .catch(er=>console.log(er.response)
       ).finally(()=>setLoading(false)) 
    },[id,item])

    function handleInputChange(event:any){
        if(event.target.value >= 0){
            setQuantity(parseInt(event.target.value));
        }
    }

    const handleUpdateCart=()=>{
        setSubmitting(true);
        if(!item || quantity > item.quantity){
            const updateQuantity = item ? quantity - item.quantity : quantity;
            agent.Basket.addItem(product?.id!,updateQuantity)
            .then(basket=>setBasket(basket))
            .finally(()=>setSubmitting(false));
        }else{
            const updatedQuantity = item.quantity - quantity;
            agent.Basket.removeItem(product?.id!,updatedQuantity)
            .then(()=>removeItem(product?.id!,updatedQuantity))
            .finally(()=>setSubmitting(false));
        }

    }

    if(loading) return <LoadingComponent message="Loading product..."/>
    if(!product) return <NotFound/>
    
    

    return(

      <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product?.pictureUrl} style={{width:'100%'}}/>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h3">{product?.name}</Typography>
                <Divider sx={{mb:2}}/>
                <Typography variant="h4">${(product.price/100).toFixed(2)}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product?.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product?.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product?.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity in stock</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                </TableContainer>
                
                <Grid container sx={{marginTop:'10px'}} spacing={2}>
                            <Grid item xs={6}>
                                <TextField variant="outlined" type='number'
                                onChange={handleInputChange}
                                label='Quantity in Cart'
                                    fullWidth
                                    value={quantity}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <LoadingButton 
                                    disabled={item?.quantity === quantity || !item && quantity===0}
                                onClick={handleUpdateCart} loading={submitting} sx={{height:'55px'}} color='primary' size='large' variant="contained">
                                    {item  ? 'Update Quantity' : 'Add to cart'}
                                </LoadingButton>
                            </Grid>
                    </Grid>
            </Grid>
      </Grid>
    )
}