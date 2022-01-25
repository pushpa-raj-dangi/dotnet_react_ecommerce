import { BasketItem } from "./BasketItem";

export interface Basket{
    id:number;
    buyerId:string;
    items:BasketItem[];
}