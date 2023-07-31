import React from 'react'
import Header from "../Components/Header";
import SidebarNav from "../Components/SidebarNav";
import { ProSidebarProvider } from "react-pro-sidebar";

const ApplicationLayout = (props) => {
  return (
    <div className='d-flex'>
        <ProSidebarProvider>
          <Header />
          <SidebarNav />
        </ProSidebarProvider>
        {props.children}
    </div>
  )
}

export default ApplicationLayout