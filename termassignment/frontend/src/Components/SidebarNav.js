// https://www.npmjs.com/package/react-pro-sidebar
import React from 'react'
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined"
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert'
import ReceiptIcon from '@mui/icons-material/Receipt'
import CategoryIcon from '@mui/icons-material/Category'

export const SidebarNav = () => {
    const { collapseSidebar } = useProSidebar();

    return (
        <div style={({ height: "100vh" }, { display: "flex" })}>
            <Sidebar breakPoint='md' backgroundColor='#fff' transitionDuration={700} style={{ height: "100vh"}}>
                <Menu menuItemStyles={{
                        button: {
                            color: "#4a4a4a",
                            fontSize: "16px",
                            [`&.ps-active`]: {
                            backgroundColor: '#283055',
                            color: '#f7f7f7'
                            }
                        }
                    }}
                >
                    <MenuItem
                        icon={<MenuOutlinedIcon />}
                        onClick={() => {collapseSidebar();}}
                        style={{ textAlign: "center" }}
                    >
                        <h6>Expense Manager</h6>
                    </MenuItem>
                    <MenuItem icon={<HomeOutlinedIcon />} active={window.location.pathname == "/home" ? true : false} onClick={()=>window.location.href = '/home'}>Home</MenuItem>
                    <MenuItem icon={<ReceiptIcon />} active={window.location.pathname == "/transaction" ? true : false} onClick={()=>window.location.href = '/transaction'}>Transaction</MenuItem>
                    <MenuItem icon={<CategoryIcon />} active={window.location.pathname == "/category" ? true : false} onClick={()=>window.location.href = '/category'}>Category</MenuItem>
                    <MenuItem icon={<CrisisAlertIcon />} active={window.location.pathname == "/alert" ? true : false} onClick={()=>window.location.href = '/alert'}>Alert</MenuItem>
                    
                </Menu>
            </Sidebar>
        </div>
    )
}

export default SidebarNav
