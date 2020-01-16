import React, { useState, useEffect, useRef } from 'react';
import cog from './cog.svg';
import './fileIcon.scss';

function FileIcon(props) {

    let [imgIcon, setImgIcon] = useState(false);

    let imgDataType = props.fileData.type.match('image.*')

    const thumbRef = useRef();

    useEffect(()=>{
        console.log("effect data type ", imgDataType);
        console.log("effect props: ", props.fileData);

        if( imgDataType ){

            let reader = new FileReader();
            reader.onload = function(e) {
                // Set state with img data without encoding prefix
                setImgIcon(true);
                thumbRef.current.src = e.target.result;
              };

            reader.readAsDataURL(props.fileData);

        }else {
            console.log("File data not found. ");
        }

    }, []);

    useEffect(()=>{
        if(imgIcon){
            console.log(document.getElementById[props.fileIndex + "thumb"])
        }
        
    }, [imgIcon, thumbRef])

    return (
        <div>
            { imgIcon ?  <div className="thumb-wrapper"><img ref={thumbRef} src={cog} className="file-thumb"/></div>: <FileThumb fileData={props.fileData}/>}
        </div>
    )
    
}



function FileThumb(props){
    return (
        <span><i className="fas fa-file"></i><p>{props.fileData.result}</p></span>
    );
}

export default FileIcon;