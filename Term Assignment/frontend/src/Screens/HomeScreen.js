import React, {useContext, useEffect, useState} from 'react'
import {Context} from '../Auth/JWTAuth'
import { Row, Col } from 'react-bootstrap'
import Header from '../Components/Header'
import SidebarNav from '../Components/SidebarNav'
import { ProSidebarProvider } from 'react-pro-sidebar'

import Chart from "chart.js/auto";
import {Doughnut} from 'react-chartjs-2'
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios'

const data_grid_columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'type', headerName: 'Type', width: 260 },
    { field: 'amount', headerName: 'Amount', width: 130 }
  ];

export const HomeScreen = () => {
    const { token } = useContext(Context)

    const [transactions,setTransactions] = useState([])
    const [categories,setCategories] = useState([])
    const [chartData,setChartData] = useState(null)
    const [incomeChartData,setIncomeChartData] = useState(null)
    const [income,setIncome] = useState(null)
    const [expense,setExpense] = useState(null)

    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_API_GATEWAY}/transaction/get`,{headers:{"authorization": "Bearer "+token}}).then((res)=>{
            if(res.data){
                setTransactions(res.data)
                
                const all_trasactions = res.data
        
                var chart_labels = []
                var chart_label_values = []
                var income_chart_labels = []
                var income_chart_label_values = []

                var total_expense = 0
                var total_income = 0

                all_trasactions.forEach(element => {
                    if(element.type == "expense"){
                        total_expense = total_expense + parseFloat(element.amount)
                        if(!chart_labels.includes(element.category.name)){
                            chart_labels.push(element.category.name)
                        }
                    }else {
                        total_income = total_income + parseFloat(element.amount)
                        if(!income_chart_labels.includes(element.category.name)){
                            income_chart_labels.push(element.category.name)
                        } 
                    }
                });
            
                chart_labels.forEach(label => {
                    var sum = 0
                    all_trasactions.forEach(element => {
                        if(element.type == "expense" && element.category.name == label){
                            sum = sum + parseFloat(element.amount)
                        }
                    });
                    chart_label_values.push(sum)
                });

                income_chart_labels.forEach(label => {
                    var sum = 0
                    all_trasactions.forEach(element => {
                        if(element.type == "income" && element.category.name == label){
                            sum = sum + parseFloat(element.amount)
                        }
                    });
                    income_chart_label_values.push(sum)
                });
            
                var chart_data = {
                    labels: chart_labels,
                    datasets: [{
                        label: 'Expense',
                        data: chart_label_values,
                        backgroundColor: [
                            'rgb(254, 97, 142)',
                            'rgb(56, 152, 245)',
                            'rgb(258, 215, 76)',
                            'rgb(255, 176, 127)',
                            'rgb(101, 40, 247)'
                        ],
                        hoverOffset: 5
                    }]
                }

                var income_chart_data = {
                    labels: income_chart_labels,
                    datasets: [{
                        label: 'Income',
                        data: income_chart_label_values,
                        backgroundColor: [
                            'rgb(254, 97, 142)',
                            'rgb(56, 152, 245)',
                            'rgb(258, 215, 76)',
                            'rgb(255, 176, 127)',
                            'rgb(101, 40, 247)'
                        ],
                        hoverOffset: 5
                    }]
                }

                console.log(chart_data)
                setChartData(chart_data)
                setIncomeChartData(income_chart_data)
                setIncome(total_income)
                setExpense(total_expense)
            }
        })
        axios.get(`${process.env.REACT_APP_API_GATEWAY}/category/get`,{headers:{"authorization": "Bearer "+token}}).then((res)=>{
            if(res.data){
                setCategories(res.data)
            }
        })
        // setLoading(false)
    },[])

    if(token !== ""){
        return (
            <div className='d-flex'>
            <ProSidebarProvider>
                <Header />
                <SidebarNav />
                <main className='d-flex flex-column p-3 align-items-center' style={{marginTop: "45px",backgroundColor: "#f6f9ff",width: "100%"}}>
                     <Row className="dashboard-panel p-3">
                        <Col className='d-flex dashboard-panel-column'>
                            <div className='dashboard-panel-label'>Income</div>
                            <div className='dashboard-panel-digit' style={{color: "#59a6ff"}}>{income && income}</div>
                        </Col>
                        <Col className='d-flex dashboard-panel-column'>
                            <div className='dashboard-panel-label'>Expense</div>
                            <div className='dashboard-panel-digit' style={{color: "#fd6854"}}>{expense && expense}</div>
                        </Col>
                        <Col className='d-flex dashboard-panel-column'>
                            <div className='dashboard-panel-label'>Total</div>
                            <div className='dashboard-panel-digit' style={{color: "#f7f7f7"}}>{expense && (income - expense).toFixed(2)}</div>
                        </Col>
                        </Row>
                        <Row className='mt-2 dashboard-map-panel'>
                        <div className='col-6'>
                        </div>
                        <div className='col-6'>
                        </div>
                    </Row>
                    <div className='d-flex col-12 p-2 flex-wrap' style={{backgroundColor: "#fff"}}>
                        {/* {console.log(chartData)} */}
                        <div className='col-6' style={{height:"445px"}}>
                            {chartData ? <Doughnut data={chartData} options={{ maintainAspectRatio: false }} /> : "Loading ..."}
                        </div>
                        <div className='col-6' style={{height:"445px"}}>
                            {incomeChartData ? <Doughnut data={incomeChartData} options={{ maintainAspectRatio: false }} /> : "Loading ..."}
                        </div>
                        <div className='col-12 mt-3'>
                            <h6>Recent Transactions</h6>
                            <DataGrid
                                rows={transactions}
                                columns={data_grid_columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 5 },
                                    }
                                }}
                                className='mt-2'
                            />
                        </div>
                    </div>
                </main>
            </ProSidebarProvider>
            </div>
        )
    }else {
        window.location.href = '/login'
    }
}

export default HomeScreen;
