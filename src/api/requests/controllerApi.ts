import axios from "axios";
import { Controller, transformControllerData } from "../../models/Controller.tsx";
import {MODBUS_API_URL} from "../modbusApi.js";

export const fetchControllers = async () => {
    try {
        const response = await axios.get(`${MODBUS_API_URL}/ecl/all`);
        const controllers: Controller[] = response.data.data;
        return controllers.map(controller => transformControllerData(controller));
    } catch (error) {
        throw error;
    }
};

export const fetchControllerLabel = async (controllerId: number) => {
    try {
        const { data: { data: { label } } } = await axios.get(`${MODBUS_API_URL}/ecl/one/${controllerId}`);
        return label;
    } catch (error) {
        throw error;
    }
}
