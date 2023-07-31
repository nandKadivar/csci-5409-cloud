import React, {useState,useEffect,useContext} from 'react'
import Button from '@mui/material/Button'
import {Dialog, DialogActions, DialogContent } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import Header from '../Components/Header'
import SidebarNav from '../Components/SidebarNav'
import { ProSidebarProvider } from 'react-pro-sidebar'
import AddIcon from '@mui/icons-material/Add'
import {Context} from '../Auth/JWTAuth'
import axios from 'axios'

const BudgetScreen = () => {
    const { token } = useContext(Context)
    const [budgets,setBudgets] = useState([])
    const [categories,setCategories] = useState([])

    const [newBudgetName,setNewBudgetName] = useState("")
    const [newBudgetItems,setNewBudgetItems] = useState([])
    const [newBudgetItemName,setNewBudgetItemName] = useState("")
    const [newBudgetItemAmount,setNewBudgetItemAmount] = useState("")

    const [selectedBudgetId,setSelectedBudgetId] = useState(0)


    const [open, setOpen] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)

    const openModel = () => {
        setOpen(true)
    };

    const closeModel = () => {
        setNewBudgetName("")
        setNewBudgetItems([])
        setNewBudgetItemName("")
        setNewBudgetItemAmount("")
        setOpen(false)
    };

    const openModelEdit = (alert) => {
        setNewBudgetName(alert.name)
        setSelectedBudgetId(alert.id)
        setNewBudgetItems(alert.fields)
        setNewBudgetItemName("")
        setNewBudgetItemAmount("")
        setOpenEdit(true)
    };

    const closeModelEdit = () => {
        setNewBudgetName("")
        setSelectedBudgetId(0)
        setNewBudgetItems([])
        setNewBudgetItemName("")
        setNewBudgetItemAmount("")
        setOpenEdit(false)
    };

    const openModelDelete = (alert) => {
        setSelectedBudgetId(alert.id)
        setOpenDelete(true)
    };

    const closeModelDelete = () => {
        setSelectedBudgetId(0)
        setOpenDelete(false)
    };

    const addBudgetItem = () => {
        if(newBudgetItemName !="" && newBudgetItemAmount > 0){
            const new_item = {
                category: newBudgetItemName,
                amount: newBudgetItemAmount
            }
            var current_budget_item_list = newBudgetItems
            
            current_budget_item_list.push(new_item)
            setNewBudgetItems(current_budget_item_list)
            setNewBudgetItemName("")
            setNewBudgetItemAmount("")
        }
    }

    const removeBudgetItem = (item) => {
        var current_budget_item_list = newBudgetItems
        var updated_list = []
        current_budget_item_list.forEach((budget)=>{
            if(budget.category != item.category){
                updated_list.push(budget)
            }
        })
        setNewBudgetItems(updated_list)
    }

    const createAlertHandler = () => {
        const new_alert = {
            name: newBudgetName,
            fields: newBudgetItems
        }

        axios.post(`${process.env.REACT_APP_API_GATEWAY}/alert/create`,new_alert,{headers:{"authorization": "Bearer "+token}}).then((res)=>{
            if(res){
                window.location.href = "/alert"
            }
        }).catch((error)=>{
            alert(error)
        })

        setOpen(false)
    }

    const updateAlertHandler = () => {
        const updated_alert = {
            id: selectedBudgetId,
            name: newBudgetName,
            fields: newBudgetItems
        }

        axios.put(`${process.env.REACT_APP_API_GATEWAY}/alert/update`,updated_alert,{headers:{"authorization": "Bearer "+token}}).then((res)=>{
            if(res){
                window.location.href = "/alert"
            }
        }).catch((error)=>{
            alert(error)
        })

        setOpenEdit(false)
    }

    const deleteAlertHandler = () => {
        const delete_alert = {
            id: selectedBudgetId,
        }

        axios.post(`${process.env.REACT_APP_API_GATEWAY}/alert/delete`,delete_alert,{headers:{"authorization": "Bearer "+token}}).then((res)=>{
            if(res){
                window.location.href = "/alert"
            }
        }).catch((error)=>{
            alert(error)
        })

        setOpenDelete(false)
    }

    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_API_GATEWAY}/category/get`,{headers:{"authorization": "Bearer "+token}}).then((res)=>{
            if(res.data){
                setCategories(res.data)
            }
        })
        axios.get(`${process.env.REACT_APP_API_GATEWAY}/alert/get`,{headers:{"authorization": "Bearer "+token}}).then((res)=>{
            if(res){
                setBudgets(res.data)
            }
        }).catch((error)=>{
            alert(error)
        })
    },[])


  if(token !== ""){
    return (
        <div className='d-flex'>
                <ProSidebarProvider>
                    <Header />
                    <SidebarNav />
                    <main className='d-flex flex-column p-4' style={{marginTop: "45px",backgroundColor: "#f6f9ff",width: "100%"}}>
                        <div className='d-flex flex-row justify-content-end my-2' style={{width: "100%"}}>
                        <Button variant="contained" startIcon={<AddIcon />} style={{backgroundColor: "#283055"}} onClick={openModel}>
                            Add Alert
                        </Button>
                        </div>
                        <div className='col-12 d-flex align-items-center justify-content-start'>
                            {
                                budgets.map((budget)=>
                                    <div className='col-3 d-flex flex-column align-items-center justify-content-between p-2 m-1 alert-card'>
                                        <div className='col-12 d-flex flex-column align-items-center'>
                                            <h6>ID: {budget.id}</h6>
                                            <h6>{budget.name}</h6>
                                            <div className='mt-2 col-12 d-flex align-items-start justify-content-start'> 
                                                <ul>
                                                    {
                                                        budget.fields.map((field)=>
                                                            <li>{field.category} - {field.amount}</li>
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                        
                                        <div className='col-12 d-flex flex-column'>
                                            <Button variant="outlined" style={{color: "#283055", borderColor: "#283055"}} onClick={()=>openModelEdit(budget)}>Edit</Button>
                                            <Button className='mt-2' variant="contained" style={{backgroundColor: "#283055"}} onClick={()=>openModelDelete(budget)}>Delete</Button>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <Dialog
                            open={open}
                            onClose={closeModel}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogContent>
                            <FormControl>
                                <input className='mt-2 p-1' type="text" placeholder='Alert name' value={newBudgetName} onChange={(e)=>setNewBudgetName(e.target.value)}/>
                                <div className='d-flex flex-column'>
                                {
                                    newBudgetItems.map((item,index)=><div>{index+1}: {item.category} - {item.amount} <HighlightOffIcon fontSize="large" className='px-2' onClick={()=>{removeBudgetItem(item)}} /></div>)
                                }
                                </div>
                                <div className='mt-2'>
                                    <select className='p-1' name="category" value={newBudgetItemName} onChange={(e)=>{setNewBudgetItemName(e.target.value)}}>
                                        <option value="">Select Category</option>
                                        {
                                            categories.map((category)=>
                                                <option value={category.name}>{category.name}</option>
                                            )
                                        }
                                    </select>
                                    <input className='m-1 p-1' type='number' placeholder='Monthly alert amount' value={newBudgetItemAmount} onChange={(e)=>{setNewBudgetItemAmount(e.target.value)}} />
                                    <AddCircleOutlineIcon onClick={() => {addBudgetItem()}} />
                                </div>

                            </FormControl>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={closeModel} style={{color: "#000"}}>Cancel</Button>
                            <Button variant='contained' autoFocus style={{backgroundColor: "#283055"}} onClick={createAlertHandler}>
                                Create
                            </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog
                            open={openEdit}
                            onClose={closeModelEdit}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogContent>
                            <FormControl>
                                <input className='mt-2 p-1' type="text" placeholder='Alert name' value={newBudgetName} onChange={(e)=>setNewBudgetName(e.target.value)}/>
                                <div className='d-flex flex-column'>
                                {
                                    newBudgetItems.map((item,index)=><div>{index+1}: {item.category} - {item.amount} <HighlightOffIcon fontSize="large" className='px-2' onClick={()=>{removeBudgetItem(item)}} /></div>)
                                }
                                </div>
                                <div className='mt-2'>
                                    <select className='p-1' name="category" value={newBudgetItemName} onChange={(e)=>{setNewBudgetItemName(e.target.value)}}>
                                        <option value="">Select Category</option>
                                        {
                                            categories.map((category)=>
                                                <option value={category.name}>{category.name}</option>
                                            )
                                        }
                                    </select>
                                    <input className='m-1 p-1' type='number' placeholder='Monthly alert amount' value={newBudgetItemAmount} onChange={(e)=>{setNewBudgetItemAmount(e.target.value)}} />
                                    <AddCircleOutlineIcon onClick={() => {addBudgetItem()}} />
                                </div>

                            </FormControl>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={closeModelEdit} style={{color: "#000"}}>Cancel</Button>
                            <Button variant='contained' autoFocus style={{backgroundColor: "#283055"}} onClick={updateAlertHandler}>
                                Update
                            </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog
                            open={openDelete}
                            onClose={closeModelDelete}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogContent>
                                Do you want to delete Alert: {selectedBudgetId} permenently?
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={closeModelDelete} style={{color: "#000"}}>Cancel</Button>
                            <Button variant='contained' onClick={deleteAlertHandler} style={{backgroundColor: "#283055"}} autoFocus>
                                Confirm
                            </Button>
                            </DialogActions>
                        </Dialog>
                    </main>
                </ProSidebarProvider>
            </div>
    )
}else {
    window.location.href = '/login'
}
}

export default BudgetScreen
