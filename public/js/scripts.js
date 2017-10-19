var transferItems = {}

clickket = ()=>{
    console.log(transferItems)
    alert(transferItems)
}

addToTransfer = (id)=>{
    dataid = "li[data-id='"+id+"']"
    $(dataid).toggleClass('record-selected');

}

let toggleTransfer = (id)=>{
    if(transferItems[id]){
        delete transferItems[id]
    }else{
        transferItems[id] = 1
    }

}
