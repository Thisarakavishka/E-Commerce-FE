import { Product } from "./Product";

export interface OrderItem {
    _id: string;
    product: Product;
    quantity: number;
    price: number;
    discountPrice?: number | null;
    totalPrice: number;
    user: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface OrderUser {
    _id: string;
    name: string;
    email: string;
}

export interface Order {
    _id: string;
    user: OrderUser;
    items: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'completed' | 'cancelled';
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
