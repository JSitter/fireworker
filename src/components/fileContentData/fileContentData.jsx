import React, { useState, useEffect } from 'react';
import './fileContentData.scss';

function FileRow(props){
    return (
    <tr>
        <td>{props.rowData.name}</td>
        <td>{props.rowData.size / 1000} Kbytes</td>
        <td>{props.rowData.type || 'n/a'}</td>
        <td><i class="fas fa-trash"></i></td>
        </tr>
    )
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
                f.push(<FileRow rowData={files[i]}/>);
            }
            console.log("*Files:" , files);
            setUploadedFiles(f);
        }
    }, [props.fileData, props.itemData, setUploadedFiles])

    return (
        <div className="file-data-wrapper">
            <table>
                <tr>
                  <th>File Name</th><th>Size</th><th>File Type</th><th><i class="fas fa-minus-circle" onClick={props.deleteAllFiles}></i></th>
                </tr>
                {uploadedFiles}
            </table>
        </div>
    );
}

export default FileContentData;
