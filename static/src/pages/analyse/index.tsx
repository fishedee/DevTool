import { useEasyManualRefresh } from '@/util/EasyManualRefresh';
import useEasyData from '@/util/useEasyData';
import axios from 'axios';
import {Input,Button} from 'antd';
import { useRef } from 'react';
import MonacoEditor from 'react-monaco-editor';
import GlobalCatch from '@/util/GlobalCatch';
import { indexOf } from 'underscore';
import {Modal} from 'antd';
import moment from 'moment';
var beautify = require('js-beautify').js;
import {history} from 'umi';

class PageModel{
    public data:{
        url?:string,
        header?:string,
        dataDesc?:string,
        data?:any,
        columnDesc?:string,
    } = {};

    public constructor(){

    }
    
    private getData():any[]{
        let list = this.data.data;
        if( !list ){
            throw new Error("还没执行抓取数据");
        }
        let dataDesc = this.data.dataDesc;
        if( !dataDesc ){
            dataDesc = "";
        }
        let descList = dataDesc.split(".");
        let currentDesc = "";
        descList.forEach(single=>{
            if( !single ){
                return;
            }
            currentDesc = currentDesc+"."+single;
            if( typeof list != 'object'){
                throw new Error("list在"+currentDesc+"不为object");
            }
            list = list[single];
        })
        if( typeof list != 'object' ||
            list instanceof Array == false ){
                throw new Error("list不为数组:["+currentDesc+"]");
            }
        return list;
    }

    private getColumnDesc(list:any[]){
        let columnDesc:any = this.data.columnDesc;
        if( !columnDesc ){
            throw new Error("列描述为空");
        }
        try{
            columnDesc = JSON.parse(columnDesc);
        }catch(e){
            throw new Error('列描述不是有效的JSON');
        }
        if( typeof columnDesc != 'object' && columnDesc instanceof Array == false ){
            throw new Error("列描述不是有效的数组");
        }
        return columnDesc.map((single:any)=>{
            let field = single.field;
            if( !field ){
                throw new Error("列描述中的field为空");
            }
            let converter = single.converter;
            if( converter === undefined || converter == ''){

            }else if( converter == 'toFloat'){
                list.forEach(single2=>{
                    single2[field] = Number.parseFloat(single2[field]);
                })
            }else if( converter == 'toYear'){
                list.forEach(single2=>{
                    const t = moment(single2[field], 'YYYY-MM-DD HH:mm:ss');
                    single2[field] = t.format('YYYY');
                })
            }else if( converter == 'toMonth'){
                list.forEach(single2=>{
                    const t = moment(single2[field], 'YYYY-MM-DD HH:mm:ss');
                    single2[field] = t.format('YYYY-MM');
                })
            }else if( converter == 'toDate'){
                list.forEach(single2=>{
                    const t = moment(single2[field], 'YYYY-MM-DD HH:mm:ss');
                    single2[field] = t.format('YYYY-MM-DD');
                })
            }else if( converter == 'toWeek'){
                list.forEach(single2=>{
                    const t = moment(single2[field], 'YYYY-MM-DD HH:mm:ss');
                    single2[field] = t.format('YYYY-WW');
                })
            }else{
                throw new Error("列描述中的converter不正确["+converter+"]");
            }
            single.converter = undefined;
            return single;
        })
    }
    public next():{list:any[],column:any}{
        let list = this.getData();
        let columnDesc = this.getColumnDesc(list);
        return {
            list:list,
            column:columnDesc,
        }
    }

    public autoCalculateColumnDesc(){
        let list = this.getData();
        if( list.length == 0 ){
            throw new Error("数据为空，无法自动计算列描述");
        }
        let target = list[0];
        if( typeof target != 'object' && target instanceof Array == false ){
            throw new Error("数组元素必须为对象类型");
        }
        let columnDesc = [];
        for( let i in target ){
            let single = target[i];
            if( typeof single == 'string' && i.toLowerCase().indexOf('time') != -1 ){
                columnDesc.push({
                    headerName:i,
                    field:i,
                    filter:'agDateColumnFilter',
                    enableRowGroup:true,
                });
            }else if( typeof single == 'string'){
                columnDesc.push({
                    headerName:i,
                    field:i,
                    filter:'agSetColumnFilter',
                    enableRowGroup:true,
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                });
            }else{
                columnDesc.push({
                    headerName:i,
                    field: i,
                    filter: 'agNumberColumnFilter',
                    aggFunc: 'sum',
                });
            }
        }
        this.data.columnDesc = beautify(JSON.stringify(columnDesc), {
            indent_size: 2,
            space_in_empty_paren: true,
        });
    }

    public async fetch(){
        let url = this.data.url;
        if( !url ){
            throw new Error('未填写url');
        }
        let header = this.data.header;
        let headerMap:Record<string,string> = {};
        if( header ){
            let headerSplit = header.split('\n');
            headerSplit.forEach(single=>{
                let splitInfo = single.split(":");
                if( splitInfo.length != 2 ||
                    splitInfo[0].length == 0 ||
                    splitInfo[1].length == 0 ){
                    return;
                }
                headerMap[splitInfo[0]] = splitInfo[1];
            })
        }
        let result = await axios({
            method:'GET',
            url:'/api/crawl/get',
            params:{
                data:JSON.stringify({
                    url:url,
                    header:headerMap,
                })
            }
        });
        if( result.data.code != 0 ){
            throw new Error(result.data.msg);
        }
        let responseJson:any;
        try{
            responseJson = JSON.parse(result.data.data);
            this.data.data = responseJson;
        }catch(e){
            throw new Error("JSON格式化错误");
        }
        if( responseJson.code && responseJson.code != 0 && responseJson.msg != ''){
            throw new Error("抓取数据失败：["+responseJson.msg+"]");
        }
        Modal.success({
            content:'抓取数据成功，请在控制台查看数据'
        });
        console.log(responseJson);
    }
}

const Default:React.FC<any> = (props)=>{
    const {manualRefresh} = useEasyManualRefresh();
    const data = useEasyData(()=>{
        return new PageModel();
    });
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                position:'absolute',
                gap:'15px',
                top:'0px',
                bottom:'0px',
                left:'0px',
                right:'0px',
                width:'100%',
                height:'100%',
                boxSizing: 'border-box',
            }}
        >
            <div>抓取的URL:</div>
            <div>
                <Input placeholder="请输入" value={data.data.url} onChange={(e)=>{
                    data.data.url = e.target.value;
                    manualRefresh();
                }}/>
            </div>
            <div>抓取的头部:</div>
            <div
                style={{
                    flex: '1',
                    border: '1px solid black',
                    height: '100%',
                }}
            >
                
                <MonacoEditor
                    language="javascript"
                    theme="vs"
                    defaultValue={''}
                    options={{
                        selectOnLineNumbers: true,
                    }}
                    onChange={(e)=>{
                        data.data.header = e;
                    }}
                />
            </div>
            <div>列表索引描述:</div>
            <div>
                <Input placeholder="请输入" value={data.data.dataDesc} onChange={(e)=>{
                    data.data.dataDesc = e.target.value;
                    manualRefresh();
                }}/>
            </div>
            <div>列描述（converter有toFloat,toDate,toWeek,toMonth,toYear）:</div>
            <div
                style={{
                    flex: '2',
                    border: '1px solid black',
                    height: '100%',
                }}
            >
                
                <MonacoEditor
                    language="javascript"
                    theme="vs"
                    value={data.data.columnDesc}
                    options={{
                        selectOnLineNumbers: true,
                    }}
                    onChange={(e)=>{
                        data.data.columnDesc = e;
                    }}
                />
            </div>
            <div style={{display:'flex',flexDirection:'row',gap:'10px'}}>
                <Button style={{flex:'1'}}  type="primary" disabled={!data.data.url} onClick={()=>{
                    GlobalCatch(async()=>{
                        await data.fetch();
                        manualRefresh();
                    });
                }}>第1步：抓取数据</Button>
                <Button style={{flex:'1'}} type="primary" disabled={!data.data.data}  onClick={()=>{
                    GlobalCatch(async()=>{
                        await data.autoCalculateColumnDesc();
                        manualRefresh();
                    });
                }}>第2步（可选）：自动生成列描述</Button>
                <Button style={{flex:'1'}} type="primary" disabled={!data.data.data || !data.data.columnDesc} onClick={()=>{
                    GlobalCatch(()=>{
                        let nextData = data.next();
                        history.push({
                            pathname:'/analyse/list',
                            state:nextData,
                        });
                        console.log('nextData',nextData);
                    });
                }}>第3步：数据分析</Button>
            </div>
        </div>
    );
}

export default Default;