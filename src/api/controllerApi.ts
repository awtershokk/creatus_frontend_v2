import axios from "axios";
import { Controller, transformControllerData } from "../models/Controller.tsx";

export const fetchControllers = async () => {
    try {
        const response = await axios.get('http://localhost:7001/api/ecl/all');
        const controllers: Controller[] = response.data.data;
        return controllers.map(controller => transformControllerData(controller));
    } catch (error) {
        throw error;
    }
};

export const fetchControllerLabel = async (controllerId: number) => {
    try {
        const { data: { data: { label } } } = await axios.get(`http://localhost:7001/api/ecl/one/${controllerId}`);
        return label;
    } catch (error) {
        throw error;
    }
}
