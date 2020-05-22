var http=require("http");
var goodsData=[
    {id:1001,icon:"img/03.jpg",goods:"德国DMK进口牛奶 欧德堡（Oldenburger）超高温处理全脂纯牛奶1L*12盒",info:"1L*12",nowPrice:139,initPrice:156,sold:0.5},
    {id:1002,icon:"img/04.jpg",goods:"帮宝适(Pampers)超薄干爽绿帮纸尿裤L164片(9-14kg)大码 尿不湿箱装",info:"L【9-14kg】",nowPrice:225,initPrice:275,sold:0.5},
    {id:1003,icon:"img/05.jpg",goods:" 意大利进口 百乐可（BALOCCO） 千层酥饼 脆皮酥薄脆饼干 焦糖味 200g",info:"焦糖脆皮酥200g",nowPrice:27.9,initPrice:40,sold:0.5},
    {id:1004,icon:"img/06.jpg",goods:"百草味 坚果零食干果 每日坚果 奶油味夏威夷果200g/袋（内含开果器）",info:"夏威夷果奶油味200g/袋",nowPrice:16.9,initPrice:30,sold:0.5},
    {id:1005,icon:"img/07.jpg",goods:"三星 Galaxy S10 8GB+512GB炭晶黑（SM-G9730）3D超声波屏下指纹超感官全视屏骁龙855双卡双待全网通4G游戏手机 ",info:"炭晶黑\n8GB+512GB",nowPrice:7699,initPrice:9899,sold:0.5},
    {id:1006,icon:"img/01.jpg",goods:"罗技（G）G102 游戏鼠标 8000DPI RGB鼠标 黑色 吃鸡鼠标 绝地求生",info:"G102有线游戏鼠标 黑色",nowPrice:119,initPrice:146,sold:0.5},
    {id:1007,icon:"img/02.jpg",goods:"联想(Lenovo)拯救者Y7000英特尔酷睿i5 15.6英寸游戏笔记本电脑( i5-8300H 8G 512G SSD GTX1050 黑)",info:"Y7000【1050 i5 512",nowPrice:5699,initPrice:6200,sold:0.5}
];
var shoppingList=[];
var server=http.createServer(resEventHandler);
server.listen(3333,"192.168.0.104",listenHandler);
// server.listen(3005,"10.9.27.20",listenHandler);
function listenHandler() {
    console.log("服务器开启了")
}

function resEventHandler(req,res) {
    var data="";
    req.on("data",function (_data) {
          data+=_data;
    });
    req.on("end",function () {

        var obj=JSON.parse(decodeURIComponent(data));
        var resObj={error:null,type:obj.type};
        switch (Number(obj.type)){
            case 1:
                resObj.resolute=goodsData;
                break;
            case 2:
                if(obj.shoppingList){
                    for(let i=0;i<obj.shoppingList.length;i++){
                        let bool=false;
                        for(let j=0;j<shoppingList.length;j++){
                            if(shoppingList[j].id===obj.shoppingList[i].id){
                                shoppingList[j].num+=obj.shoppingList[i].num;
                                bool=true;
                                break;
                            }
                        }
                        if(!bool){
                            shoppingList.push(obj.shoppingList[i]);
                        }
                    }
                }

                resObj.resolute=shoppingList;
                break;
            case 3:
                if(!addShoppingList(obj.id)){
                    resObj.error={error:"添加的商品已存在"};
                }
                resObj.resolute=shoppingList;
                break;
            case 4:
                resObj.resolute=changeGoodsNum(obj.id,obj.num);
                break;
            case 5:
                if(!removeGoods(obj.id)){
                    resObj.error={error:"删除内容不存在"};
                }
                resObj.resolute=shoppingList;
                break;
            case 6:
                selectGoods(obj.id,obj.select);
                resObj.resolute=shoppingList;
                if(!resObj.resolute){
                    resObj.error={error:"未选中该商品"};
                }
                break;
            case 7:
                selectAllGoods(obj.ids,obj.select);
                resObj.resolute=shoppingList;
                break;
        }

        res.writeHead(200,{"content-type":"text/html;charset=utf-8","Access-Control-Allow-Origin":"*"});
        res.write(encodeURIComponent(JSON.stringify(resObj)));
        res.end();
    })
}

function addShoppingList(id) {
    id=Number(id);
    var arr=shoppingList.filter(function (t) {
        return t.id===id;
    });
    if(arr.length>0) return false;
   var data=goodsData.filter(function (t) {
        return t.id===id;
    })[0];

    shoppingList.push({
        selected:false,
        id:data.id,
        icon:data.icon.split("0").join(""),
        goods:data.goods,
        info:data.info,
        price:Number(data.nowPrice),
        num:1,
        sum:0,
        deleted:false
    });
    return true;
}

function changeGoodsNum(id,num) {
    var obj;
    shoppingList.forEach(function (t) {
        if(t.id===id){
            t.num=num;
            obj={id:id,num:num}
        }
    });
    return obj;
}
function removeGoods(id) {
    var bool=true;
    var shops=shoppingList.filter(function (t) {
        return t.id!==id;
    });
    if(shops.length===shoppingList.length){
        bool=false;
    }
    shoppingList=null;
    shoppingList=shops;
    return bool;
}
function selectGoods(id,select) {
    var bool=false;
    shoppingList.forEach(function (t) {
        if(t.id===id){
            t.selected=select;
            bool=true;
        }
    });
    return bool;
}
function selectAllGoods(ids,select) {
    for(var i=0;i<ids.length;i++){
        shoppingList.forEach(function (t) {
            if(t.id===ids[i]){
                t.selected=select;
            }
        })
    }
    return true;
}