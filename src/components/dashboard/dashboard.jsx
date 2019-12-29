import React from 'react';
import './dashboard.scss';
import TopMenu from '../topMenu/topMenu.jsx';
import FileUpload from '../fileUpload/fileUpload.jsx';

function Dashboard(props){
  return (
    <div className="dashboard-wrapper">
      <TopMenu />
      <FileUpload />
    </div>
  )
}

export default Dashboard;
