import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LoginScreen from "./Screens/LoginScreen"
import RegistrationScreen from "./Screens/RegistrationScreen"
import HomeScreen from "./Screens/HomeScreen"
import TransactionScreen from './Screens/TransactionScreen'
import CategoryScreen from "./Screens/CategoryScreen"
import BudgetScreen from "./Screens/BudgetScreen"
import { MemoizedProvider } from "./Auth/JWTAuth"
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css'

const App = () => {
  return (
    <Router>
        <MemoizedProvider>
          <Routes>
            <Route exact path="/" element={<Navigate replace to="/login"/>} />
            <Route exact path="/login" Component={LoginScreen} />
            <Route exact path="/registration" Component={RegistrationScreen} /> 
            <Route exact path="/home" Component={HomeScreen} />
            <Route exact path="/transaction" Component={TransactionScreen} />
            <Route exact path="/category" Component={CategoryScreen} />
            <Route exact path="/alert" Component={BudgetScreen} />
          </Routes>
      </MemoizedProvider>
    </Router>
  );
}

export default App;
