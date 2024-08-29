import { Link as RouterLink } from "react-router-dom";

type LinkProps = {
    to: string;
    text: string;
    className?: string;
};

const BlueLink = ({ to, text, className }: LinkProps) => {
    return (
        <RouterLink to={to} className={`${className} text-blue-500 hover:underline`}>
            {text}
        </RouterLink>
    );
};

export default BlueLink;
