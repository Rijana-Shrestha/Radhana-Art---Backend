import { createContext } from "react";
import { axiosInstance } from "../utils/axios";

export const GalleryContext = createContext();

export const GalleryProvider = ({ children }) => {


    const fetchGallery = async () => {
        try {
            const res = await axiosInstance.get("/gallery/")
            console.log(res.data)
            return res.data
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <GalleryContext.Provider value={{ fetchGallery }}>
            {children}
        </GalleryContext.Provider>
    );
}
