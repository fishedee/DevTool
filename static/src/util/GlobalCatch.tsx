import {Modal} from 'antd';
async function GlobalCatch(handler:()=>Promise<void>|void){
    try{
        await handler();
    }catch(e){
        Modal.error({
            content:'错误:'+e,
        });
    }
}

export default GlobalCatch;