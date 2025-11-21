import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from './Components/pages/Products';
import AddProductComponent from "./Components/pages/AddProduct";
import './App.css'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard/>} />
        <Route path="/add-product" element={<AddProductComponent/>} />
      </Routes>
    </Router>
  );
}

export default App;