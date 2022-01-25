import { Container, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Header from './Header';
import Catalog from '../../features/catalog/catalog';
import HomePage from  "../../features/home/HomePage" 
import ContactPage from  "../../features/contact/ContactPage" 
import AboutPage from  "../../features/about/AboutPage" 
import BasketPage from  "../../features/basket/BasketPage" 
import CheckoutPage from  "../../features/basket/BasketPage" 


import ProductDetail from  "../../features/catalog/ProductDetail" 
import ServerError from  "../../app/errors/ServerError" 
import NotFound from  "../../app/errors/NotFound" 


import {getCookie } from '../utils/util'
import { useEffect, useState } from 'react';
import { Route,Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useStoreContext } from '../context/StoreContext';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';


export default function App() {

  const {setBasket} = useStoreContext();
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    const buyerId = getCookie('buyerId');
    if(buyerId){
      agent.Basket.get()
      .then(basket=>setBasket(basket))
      .catch(error=> console.log(error))
      .finally(()=>setLoading(false))
    }else{
      setLoading(false);
    }
  },[setBasket])


  const [darkMode,setDarkMode] = useState(false);



  const palleteType = darkMode ? 'dark' : 'light';

  const  toggleDarkMode=()=> {
    setDarkMode(!darkMode);
  };

  const theme = createTheme({
   palette:{
     mode:palleteType,
     background:{
      default: palleteType === 'light' ? '#f5f5f5' : '#121212'
   }
  }
  });

  if(loading) return <LoadingComponent message='Initilizing app...'/>


  
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position='bottom-right' />
      <CssBaseline/>
     <Header darkMode={darkMode} handleThemeChange={toggleDarkMode} />
     <Container>
       <Switch>
       <Route exact path='/' component={HomePage} />
       <Route exact path='/catalog' component={Catalog}/>
       <Route path='/catalog/:id' component={ProductDetail} />
       <Route path='/about' component={AboutPage} />
       <Route path='/contact' component={ContactPage} />
       <Route path='/server-error' component={ServerError} />
       <Route path='/basket' component={BasketPage} />
       <Route path='/checkout' component={CheckoutPage} />

       <Route component={NotFound} />
       </Switch>
     </Container>
    </ThemeProvider>
  );
}

