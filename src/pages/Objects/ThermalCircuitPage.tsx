import { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import EditButton from "../../components/Buttons/EditButton.tsx";
import AddButton from "../../components/Buttons/AddButton.tsx";
import ObjectTable from "../../components/Tables/ObjectTable.tsx";
import ChildElementsTable from "../../components/Tables/ChildElementsTable.tsx";
import Link from "../../components/Text/Link"
import {useParams} from "react-router-dom";
import {fetchThermalCircuit} from "../../api/thermalCircuitsApi.ts";

const ThermalCircuitPage = () => {
    const { thermalCircuitId } = useParams();
    const [thermalCircuit, setThermalCircuit] = useState<Array<{ id: number, title: string, value: string | number }>>([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const thermalCircuitData = await fetchThermalCircuit(thermalCircuitId);
                setThermalCircuit(thermalCircuitData);
                const labelItem = thermalCircuitData.find(item => item.title === 'Наименование');
                localStorage.setItem('thermalCircuit', JSON.stringify({ label: labelItem?.value, icon: 'FaThermometerHalf' }));

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        };

        getData();
    }, [thermalCircuitId]);

    return (
        <DefaultLayout>
            <div className="flex justify-between">
                <div className="w-1/2">
                    <Label text="Информация о тепловом контуре"/>
                    <ObjectTable
                        title="Свойства теплового контура"
                        data={thermalCircuit}
                        ButtonComponent={EditButton}
                    />
                </div>
                {/*<div className="w-full flex flex-col items-end mt-8 mr-8">*/}
                {/*    <ChildElementsTable*/}
                {/*        infoData={sections}*/}
                {/*        tableTitle="Секции"*/}
                {/*        ButtonComponent={AddButton}*/}
                {/*        LinkComponent={Link}*/}
                {/*    />*/}
                {/*</div>*/}
            </div>
        </DefaultLayout>
    );
};

export default ThermalCircuitPage;
