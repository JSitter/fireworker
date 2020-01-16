import React, { useState, useEffect } from 'react';
import KeyIcon from '../keyIcon/keyIcon.jsx';
import FileIcon from '../fileIcon/fileIcon.jsx';
import './fileContentData.scss';

function FileRow(props){
    const [ infoVisibility, setInfoVisibility ] = useState(false);
    const [ fileEncryption, setFileEncryption ] = useState(false);

    useEffect(()=>{
        if(props.keys[props.fileIndex]){
            setFileEncryption(true);
        }
    }, [props.keys])

    function handleInfo(){
        infoVisibility ? setInfoVisibility(false) : setInfoVisibility(true);
    }

    function keyForm(props){
        const [ editKey, setEditKey ] = useState(false);

        function encIcon() {
            if(props.fileEncryption){
                return (
                   <i className="fas fa-lock"></i>
                )
            }else {
                return (
                    <i className="fas fa-lock-open"></i>
                )
            }
        }

        function keyInputForm() {
            return (
                <form action="">
                    <input type="text"/>
                    <button type="submit">Set Encryption Key</button>
                </form>
                
            )
        }
        return (
            editKey ? encIcon() : keyInputForm()
        )
    }

    function BasicRow(){
        return (
            <tr onClick={handleInfo} className="basic-file-data">
                <td>{fileEncryption ? <i className="fas fa-lock"></i> : <i className="fas fa-lock-open"></i>}</td>
                <td>{props.rowData.name}</td>
                <td>{props.rowData.size / 1000} Kbytes</td>
                <td>{props.rowData.type || 'n/a'}</td>
                <td onClick={()=>{}}><i className="fas fa-trash" onClick={()=>props.deleteFile(props.fileIndex)}></i></td>
            </tr>
        )
        
    }

    function DetailRow(){


        return (
            <tr onClick={handleInfo} className="detailed-file-data">
                <td colSpan="5">
                    <FileIcon fileData={props.rowData} fileIndex={props.fileIndex}/>
                    <KeyIcon encrypted={props.fileEncryption} />
                    {props.rowData.name}<br/>
                    {props.rowData.size / 1000} Kbytes<br/>
                    {props.rowData.type || 'n/a'}<br/>
                    <i className="fas fa-trash" onClick={()=>props.deleteFile(props.fileIndex)}></i>
                </td>
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
    const [ keys, setKeys ] = useState({});

    useEffect(()=>{
        if(props.fileData.length > 0){
            let items = props.itemData;
            let files = props.fileData;
            let f = []

            for( let i = 0 ; i < props.fileData.length ; i++ ){
                f.push(<FileRow rowData={files[i]} deleteFile={props.deleteFile} fileIndex={i} keys={keys} setKeys={setKeys} key={i} />);
            }
            setUploadedFiles(f);
        }
    }, [props.fileData, props.itemData, setUploadedFiles, keys])

    return (
        <div className="file-data-wrapper">
            <table className="file-data-table">
                <tbody>
                    <tr>
                    <th><i className="fas fa-key"></i></th><th>File Name</th><th>Size</th><th>File Type</th><th><i className="fas fa-minus-circle" onClick={props.deleteAllFiles}></i></th>
                    </tr>
                    {uploadedFiles}
                </tbody>
            </table>
            <span className="upload-button">Upload Files</span>
        </div>
    );
}

export default FileContentData;
