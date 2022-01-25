import {createStore} from 'redux'
import counterReducer from '../../features/contact/CounterReducer';
export function configureStore(){
    return createStore(counterReducer);
}

