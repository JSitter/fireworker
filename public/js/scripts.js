var transferItems = {}

clickket = ()=>{
    console.log("this.transferItems")
    alert(JSON.stringify(transferItems))
}

addToTransfer = (id)=>{
    dataid = "li[data-id='"+id+"']"
    $(dataid).toggleClass('record-selected');
    toggleTransfer(id)

}

let toggleTransfer = (id)=>{
    if(transferItems[id]){
        delete transferItems[id]
    }else{
        transferItems[id] = 1
    }

}

let getDocLink = ()=>{

    $.ajax({
        type: 'POST',
        url: '/tokenate',
        data: transferItems,
        success: (address)=>{
            
            $('.url-share').css("visibility", "visible")
        },
        error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
            //alert(xhr.status);
            alert("Error: ", ajaxOptions);
        },
    })
}

let closeLink = ()=>{
    $(".url-share").css("visibility", "hidden")
}
