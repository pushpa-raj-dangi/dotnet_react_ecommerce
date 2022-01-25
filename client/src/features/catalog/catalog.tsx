import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { Product } from "../../app/models/product";
import  LoadingComponent  from "../../app/layout/LoadingComponent";
import ProductList from "./ProductList";
import agent from '../../app/api/agent';

export default function Catalog(){
    const [products,setProducts] = useState<Product[]>([]);
    const [loading,setLoading] = useState(true);



  useEffect(()=>{ 
    agent.Catalog.list().then(products=>setProducts(products))
    .catch(error=>console.log(error))
    .finally(()=>setLoading(false))
   },[])


   if(loading) return <LoadingComponent/>

  function addProduct(){
    setProducts([...products,{id:1,name:'hello',price:22.3, brand:'brand', pictureUrl:'url', quantityInStock:2,description:'desc',type:'type'}]);
  }
  
    return(
        <>
        <ProductList products={products}/>

        <Button variant="contained" onClick={addProduct}>Add Prdouct</Button>
      </>
    )
}
