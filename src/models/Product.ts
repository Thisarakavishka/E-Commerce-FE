import { Category } from "./Category";

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    discountPrice: number;
    image: string;
    category: Category;
    salesCount: number;
    stock: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    labels?: string[];
}
