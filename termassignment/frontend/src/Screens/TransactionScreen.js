import React, {useState, useContext, useEffect} from 'react'
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import {Context} from '../Auth/JWTAuth'
import Button from '@mui/material/Button'
import Header from '../Components/Header'
import SidebarNav from '../Components/SidebarNav'
import { ProSidebarProvider } from 'react-pro-sidebar'
import AddIcon from '@mui/icons-material/Add'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios'

export const TransactionScreen = () => {
    const { token } = useContext(Context)
    const [open, setOpen] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)

    const [transactions,setTransactions] = useState([])
    const [categories,setCategories] = useState([])
    // const [categories,setCategories] = useState([{"id":9848,"name":"rent"},{"id":2468,"name":"Grocery"}])
    const [newTransactionType,setNewtTransactionType] = useState("expense")
    const [newTransactionDate,setNewTransactionDate] = useState("")
    const [newTransactionAmount,setNewTransactionAmount] = useState("")
    const [newTransactionCategory,setNewTransactionCategory] = useState("")
    const [newTranactionNote, setNewTransactionNote] = useState("")
    const [selectedTransactionId,setSelectedTransactionId] = useState(0)


    const openModel = () => {
        setNewtTransactionType("expense")
        setNewTransactionCategory("")
        setOpen(true)
    };

    const closeModel = () => {
        setNewTransactionDate("")
        setNewTransactionAmount("")
        setNewTransactionNote("")
        setNewtTransactionType("expense")
        setNewTransactionCategory("")
        setOpen(false)
    };

    const openModelEdit = (transaction) => {
        setSelectedTransactionId(transaction.id)
        setNewtTransactionType(transaction.type)
        setNewTransactionDate(transaction.date)
        setNewTransactionAmount(transaction.amount)
        setNewTransactionCategory(transaction.category.name)
        setNewTransactionNote(transaction.note)
        setOpenEdit(true)
    };

    const closeModelEdit = () => {
        setSelectedTransactionId(0)
        setNewTransactionDate("")
        setNewTransactionAmount("")
        setNewTransactionNote("")
        setNewtTransactionType("expense")
        setNewTransactionCategory("")
        setOpenEdit(false)
    };

    const openModelDelete = (transaction) => {
        setSelectedTransactionId(transaction.id)
        setOpenDelete(true)
    };

    const closeModelDelete = () => {
        setSelectedTransactionId(0)
        setOpenDelete(false)
    }; 

    const createTransactionHandler = () => {
        const transaction = {
            type: newTransactionType,
            date: newTransactionDate,
            day: newTransactionDate.split("-")[2],
            month: newTransactionDate.split("-")[1],
            year: newTransactionDate.split("-")[0],
            amount: newTransactionAmount,
            category: {
                name: newTransactionCategory
            },
            note: newTranactionNote
        }

        console.log(transaction)

        axios.post(`${process.env.REACT_APP_API_GATEWAY}/transaction/create`,transaction,{headers:{"authorization": "Bearer "+token}}).then((res)=>{
            if(res){
                window.location.href = "/transaction"
            }
        }).catch((error)=>{
            alert(error)
        })
        closeModel()
    }

    const updateTransactionHandler = () => {
        const transaction = {
            id: selectedTransactionId,
            type: newTransactionType,
            date: newTransactionDate,
            day: newTransactionDate.split("-")[2],
            month: newTransactionDate.split("-")[1],
            year: newTransactionDate.split("-")[0],
            amount: newTransactionAmount,
            category: {
                name: newTransactionCategory
            },
            note: newTranactionNote
        }

        axios.put(`${process.env.REACT_APP_API_GATEWAY}/transaction/update`,transaction,{headers:{"authorization": "Bearer "+token}}).then((res)=>{
            if(res){
                window.location.href = "/transaction"
            }
        }).catch((error)=>{
            alert(error)
        })

        setOpenEdit(false)
    }

    const deleteTransactionHandler = () => {
        const transaction = {
            id: selectedTransactionId
        }

        axios.post(`${process.env.REACT_APP_API_GATEWAY}/transaction/delete`,transaction).then((res)=>{
            if(res){
                window.location.href = "/transaction"
            }
        }).catch((error)=>{
            alert(error)
        })

        setOpenDelete(false)
    }

    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_API_GATEWAY}/transaction/get`,{headers:{"authorization": "Bearer "+token}}).then((res)=>{
            if(res.data){
                setTransactions(res.data)
            }
        })
        axios.get(`${process.env.REACT_APP_API_GATEWAY}/category/get`,{headers:{"authorization": "Bearer "+token}}).then((res)=>{
            if(res.data){
                setCategories(res.data)
            }
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
                            Add Transaction
                        </Button>
                        </div>
                        <div className='data-table'>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Transaction Type</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Note</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {transactions.map((row) => (
                                        <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.id}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.type}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.category.name}
                                            </TableCell>
                                            <TableCell component="th" scope="row" style={{color: row.type != "expense" ? "#59a6ff" : "#fd6854"}}>
                                                {row.amount}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.note}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.date}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                <EditIcon className='action-icons' onClick={()=>openModelEdit(row)}/>
                                                <DeleteIcon className='action-icons' onClick={()=>openModelDelete(row)} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                        </div>


                        <Dialog
                            open={open}
                            onClose={closeModel}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogContent>
                                <FormControl>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="expense"
                                        name="radio-buttons-group"
                                        className='d-flex flex-row'
                                        value={newTransactionType}
                                        onChange={(e)=>setNewtTransactionType(e.target.value)}
                                    >
                                        <FormControlLabel value="income" control={<Radio />} label="income" />
                                        <FormControlLabel value="expense" control={<Radio />} label="expense" />
                                    </RadioGroup>
                                    <input type="date" className='p-1' value={newTransactionDate} onChange={(e)=>setNewTransactionDate(e.target.value)} />
                                    <input className='mt-1 p-1' type='number' placeholder='Amount' value={newTransactionAmount} onChange={(e)=>{setNewTransactionAmount(e.target.value)}} />
                                    <div className='mt-2'>
                                        <select className='p-1' name="category" value={newTransactionCategory} onChange={(e)=>{setNewTransactionCategory(e.target.value)}}>
                                            <option value="">Select Category</option>
                                            {
                                                categories.map((category)=>
                                                    <option value={category.name}>{category.name}</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                    <div className='mt-2'>
                                        <textarea className='p-1' type="text" placeholder='Note' value={newTranactionNote} onChange={(e)=>{setNewTransactionNote(e.target.value)}}/>
                                    </div>

                                </FormControl>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={closeModel} style={{color: "#000"}}>Cancel</Button>
                            <Button variant='contained' onClick={createTransactionHandler} style={{backgroundColor: "#283055"}} autoFocus>
                                Add
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
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="expense"
                                        name="radio-buttons-group"
                                        className='d-flex flex-row'
                                        value={newTransactionType}
                                        onChange={(e)=>setNewtTransactionType(e.target.value)}
                                    >
                                        <FormControlLabel value="income" control={<Radio />} label="income" />
                                        <FormControlLabel value="expense" control={<Radio />} label="expense" />
                                    </RadioGroup>
                                    <input type="date" className='p-1' value={newTransactionDate} onChange={(e)=>setNewTransactionDate(e.target.value)} />
                                    <input className='mt-1 p-1' type='number' placeholder='Amount' value={newTransactionAmount} onChange={(e)=>{setNewTransactionAmount(e.target.value)}} />
                                    <div className='mt-2'>
                                        <select className='p-1' name="category" value={newTransactionCategory} onChange={(e)=>{setNewTransactionCategory(e.target.value)}}>
                                            <option value="">Select Category</option>
                                            {
                                                categories.map((category)=>
                                                    <option value={category.name}>{category.name}</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                    <div className='mt-2'>
                                        <textarea className='p-1' type="text" placeholder='Note' value={newTranactionNote} onChange={(e)=>{setNewTransactionNote(e.target.value)}}/>
                                    </div>

                                </FormControl>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={closeModelEdit} style={{color: "#000"}}>Cancel</Button>
                            <Button variant='contained' autoFocus style={{backgroundColor: "#283055"}} onClick={updateTransactionHandler}>
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
                                Do you want to delete Transaction: {selectedTransactionId} permenently?
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={closeModelDelete} style={{color: "#000"}}>Cancel</Button>
                            <Button variant='contained' onClick={deleteTransactionHandler} style={{backgroundColor: "#283055"}} autoFocus>
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

export default TransactionScreen
