import React, { useState } from 'react';

import './fileUpload.scss';

function FileUpload(props){
    function clickHandler(event){
        console.log("Clicked it")
    }

    function onDragOverHandler(event){
        console.log("Drag over")
        event.preventDefault();
    }

    function onDropHandler(event){
        console.log("File dropped");
        event.preventDefault();
        console.log("event Items", event.dataTransfer.items) 
    }

    return (
        <div className="file-upload-wrapper" onClick={clickHandler} onDrop={onDropHandler} onDragOver={onDragOverHandler}>
            +
        </div>
    );
}

export default FileUpload;