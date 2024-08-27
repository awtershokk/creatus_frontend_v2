interface ObjectTableProps {
    title: string;
    data: { id: number; title: string; value: string }[];
    ButtonComponent: () => JSX.Element;
}

const ObjectTable = ({ title, data, ButtonComponent }: ObjectTableProps) => {
    return (
        <div className="flex mt-2 z-10 ">
            <div className="w-auto maxw-[600px]">
                <div className="border border-gray-300 bg-gray-100">
                    <div className="flex justify-between items-center bg-gray-200 border-b border-gray-300 p-2 text-black">
                        <span className="flex-1 text-lg font-bold">{title}</span>
                        <div>
                            <ButtonComponent />
                        </div>
                    </div>
                    <div>
                        {data.map((item) => (
                            <div key={item.id} className="flex border-t border-gray-300">
                                <div className="w-1/2 p-2 text-black font-bold">{item.title}</div>
                                <div className="border-l border-gray-300 h-6 mx-2"></div>
                                <div className="w-1/2 p-2 text-black">{item.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ObjectTable;
