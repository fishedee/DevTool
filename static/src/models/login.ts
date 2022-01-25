import { useState, useCallback } from 'react';
import { myRequest } from 'antd-formily-boost';

//这个model是毫无用处，只是为了提示打开umi打开useModel模块而已
export default function useLoginModel() {
    const [login, setLogin] = useState(false);

    const doNothing = () => {};

    return {
        login,
        doNothing,
    };
}
