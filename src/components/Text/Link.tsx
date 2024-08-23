import { Link as RouterLink } from "react-router-dom";

type LinkProps = {
    to: string;
    text: string;
};

const Link = ({ to, text }: LinkProps) => {
    return (
        <RouterLink to={to} className="text-blue-500 hover:underline">
            {text}
        </RouterLink>
    );
};

export default Link;
