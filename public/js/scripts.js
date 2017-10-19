clickket = ()=>{
    alert("Unhandled Exception: Source not available. Try Donating money first.")
}

addToTransfer = (id)=>{
    dataid = "li[data-id='"+id+"']"
    $(dataid).toggleClass('selected');

}
