clickket = ()=>{
    alert("Unhandled Exception: Source not available. Try Donating money first.")
}

addToTransfer = (id)=>{
    dataid = "li[data-id='"+id+"']"
    $(dataid).toggleClass('selected');

}

$('body').on('click', '.add-to-transfer', function(e) {
    // $(this).siblings('.record-name').addClass('selected');
    // $(this).siblings('.record-name').removeClass('selected');
    $(this).siblings('.record-name').toggleClass('selected');
   });