import React, { useState, useEffect } from 'react';
import FileContentData  from '../fileContentData/fileContentData.jsx';
import './fileUpload.scss';

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
    //     // files is a FileList of File objects. List some properties.
    //     var output = [];
    //     for (var i = 0, f; f = files[i]; i++) {
        // output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
        //             f.size, ' bytes, last modified: ',
        //             f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
        //             '</li>');
    //     }

    // setFileData('<ul>' + output.join('') + '</ul>');
    event.preventDefault();
    event.stopPropagation();
    }

    function deleteAllFiles(){
        setFileData(null);
        setItemData(null);
        setFileDropBoxStyle('');
        setFileMode('upload');
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
                        /> : '+'
            }
        </div>
    );
}

export default FileUpload;