import TypeTree, { TypeNameAssigner, TypeTreeBuilder } from './TypeTree';
import IoTsGenerator from './IoTsGenerator';

function convert(instance:string):string{
    let typeTree = new TypeTreeBuilder(JSON.parse(instance)).build();
    new TypeNameAssigner(typeTree).assign();
    return new IoTsGenerator(typeTree).generate();
}

test('基础测试',()=>{
    const initData = `
        {
            "name":"fish",
            "age":123,
            "bb":null
        }
    `
    expect(convert(initData)).toMatchSnapshot();
})

test('嵌套object',()=>{
    const initData = `
        {
            "name":"fish",
            "age":123,
            "data":{
                "code":12,
                "msg":"ccg"
            }
        }
    `
    expect(convert(initData)).toMatchSnapshot();
})

test('嵌套Array',()=>{
    const initData = `
        {
            "name":"fish",
            "age":123,
            "data":{
                "code":12,
                "msg":["cc","j"]
            }
        }
    `
    expect(convert(initData)).toMatchSnapshot();
})


test('嵌套Object的Array',()=>{
    const initData = `
        {
            "name":"fish",
            "age":123,
            "data":[
                {
                    "id":213,
                    "countryName":"China"
                },
                {
                    "id":78,
                    "countryName":"US"
                }
            ]
        }
    `
    expect(convert(initData)).toMatchSnapshot();
})

test('嵌套了多种类型的Array',()=>{
    const initData = `
        {
            "name":"fish",
            "age":123,
            "data":[
                {
                    "id":213,
                    "countryName":"China"
                },
                {
                    "id":78,
                    "countryName":"US"
                },
                "cc",
                123
            ]
        }
    `
    expect(convert(initData)).toMatchSnapshot();
})

test('空元素的Array',()=>{
    const initData = `
        {
            "name":"fish",
            "age":123,
            "data":[
            ]
        }
    `
    expect(convert(initData)).toMatchSnapshot();
})

test('Object的key为undefined',()=>{
    const initData = `
        {
            "name":"fish",
            "age":123,
            "data":[
                {
                    "id":213
                },
                {
                    "id":78,
                    "countryName":"US"
                },
                "cc",
                123
            ]
        }
    `
    expect(convert(initData)).toMatchSnapshot();
})

test('Object的key为多集合元素',()=>{
    const initData = `
        {
            "name":"fish",
            "age":123,
            "data":[
                {
                    "id":213,
                    "countryName":213
                },
                {
                    "id":78,
                    "countryName":"US"
                }
            ]
        }
    `
    expect(convert(initData)).toMatchSnapshot();
})