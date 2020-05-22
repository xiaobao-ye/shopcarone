class StepNumber{
    constructor(_data,parent){
        this.data=_data;
        this.stepNumber=this.initCreateStep(parent);
        this.step=this.data.num;
    }
    initCreateStep(parent){
        if(this.stepNumber) return this.stepNumber;
        let div=document.createElement("div");
        Object.assign(div.style,{
            position:"relative"
        });
        let leftBn=document.createElement("button");
        let input=document.createElement("input");
        let rightBn=document.createElement("button");
        leftBn.textContent="-";
        rightBn.textContent="+";
        let bnStyle={
            width:"25px",
            height:"25px",
            backgroundColor:"#FFFFFF",
            outline:"none",
            cursor: "pointer",
            position:"relative",
            border:"1px solid #CCCCCC"
        };
        Object.assign(leftBn.style,bnStyle);
        Object.assign(rightBn.style,bnStyle);
        Object.assign(input.style,{
            width:"50px",
            height:"21px",
            border:"1px solid #CCCCCC",
            borderLeft:"none",
            borderRight:"none",
            outline:"none",
            position:"relative",
            textAlign:"center"
        });
        input.value=this.step;
        div.appendChild(leftBn);
        div.appendChild(input);
        div.appendChild(rightBn);
        leftBn.self=rightBn.self=input.self=this;
        leftBn.addEventListener("click",this.bnClickHandler);
        rightBn.addEventListener("click",this.bnClickHandler);
        input.addEventListener("input",this.inputHandler);
        parent.appendChild(div);

        return div;
    }
    bnClickHandler(e){
        this.self.bool=true;
        if(this.textContent==="+"){
            if(this.self.step===99)return;
            this.self.step++;
        }else if(this.textContent==="-"){
            if(this.self.step===1)return;
            this.self.step--;
        }
    }
    inputHandler(e){
        this.self.bool=true;
        this.value=this.value.replace(/[^0-9]/,"");
        this.self.step=Number(this.value);
    }
    set step(value){
        if(!this.stepNumber) return;
        //这句话,如果_step是数字,字符,布尔时,这样写可以节省效率
        //但是如果_step是对象或者数组时,就绝对不能写
        if(value===this._step) return;
        value=Number(value);
        if(value<1) value=1;
        if(value>99) value=99;
        this._step=value;
        this.stepNumber.children[1].value=value;
        if(!this.bool) return;
        this.bool=false;
        if(this.id)return;
        this.id=setTimeout(this.getOutData,500,this)
    }
    get step(){
        if(!this._step) this._step=1;
        if(this._step<1) this._step=1;
        if(this._step>99) this._step=99;
        return this._step;
    }
    getOutData(self){
        let evt=new Event(StepNumber.CHANGE_STEP_NUMBER_EVENT);
        evt.data=self.data;
        evt.num=self.step;
        document.dispatchEvent(evt);
        clearTimeout(self.id);
        self.id=0;
    }
    static get CHANGE_STEP_NUMBER_EVENT(){
        return "change_step_number_event";
    }
}