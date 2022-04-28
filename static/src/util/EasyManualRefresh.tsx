import { createContext, useState, useContext } from 'react';

type EasyManualRefreshType = {
    manualRefresh: () => void;
}

function useEasyManualRefresh(): EasyManualRefreshType {
    const [state, setState] = useState(0);
    const manualRefresh = () => {
        setState((v) => v + 1);
    }
    return { manualRefresh };
}

const EasyManualRefreshContext = createContext<EasyManualRefreshType>({
    manualRefresh: () => {
        throw new Error("nothing manual refresh");
    }
});

const useParentEasyManualRefresh = (): EasyManualRefreshType => {
    let data = useContext(EasyManualRefreshContext);
    return data;
}

const EasyManualRefreshContextProvider = EasyManualRefreshContext.Provider;


export {
    useEasyManualRefresh,
    useParentEasyManualRefresh,
    EasyManualRefreshContextProvider,
};

