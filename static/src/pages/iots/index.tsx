import { Button, Dropdown, Menu, Space, Tag } from 'antd';
import ProCard from '@ant-design/pro-card';
import {
    SearchOutlined,
    CheckCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import MonacoEditor from 'react-monaco-editor';
import { useEffect, useRef } from 'react';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
var beautify = require('js-beautify').js;
import TypeTree, { TypeNameAssigner, TypeTreeBuilder } from '@/util/TypeTree';
import IoTsGenerator from '@/util/IoTsGenerator';

function convertIotsCode(instance:string):string{
    let typeTree = new TypeTreeBuilder(JSON.parse(instance)).build();
    new TypeNameAssigner(typeTree).assign();
    return new IoTsGenerator(typeTree).generate();
}

const Default:React.FC<any> = (props)=>{
    const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor>();
    const editorRef2 = useRef<monacoEditor.editor.IStandaloneCodeEditor>();
    const options = {
        selectOnLineNumbers: true,
    };
    useEffect(() => {
        editorRef.current?.focus();
    }, []);
    const jsonEncode = ()=>{
        const model = editorRef.current!.getModel();
        const value = model!.getValue();
        try {
            const newValue = beautify(value, {
                indent_size: 2,
                space_in_empty_paren: true,
            });
            editorRef2.current!.setValue(newValue);
        } catch (e) {
            alert(e);
        }
    }
    const urlEncode = ()=>{
        const model = editorRef.current!.getModel();
        const value = model!.getValue();
        try {
            const newValue = encodeURIComponent(value);
            editorRef2.current!.setValue(newValue);
        } catch (e) {
            alert(e);
        }
    }
    const urlDecode = ()=>{
        const model = editorRef.current!.getModel();
        const value = model!.getValue();
        try {
            const newValue = decodeURIComponent(value);
            editorRef2.current!.setValue(newValue);
        } catch (e) {
            alert(e);
        }
    }
    const ioTsEncode = ()=>{
        const model = editorRef.current!.getModel();
        const value = model!.getValue();
        try {
            const tsCode = convertIotsCode(value);
            const newValue = beautify(tsCode, {
                indent_size: 2,
                space_in_empty_paren: true,
            });
            editorRef2.current!.setValue(newValue);
        } catch (e) {
            alert(e);
        }
    }
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                position:'absolute',
                top:'0px',
                bottom:'0px',
                left:'0px',
                right:'0px',
                width:'100%',
                height:'100%',
                boxSizing: 'border-box',
            }}
        >
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
                    defaultValue=""
                    options={options}
                    editorDidMount={(editor) => {
                        editorRef.current = editor;
                    }}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    height: '100%',
                    padding: '40px',
                }}
            >
                <Button type="primary" onClick={ioTsEncode}>
                    {'转换为IoTS代码 >'}
                </Button>
                <Button onClick={jsonEncode}>
                    {'JSON格式化 >'}
                </Button>
                <Button onClick={urlEncode}>
                    {'URL编码 >'}
                </Button>
                <Button onClick={urlDecode}>
                    {'URL解码 >'}
                </Button>
            </div>
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
                    options={options}
                    editorDidMount={(editor) => {
                        editorRef2.current = editor;
                    }}
                />
            </div>
        </div>
    );
}

export default Default;