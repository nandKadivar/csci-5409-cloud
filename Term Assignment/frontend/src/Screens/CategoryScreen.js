import React, {useState, useContext, useEffect} from 'react'
import {Dialog, DialogActions, DialogContent } from '@mui/material';
import {Context} from '../Auth/JWTAuth'
import Button from '@mui/material/Button'
import Header from '../Components/Header'
import SidebarNav from '../Components/SidebarNav'
import { ProSidebarProvider } from 'react-pro-sidebar'
import AddIcon from '@mui/icons-material/Add'
import FormControl from '@mui/material/FormControl';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios'

export const CategoryScreen = () => {
    const { token } = useContext(Context)
    const [categories,setCategories] = useState([])
    const [selectedCategory,setSelectedCategory] = useState("")
    const [selectedCategoryId,setSelectedCategoryId] = useState(0)

    const [open, setOpen] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)

    const openModel = () => {
        setOpen(true)
    };

    const closeModel = () => {
        setSelectedCategory("")
        setSelectedCategoryId(0)
        setOpen(false)
    };

    const openEditModel = (category) => {
        console.log(category)
        setSelectedCategory(category.name)
        setSelectedCategoryId(category.id)
        setOpenEdit(true)
    };

    const closeEditModel = () => {
        setSelectedCategory("")
        setSelectedCategoryId(0)
        setOpenEdit(false)
    };

    const openDeleteModel = (category) => {
        setSelectedCategory(category.name)
        setSelectedCategoryId(category.id)
        setOpenDelete(true)
    };

    const closeDeleteModel = () => {
        setSelectedCategory("")
        setSelectedCategoryId(0)
        setOpenDelete(false)
    };

    const createCategory = () => {
        const data = {
            name: selectedCategory
        }

        axios.post(`${process.env.REACT_APP_API_GATEWAY}/category/create`,data,{headers:{"authorization": "Bearer "+token}}).then((res)=>{
            if(res){
                window.location.href= "/category"
            }else {
                alert("Error")
            }
        }).catch((error)=>{
            alert(error)
        })
        closeModel()
    }

    const deleteCategory = () => {
        const data = {
            id: selectedCategoryId
        }

        axios.post(`${process.env.REACT_APP_API_GATEWAY}/category/delete`,data,{headers:{"authorization": "Bearer "+token}}).then((res)=>{
            if(res){
                window.location.href= "/category"
            }else {
                alert("Error")
            }
        }).catch((error)=>{
            alert(error)
        })
        closeDeleteModel()
    }

    const updateCategory = () => {
        const data = {
            id: selectedCategoryId,
            name: selectedCategory
        }

        axios.put(`${process.env.REACT_APP_API_GATEWAY}/category/update`,data,{headers:{"authorization": "Bearer "+token}}).then((res)=>{
            if(res){
                window.location.href= "/category"
            }else {
                alert("Error")
            }
        }).catch((error)=>{
            alert(error)
        })
        closeEditModel()
    }

    useEffect(()=>{
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
                            Add Category
                        </Button>
                        </div>
                        <div className='data-table'>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Category name</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {categories.map((row) => (
                                        <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.id}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                <EditIcon className='action-icons' onClick={()=>openEditModel(row)}/>
                                                <DeleteIcon className='action-icons' onClick={()=>openDeleteModel(row)} />
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
                                    <input className='mt-2 p-1' type="text" placeholder='Name' value={selectedCategory} onChange={(e)=>setSelectedCategory(e.target.value)}/>
                                </FormControl>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={closeModel} style={{color: "#000"}}>Cancel</Button>
                            <Button variant='contained' onClick={createCategory} style={{backgroundColor: "#283055"}} autoFocus>
                                Add
                            </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog
                            open={openEdit}
                            onClose={closeEditModel}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogContent>
                                <FormControl>
                                    <input className='mt-2 p-1' type="text" placeholder='Name' value={selectedCategory} onChange={(e)=>setSelectedCategory(e.target.value)}/>
                                </FormControl>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={closeEditModel} style={{color: "#000"}}>Cancel</Button>
                            <Button variant='contained' onClick={updateCategory} style={{backgroundColor: "#283055"}} autoFocus>
                                Update
                            </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog
                            open={openDelete}
                            onClose={closeDeleteModel}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogContent>
                                Do you want to delete {selectedCategory} category permenently?
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={closeDeleteModel} style={{color: "#000"}}>Cancel</Button>
                            <Button variant='contained' onClick={deleteCategory} style={{backgroundColor: "#283055"}} autoFocus>
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

export default CategoryScreen;
