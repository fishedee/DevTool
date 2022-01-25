import DefaultLayout from './default';
import { useModel, history, Redirect } from 'umi';

export default (props) => {
    const { initialState } = useModel('@@initialState');
    if (history.location.pathname == '/login') {
        return <>{props.children}</>;
    } else if (!initialState?.currentUser) {
        return <Redirect to="/login" />;
    } else {
        return <DefaultLayout {...props} />;
    }
};
