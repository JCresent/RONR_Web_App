import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/login-pages/login-page'; // Start page
import Registration from './components/login-pages/registration'; // Registration page
import PasswordReset from './components/login-pages/password-reset'; // Password reset page
import HomePage from './components/home-page/home-page'; // Home page
import ChatPage from './components/discussion-page/chat-page';

function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
