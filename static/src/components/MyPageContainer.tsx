import { PageContainer, PageContainerProps } from '@ant-design/pro-layout';
import { useHistory, useLocation } from 'umi';
import { RedoOutlined } from '@ant-design/icons';
import { createContext } from 'react';
import { useContext } from 'react';
import { Spin } from 'antd';

type PageAction = {
    refresh: () => void;
};
const PageActionContext = createContext<PageAction>({} as PageAction);

export type MyPageContainerProps = PageContainerProps & {
    hiddenBack?: boolean;
};

const MyPageContainer: React.FC<MyPageContainerProps> = (props) => {
    const history = useHistory();
    const context = useContext(PageActionContext);
    const { loading, ...restProps } = props;
    return (
        <PageContainer
            {...restProps}
            onBack={
                props.hiddenBack
                    ? undefined
                    : () => {
                          history.goBack();
                      }
            }
            extra={
                props.extra ? (
                    props.extra
                ) : (
                    <RedoOutlined
                        style={{ fontSize: '20px' }}
                        onClick={() => {
                            context.refresh();
                        }}
                    />
                )
            }
        >
            <Spin spinning={loading}>{props.children}</Spin>
        </PageContainer>
    );
};

export default MyPageContainer;

export { PageActionContext };
