import './App.scss';
import Header from './components/Header';
import TableUsers from './components/TableUsers';
import Homes from './components/Home';
import Container from 'react-bootstrap/Container';
import { ToastContainer, toast } from 'react-toastify';
import { Routes, Route, Link } from "react-router-dom";
import Login from './components/Login';


function App() {



  return (
    <>
      <div className='app-container'>

      <Header />
        <Container>
        
          <Routes>
            <Route path='/' element={<Homes />} />
            <Route path='/users' element={<TableUsers />} />
            <Route path='/login' element={<Login />} />
          </Routes>

        </Container>

      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />
    </>
  );
}

export default App;
