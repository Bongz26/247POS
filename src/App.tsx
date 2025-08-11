// src/App.tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './lib/supabase';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import SaleForm from './components/SaleForm';
import TransactionHistory from './components/TransactionHistory';
import StockTake from './components/StockTake';
import CashUp from './components/CashUp';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import CashUpHistory from './components/CashUpHistory';

const App: React.FC = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <BrowserRouter>
      <nav className="p-4 bg-gray-800 text-white flex justify-between">
        <div>
          <Link to="/products" className="mr-4 hover:text-blue-300">Products</Link>
          <Link to="/products/add" className="mr-4 hover:text-blue-300">Add Product</Link>
          <Link to="/sales" className="mr-4 hover:text-blue-300">Sales</Link>
          <Link to="/transactions" className="mr-4 hover:text-blue-300">Transactions</Link>
          <Link to="/stock-take" className="mr-4 hover:text-blue-300">Stock Take</Link>
          <Link to="/cash-up" className="mr-4 hover:text-blue-300">Cash Up</Link>
          <Link to="/cash-up-history" className="mr-4 hover:text-blue-300">Cash-Up History</Link>
        </div>
        <button onClick={handleLogout} className="hover:text-red-300">Logout</button>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/add"
          element={
            <ProtectedRoute>
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <SaleForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock-take"
          element={
            <ProtectedRoute>
              <StockTake />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cash-up"
          element={
            <ProtectedRoute>
              <CashUp />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/cash-up-history"
          element={
            <ProtectedRoute>
              <CashUpHistory />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;