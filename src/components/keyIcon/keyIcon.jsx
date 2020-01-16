import React from 'react';
import './keyIcon.scss';

function KeyIcon(props){
    // Needs props.encrypted
    return (
        <span className="key-icon">
            <i className="fas fa-key"></i>
            {!props.encrypted? <i className="fas fa-slash"></i> : ""}
        </span>
    )
}

export default KeyIcon;