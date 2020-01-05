import React, { useState, useEffect } from 'react';
import './fileContentData.scss';

function FileRow(props){
    const [ infoVisibility, setInfoVisibility ] = useState(false);

    function handleInfo(){
        infoVisibility ? setInfoVisibility(false) : setInfoVisibility(true);
    }

    function BasicRow(){
        return (
            <tr onClick={handleInfo} className="basic-file-data">
                <td>{props.rowData.name}</td>
                <td>{props.rowData.size / 1000} Kbytes</td>
                <td>{props.rowData.type || 'n/a'}</td>
                <td><i class="fas fa-trash" onClick={()=>props.deleteFile(props.fileIndex)}></i></td>
            </tr>
        )
        
    }

    function DetailRow(){
        return (
            <tr onClick={handleInfo} className="detailed-file-data">
                <td colspan="4">{props.rowData.name}<br/>
                {props.rowData.size / 1000} Kbytes<br/>
                {props.rowData.type || 'n/a'}<br/>
                <i class="fas fa-trash" onClick={()=>props.deleteFile(props.fileIndex)}></i></td>
            </tr>
        )
    }

    if(infoVisibility){
        return DetailRow()
    }else{
        return BasicRow();
    }
    

}

function FileContentData(props){

    const [ uploadedFiles, setUploadedFiles ] = useState(null);

    useEffect(()=>{
        if(props.fileData.length > 0){
            let items = props.itemData;
            let files = props.fileData;
            let f = []
            console.log("Files", files);
            console.log('Items', items);

            for( let i = 0 ; i < props.fileData.length ; i++ ){
                f.push(<FileRow rowData={files[i] } deleteFile={props.deleteFile} fileIndex={i}/>);
            }
            console.log("*Files:" , files);
            setUploadedFiles(f);
        }
    }, [props.fileData, props.itemData, setUploadedFiles])

    return (
        <div className="file-data-wrapper">
            <table className="file-data-table">
                <tr>
                  <th>File Name</th><th>Size</th><th>File Type</th><th><i class="fas fa-minus-circle" onClick={props.deleteAllFiles}></i></th>
                </tr>
                {uploadedFiles}
            </table>
            <span className="upload-button">Upload Files</span>
        </div>
    );
}

export default FileContentData;
