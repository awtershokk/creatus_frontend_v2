import axios from "axios";
import {MODBUS_API_URL} from "../../modbusApi.js";

export const fetchControllerLabel = async (controllerId) => {
    try {
        const { data: { data: { label } } } = await axios.get(`${MODBUS_API_URL}/ecl/one/${controllerId}`);
        return label;
    } catch (error) {
        throw error;
    }
}
