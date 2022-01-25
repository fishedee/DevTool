type TypeName = 'Object' | 'Array' | 'number' | 'string' | 'null';

class TypePath{
    private path:string = "";
    private typeName:TypeName = 'Object';
    private propertyName:string = "";
    private next:TypePath | null = null;

    public getPath(){
        return this.path;
    }

    public getTypeName(){
        return this.typeName;
    }

    public getPropertyName(){
        return this.propertyName;
    }

    public getNext(){
        return this.next;
    }

    public setNext(next:TypePath){
        this.next = next;
    }

    public constructor(typeName:TypeName,propertyName:string,path:string){
        this.typeName = typeName;
        this.propertyName = propertyName;
        this.path = path;
        this.next = null;
    }
}

class TypeTree {
    //基础信息
    public name:string = "";

    public pathSet:Set<string> = new Set();

    //object信息
    public isObject = false;

    public objectName:string = "";

    public objectPathSet:Set<string> = new Set();

    public objectNameMap:Map<string,TypeTree> = new Map();

    //array信息
    public isArray = false;

    public arrayItemType : TypeTree | null = null;

    //其他类型信息
    public isNumber = false;

    public isString = false;

    public isNull = false;

    public constructor(name:string){
        this.name = name;
    }

    private addObjectNode(path:TypePath){
        //设置object类型
        this.isObject = true;
        this.objectPathSet.add(path.getPath());

        //设置子节点数据
        let nextPath = path.getNext();
        if( nextPath != null ){
            let nextNodeName = nextPath.getPropertyName();
            let nextNode = this.objectNameMap.get(nextNodeName);
            if( !nextNode ){
                nextNode = new TypeTree(nextNodeName);
                this.objectNameMap.set(nextNodeName,nextNode);
            }
            nextNode.addNode(nextPath);
        }
    }

    private addArrayNode(path:TypePath){
        //设置array类型
        this.isArray = true;
        
        //设置子节点数据
        let nextPath = path.getNext();
        if( nextPath != null ){
            if( this.arrayItemType == null){
                this.arrayItemType = new TypeTree("#array_item");
            }
            this.arrayItemType.addNode(nextPath);
        }
    }

    private addNormalNode(path:TypePath){
        if( path.getTypeName() == 'number'){
            this.isNumber = true;
        }else if( path.getTypeName() == 'string'){
            this.isString = true;
        }else if( path.getTypeName() == 'null'){
            this.isNull = true;
        }else{
            throw new Error(`unknown typeName ${path.getTypeName()}`);
        }
    }

    public addNode(typePath:TypePath){
        if( typePath.getTypeName() == 'Object'){
            this.addObjectNode(typePath);
        }else if( typePath.getTypeName() == 'Array'){
            this.addArrayNode(typePath);
        }else{
            this.addNormalNode(typePath);
        }
        //将当前路径添加进去
        this.pathSet.add(typePath.getPath());
    }
}

class TypeTreeBuilder{
    private dumpRootPath = new TypePath('string','','');

    private dumpRootTree = new TypeTree('root');

    private instance:any = null;

    constructor(instance:any){
        this.instance = instance;
    }

    private addNode(){
        this.dumpRootTree.addNode(this.dumpRootPath.getNext()!);
    }
    private traverse(instance:any,propertyName:string,currentPath:TypePath){
        let childPath:TypePath;
        if( typeof instance == 'string' ){
            childPath = new TypePath('string',propertyName,currentPath.getPath()+"."+propertyName);
            currentPath.setNext(childPath);
            this.addNode();
        }else if( typeof instance == 'number'){
            childPath = new TypePath('number',propertyName,currentPath.getPath()+"."+propertyName);
            currentPath.setNext(childPath);
            this.addNode();
        }else if( instance == null || instance == undefined){
            childPath = new TypePath('null',propertyName,currentPath.getPath()+"."+propertyName);
            currentPath.setNext(childPath);
            this.addNode();
        }else if( typeof instance == 'object' ){
            if( instance instanceof Array){
                //Array类型
                childPath = new TypePath('Array',propertyName,currentPath.getPath()+"."+propertyName);
                currentPath.setNext(childPath);
                this.addNode();

                //添加数组的每个元素
                for( let i in instance ){
                    let single = instance[i];
                    this.traverse(single,i,childPath);
                }
            }else{
                //Object类型
                childPath = new TypePath('Object',propertyName,currentPath.getPath()+"."+propertyName);
                currentPath.setNext(childPath);
                this.addNode();

                //添加Object的每个元素
                for( let i in instance ){
                    let single = instance[i];
                    this.traverse(single,i,childPath);
                }
            }
        }else{
            throw new Error(`unknown instance type ${typeof instance}`);
        }
    }

    public build():TypeTree{
        this.traverse(this.instance,'root',this.dumpRootPath);
        return this.dumpRootTree;
    }
}

class TypeNameAssigner{
    private typeTree:TypeTree;

    private typeNamePond:number = -1;

    public constructor(typeTree:TypeTree){
        this.typeTree = typeTree;
    }

    private getTypeName():string{
        this.typeNamePond++;
        if( this.typeNamePond == 0 ){
            return "RootType";
        }else{
            return `SubType_${this.typeNamePond}`;
        }
    }
    
    private assignTree(typeTree:TypeTree){
        if( typeTree.isObject ){
            typeTree.objectName = this.getTypeName();
            
            typeTree.objectNameMap.forEach(childTree=>{
                this.assignTree(childTree);
            });
        }   
    
        if( typeTree.isArray && typeTree.arrayItemType != null ){
            this.assignTree(typeTree.arrayItemType);
        }
    }

    public assign(){
        this.assignTree(this.typeTree);
    }
}

export default TypeTree;

export {
    TypeTreeBuilder,
    TypePath,
    TypeName,
    TypeNameAssigner,
}