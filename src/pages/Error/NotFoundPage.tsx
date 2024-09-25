import Label from "../../components/Text/Label.tsx";
import BlueLink from "../../components/Text/BlueLink.tsx";

const NotFoundPage = () => {
    return (
        <div>
            <Label text='404'/>
            <BlueLink to='/building' text='Вернуться на главную'/>
        </div>
    );
};

export default NotFoundPage;
