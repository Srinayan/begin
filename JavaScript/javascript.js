var Person  = {
    firstName : "Srinayan Reddy",
    lastName : "Gujjula",
    age : "21"
}

class ParserClass{
    #version;
    #channel;
    #keyField;
    constructor(){
        this.#version = "";
        this.#channel = "";
        this.#keyField = "";
    };
    setVersion(version) {
        this.#version = version;
        return this;
    };
    getVersion() {
        return this.#version;
    };
    
    setChannel(channel) {
        this.#channel = channel;
        return this;
    };
    getChannel() {
        return this.#channel;
    };
    
    setkeyField(keyField) {
        this.#keyField = keyField;
        return this;
    };
    getkeyField() {
        return this.#keyField;
    };
    getKeyFields (jsonArray) {
        var keyFieldsList = []
        for (x in jsonArray) {
            keyFieldsList.push(x.getKeyField());
        }
        return keyFieldsList;
    };
}

function groupObjectsBy(jsonArray, key) {
    return jsonArray.reduce(function (groups, item) {
        console.log(groups,item);
        const val = item[key]
        groups[val] = groups[val] || []
        groups[val].push(item)
        return groups
    }, {});
};

class SortArray{
    #sortedArray;
     
    constructor(... args){
        this.originalArray = args 
        this.#sortedArray = []
    }
    #sort=function(){
        this.#sortedArray = this.originalArray.sort();
    }
    getSortedArray(){
        this.#sort();
        return this.#sortedArray;
    }
}

class SortObjectArray extends SortArray{
    #sortedArray;
    constructor(... args){
        super(args);
    }
    #getSortOrder = function(key){
        return function(a,b){
            if (a[key]>b[key]){
                return 1;
            }
            else if(a[key]<b[key]){
                return -1;
            }
            return 0;
        }
    }
    #sort = function (key) {
        this.#sortedArray = this.originalArray[0].sort(this.#getSortOrder(key));
    }
    getSortedArray(key){
        this.#sort(key);
        return this.#sortedArray;
    }
}
