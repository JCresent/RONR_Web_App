import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/login-pages/login-page'; // Start page
import Registration from './components/login-pages/registration'; // Registration page
import PasswordReset from './components/login-pages/password-reset'; // Password reset page
import HomePage from './components/home-page'; // Home page
function App() {
  return (
    <div className="App">
      {/* <header className="App-header"> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      {/* </header> */}
    </div>
  );
}

export default App;
