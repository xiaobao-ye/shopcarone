class Ajax{
    constructor(){
        this.xhr=new XMLHttpRequest();
        this.xhr.addEventListener("readystatechange",this.readyStateChangeHandler.bind(this))
    }
    static getInstance(){
        if(!Ajax._instance){
            Object.defineProperty(Ajax,"_instance",{
                writable:true,
                value:new Ajax()
            })
        }
        return Ajax._instance;
    }
    send(obj){
        this.xhr.open(Ajax.METHOD,Ajax.URL+Ajax.PORT+"?time="+new Date().getTime());
        this.xhr.send(encodeURIComponent(JSON.stringify(obj)));
    }
    readyStateChangeHandler(e){
        if(this.xhr.readyState===4 && this.xhr.status===200){
            let obj=JSON.parse(decodeURIComponent(this.xhr.response));
            console.log(obj);
            switch (obj.type){
                case 1:
                    Main.getInstance().goodsList=obj.resolute;
                    break;
                case 4:
                    let arr=Main.getInstance().shoppingList.filter(function (t) {
                        return t.id===obj.resolute.id;
                    });
                    if(arr.length===0) return;
                    arr[0].num=obj.resolute.num;
                    if(arr[0].selected){
                        arr[0].sum=arr[0].num*arr[0].price;
                    }
                    Main.getInstance().shoppingList=Main.getInstance().shoppingList;
                    break;
                default:
                    console.log(obj.resolute);
                    Main.getInstance().shoppingList=obj.resolute;
                    break;
            }
        }
    }

    static get URL(){
        return "http://192.168.0.104";
        // return "http://10.9.27.20";
    }
    static get PORT(){
        return ":3333";
    }
    static get METHOD(){
        return "POST"
    }
}