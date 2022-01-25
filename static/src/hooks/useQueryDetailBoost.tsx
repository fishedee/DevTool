import { useHistory, useLocation } from 'umi';
import { IFormProps } from '@formily/core';
import {
    useForm,
    useQueryDetail,
    UseQueryDetailProps,
    UseQueryDetailOptions,
} from 'antd-formily-boost';

//就是一个简单的组合，将useForm与useQueryDetail组合在一起而已，功能包括：
//* 赋值默认的QueryTable需要的属性
//* 打开cacheKey的功能
function useQueryDetailBoost(
    getUrl: string,
    form: IFormProps<UseQueryDetailProps> = {},
    options?: UseQueryDetailOptions,
) {
    const location: any = useLocation();
    const history = useHistory();
    const id = location?.query?.id as string;
    const formInfo = useForm(
        {
            ...form,
            values: { detail: {} },
        },
        {
            cacheKey: id ? undefined : 'useQueryDetailBoost.' + getUrl,
        },
    );
    const queryDetailInfo = useQueryDetail(
        getUrl,
        id,
        () => {
            history.goBack();
        },
        formInfo.form,
        options,
    );
    return {
        ...formInfo,
        ...queryDetailInfo,
    };
}

export default useQueryDetailBoost;
