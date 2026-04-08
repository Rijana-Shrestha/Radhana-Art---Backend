import { createContext } from "react";
import { axiosInstance } from "../utils/axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {


    const fetchProducts= async () =>{
        try {
            const res= await axiosInstance.get("/products")
            console.log(res.data)
            return res.data
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <ProductContext.Provider value={{fetchProducts}}>
            {children}
        </ProductContext.Provider>
    );
}   