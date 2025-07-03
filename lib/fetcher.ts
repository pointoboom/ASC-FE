
import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,

})

const fetcher = async (url: string) => {
    try {
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        throw new Error("An unexpected error occurred.");
    }
}

export const fetcherWithBody = async (url: string, method: string, body: any) => {
    try {
        const config: any = {
            method,
            url,
        };
        if (body !== null) {
            config.data = body;
        }
        const response = await axiosInstance(config);
        return response.data;
    } catch (error) {
        throw new Error("An unexpected error occurred.");
    }
}

export default fetcher;