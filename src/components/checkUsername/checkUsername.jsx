import React from 'react';
import './checkUsername.scss';

function CheckUsername(props){

  return (
    <div className={props.status}>
      {props.status === "available" ? <i class="fas fa-check"></i> : ( props.status === "busy" ? <i class="fas fa-circle-notch"></i> : ( props.status === "taken"? <i class="fas fa-exclamation-triangle"></i> : ""))}
    </div>
  )
}

export default CheckUsername;