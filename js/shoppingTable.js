/* 购物车结算页面 */
class ShoppingTable{
    constructor(_data,parent){
        this.data=_data;
        this.table=this.initCreate(parent);
    }
    initCreate(parent){
        if(this.table) return this.table;
        this.checkBind=this.checkHandler.bind(this);
        this.deletedBind=this.deletedHandler.bind(this);
       let table=document.createElement("table");
        Object.assign(table.style,{
            borderCollapse: "collapse",
            position:"relative",
            float:"none",
            width:"990px",
            margin:"auto"
        });
        this.createTableHead(table);
        this.createTrAndTd(table);
        parent.appendChild(table);
        return table;
    }
    createTableHead(table){
        let tr=document.createElement("tr");
        let tableHeadList=["全选","图片","商品","描述","单价","数量","小计","操作"];
        let widthList=[80,103,208,200,160,120,180,75];

        for(let i=0;i<tableHeadList.length;i++){
            let th=document.createElement("th");
            th.textContent=tableHeadList[i];
            if(tableHeadList[i]==="全选"){
                let check=document.createElement("input");
                check.type="checkbox";
                th.insertBefore(check,th.firstChild);
                check.style.position="relative";
                check.style.top="2px";
                check.addEventListener("click",this.checkBind);
                check.checked=this.getAllChecked();
            }
            Object.assign(th.style,{
                backgroundColor:"#F3F3F3",
                color:"#666666",
                fontSize:"12px",
                lineHeight:"32px",
                height:"32px",
                width:widthList[i]+"px"
            });
            tr.appendChild(th);
        }
        tr.style.border="1px solid #CCCCCC";
        tr.style.padding="5px 0";
        table.appendChild(tr);
    }
    createTrAndTd(table){
        for(let i=0;i<this.data.length;i++){
            let tr=document.createElement("tr");
            tr.style.border="1px solid #CCCCCC";
            for(let prop in this.data[i]){
                if(prop==="id") continue;
                let td=document.createElement("td");
                td.style.textAlign="center";
                td.style.fontSize="12px";
                td.style.backgroundColor="#F3F3F3";
                this.createTdContent(td,prop,this.data[i]);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    }
    createTdContent(td,prop,item){
        // console.log(prop);
        switch (prop){
            case "selected":
                let check=document.createElement("input");
                check.type="checkbox";
                check.style.marginLeft="-15px";
                td.appendChild(check);
                check.checked=item[prop];
                check.data=item;
                check.addEventListener("click",this.checkBind);
                break;
            case "icon":
                let img=new Image();
                img.src=item[prop];
                td.appendChild(img);
                break;
            case "num":
                let step=new StepNumber(item,td);
                break;
            case "deleted":
                let del=document.createElement("a");
                del.textContent="删除";
                del.addEventListener("click",this.deletedBind);
                del.data=item;
                td.appendChild(del);
                break;

            default:
                td.textContent=item[prop].toString().length>20 ? item[prop].toString().slice(0,20) :item[prop];
                break;
        }
    }

    checkHandler(e){
        let evt;
        if(!e.currentTarget.data){
            evt=new Event(ShoppingTable.SELECT_ALL_GOODS_EVENT);
            evt.ids=this.data.map(function (item) {
                return item.id;
            });
            evt.select=e.currentTarget.checked;
        }else{
            evt=new Event(ShoppingTable.SELECT_GOODS_EVENT);
            evt.data=e.currentTarget.data;
            evt.select=e.currentTarget.checked;
        }
        document.dispatchEvent(evt);
    }
    deletedHandler(e){
        let evt=new Event(ShoppingTable.DELETED_GOODS_EVENT);
        evt.data=e.currentTarget.data;
        document.dispatchEvent(evt);
    }
    getAllChecked(){
        return this.data.every(function (t) {
            return t.selected;
        })
    }
    dispose(){
        this.table.remove();
        this.table=null;
    }

    static get DELETED_GOODS_EVENT(){
        return "deleted_goods_event";
    }
    static get SELECT_ALL_GOODS_EVENT(){
        return "select_all_goods_event";
    }
    static get SELECT_GOODS_EVENT(){
        return "select_goods_event";
    }
}