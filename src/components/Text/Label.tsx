type LabelProps = {
    text: string;
};

const Label = ({ text }: LabelProps) => {
    return (
        <h1 className="text-black text-2xl ">{text}</h1>
    );
};

export default Label;
