class Main{
    constructor(){
        Ajax.getInstance().send({type:0x01});
        document.addEventListener(GoodsItem.ADD_SHOPPING_LIST_EVENT,this.shoppingGoodsHandler);
        document.addEventListener(StepNumber.CHANGE_STEP_NUMBER_EVENT,this.shoppingGoodsHandler);
        document.addEventListener(ShoppingTable.DELETED_GOODS_EVENT,this.shoppingGoodsHandler);
        document.addEventListener(ShoppingTable.SELECT_ALL_GOODS_EVENT,this.shoppingGoodsHandler);
        document.addEventListener(ShoppingTable.SELECT_GOODS_EVENT,this.shoppingGoodsHandler);
    }
    static getInstance(){
        if(!Main._instance){
            Object.defineProperty(Main,"_instance",{
                writable:true,
                value:new Main()
            })
        }
        return Main._instance;
    }
    set goodsList(value){
        this._goodsList=value;
        Ajax.getInstance().send({type:0x02});
        if(this.goodsCon){
           this.goodsCon.remove();
           this.goodsCon=null;
        }
        this.goodsCon=document.createElement("div");
        document.body.insertBefore(this.goodsCon,document.body.firstElementChild);
        for(let i=0;i<value.length;i++){
            let goods=new GoodsItem(value[i],this.goodsCon);
        }
    }
    get goodsList(){
        if(!this._goodsList) return [];
        return this._goodsList;
    }
    set shoppingList(value){
        this._shoppingList=value;
        if(this.shoppingTable){
            this.shoppingTable.dispose();
            this.shoppingTable=null;
        }
        this.shoppingList.forEach(function (item) {
            if(item.selected){
                item.sum=item.price*item.num;
            }
        });
        this.shoppingTable=new ShoppingTable(value,document.body);
    }
    get shoppingList(){
        if(!this._shoppingList) return [];
        return this._shoppingList;
    }
    shoppingGoodsHandler(e){
        switch (e.type){
            case GoodsItem.ADD_SHOPPING_LIST_EVENT:
                let bool=Main.getInstance().shoppingList.some(function (item) {
                        return item.id===e.data.id;
                });
                if(!bool){
                    Ajax.getInstance().send({type:0x03,id:e.data.id});
                }else{
                    let item=Main.getInstance().shoppingList.filter(function (t) {
                        return t.id===e.data.id;
                    })[0];
                    let num=item.num+1;
                    if(num>99)num=99;
                    Ajax.getInstance().send({type:0x04,id:e.data.id,num:num});
                }

                break;
            case StepNumber.CHANGE_STEP_NUMBER_EVENT:
                Ajax.getInstance().send({type:0x04,id:e.data.id,num:e.num});
                break;
            case ShoppingTable.DELETED_GOODS_EVENT:
                Ajax.getInstance().send({type:0x05,id:e.data.id});
                break;
            case ShoppingTable.SELECT_ALL_GOODS_EVENT:
                Ajax.getInstance().send({type:0x07,ids:e.ids,select:e.select});
                break;
            case ShoppingTable.SELECT_GOODS_EVENT:
                Ajax.getInstance().send({type:0x06,id:e.data.id,select:e.select});
                break;
        }

    }

}
