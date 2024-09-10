import { Link as RouterLink } from "react-router-dom";

type LinkProps = {
    to: string;
    text: string;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
};

const BlueLink = ({ to, text, className, onClick }: LinkProps) => {
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (onClick) {
            event.preventDefault();
            onClick(event);
        }
    };

    return (
        <RouterLink to={to} className={`${className} text-blue-500 hover:underline`} onClick={handleClick}>
            {text}
        </RouterLink>
    );
};

export default BlueLink;
