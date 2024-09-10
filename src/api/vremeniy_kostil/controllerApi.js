import axios from "axios";

export const fetchControllerLabel = async (controllerId) => {
    try {
        const { data: { data: { label } } } = await axios.get(`http://localhost:7001/api/ecl/one/${controllerId}`);
        return label;
    } catch (error) {
        throw error;
    }
}
