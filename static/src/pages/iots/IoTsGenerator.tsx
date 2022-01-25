import TypeTree  from "./TypeTree";

class IoTsGenerator{
    private typeTree:TypeTree;

    private result:string = "";

    public constructor(typeTree:TypeTree){
        this.typeTree = typeTree;
    }

    private getTypeDeclartion(node:TypeTree):string[]{
        const typeUnion:string[] = [];
        if( node.isNull ){
            typeUnion.push("t.null");
        }
        if( node.isNumber ){
            typeUnion.push("t.number");
        }
        if( node.isString){
            typeUnion.push("t.string");
        }
        if( node.isObject ){
            //递归生成子类型
            this.generateTree(node);
            typeUnion.push(node.objectName);
        }
        if( node.isArray ){
            if(node.arrayItemType){
                const subArrayType = this.getTypeDeclartion(node.arrayItemType);
                if( subArrayType.length == 1 ){
                    typeUnion.push(`t.array(${subArrayType[0]})`);
                }else{
                    typeUnion.push(`t.array(t.union([${subArrayType.join(',')}]))`);
                }
            }else{
                typeUnion.push('t.array(t.unknown)');
            }
        }
        return typeUnion;
    }
    
    private generateTree(tree:TypeTree){
        //非Object类型不生成
        if( tree.isObject == false ){
            return "";
        }
        
        //先生成Child Object类型
        let current = `val ${tree.objectName} = t.type({\n`
        const objectCount = tree.objectPathSet.size;
        tree.objectNameMap.forEach((childObject,propertyName)=>{
            //添加非undefined类型
            const typeUnion = this.getTypeDeclartion(childObject);

            //添加undefined类型
            const propertyCount = childObject.pathSet.size;
            if( propertyCount < objectCount){
                typeUnion.push('t.undefined');
            }

            if( typeUnion.length == 1 ){
                current += `${propertyName}:${typeUnion[0]},\n`
            }else{
                current += `${propertyName}:t.union([${typeUnion.join(',')}]),\n`
            }
        });
        current += "});\n";
        this.result += current;
    }

    public generate():string{
        this.generateTree(this.typeTree);
        return this.result;
    }
}

export default IoTsGenerator;