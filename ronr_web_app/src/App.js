import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './login-page'; // Your new start page component

function App() {
  return (
    <div className="App">
      {/* <header className="App-header"> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
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
