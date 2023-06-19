class subOrderType {
    orderType;
    subType;
    name;
    desc;

    constructor(orderType, subType, name, desc) {
        this.orderType = orderType;
        this.subType = subType;
        this.name = name;
        this.desc = desc;
    }
  
    toString() {
        return `${this.name}`;
    }
}

class subOrderTypes {
    static TM = new subOrderType(0, 1000, "tm", "my");
    static CECOM = new subOrderType(1, 1200, "cecom", "sg");
    
    static getSubTypeByOrder(order) {
        for (let value of Object.values(subOrderTypes)) {
            //console.log(value);
            if(value.orderType === order)
                return value.subType;
        }
                
        return null;
    }
}

module.exports = subOrderTypes;