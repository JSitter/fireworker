import React, { useState, useEffect } from 'react';
import FileContentData  from '../fileContentData/fileContentData.jsx';

import './fileUpload.scss';
import { file } from '@babel/types';

function FileUpload(props){

    const [ fileDropBoxStyle, setFileDropBoxStyle ] = useState('');
    const [ fileData, setFileData ] = useState(null);
    const [ itemData, setItemData ] = useState(null);
    const [ fileMode, setFileMode ] = useState("upload");

    useEffect(()=>{
        window.addEventListener('drop', onDropHandler);
        window.addEventListener('dragenter', onDragOverHandler);
        window.addEventListener('dragover', onDragExitHandler);
        document.getElementById('file-upload')
            .addEventListener('dragleave', onDragExitHandler);
    }, [])

    function clickHandler(event){
        console.log("CALL TO ACTION: ", event.type)

    }

    function dropProp(event){
        event.preventDefault();
        event.stopPropagation();
    }

    function onDragOverHandler(event){
        event.dataTransfer.dropEffect = 'copy';
        setFileDropBoxStyle("active");
        event.preventDefault();
        event.stopPropagation();
    }

    function onDragExitHandler(event){
        setFileDropBoxStyle('');
        event.preventDefault();
        event.stopPropagation();
    }

    function onDropHandler(event){
        setFileDropBoxStyle('busy');
        let files = event.dataTransfer.files; // FileList object.
        let items = event.dataTransfer.items // Items 
        setFileDropBoxStyle('recieved');
        setFileMode("upload-details")
        setFileData(files);
        setItemData(items);

    event.preventDefault();
    event.stopPropagation();
    }

    function deleteAllFiles(){
        setFileData(null);
        setItemData(null);
        setFileDropBoxStyle('');
        setFileMode('upload');
    }

    function deleteFile(index){
        const files = [];
        const items = [];
        for(let i = 0; i < fileData.length ; i++){
            if(i != index){
                files.push(fileData[i]);
                items.push(itemData[i]);
            }
        }
        setFileData(files);
        setItemData(items);
    }

    return (
        <div
            id="file-upload"
            className={"file-upload-wrapper "+fileDropBoxStyle +" "+fileMode} 
            onClick={clickHandler} 
            onDrop={onDropHandler} 
            onDragOver={onDragOverHandler}
            onDragExit={onDragExitHandler}
            onLoad={dropProp}
            >
            { fileData ? <FileContentData 
                            fileData={fileData} 
                            itemData={itemData}
                            deleteAllFiles={deleteAllFiles}
                            deleteFile={deleteFile}
                        /> : '+'
            }
        </div>
    );
}

export default FileUpload;