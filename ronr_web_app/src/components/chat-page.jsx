import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './chat-style.css';

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const discussion = location.state?.discussion;

  const handleExit = () => {
    navigate('/home');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Discussion Title</h1>
        <button onClick={handleExit} className="exit-button">Exit</button>
      </div>
      
      <div className="chat-content">
        <div className="sidebar">
          <h2>Participants</h2>
          <div className="participants-list">
            <div className="participant">Participant1</div>
            <div className="participant">Participant2</div>
            <div className="participant">Participant3</div>
          </div>
          
          <button className="motion-button">Motion to Vote</button>
          
          <h2>Active Motions</h2>
          <div className="motions-list">
            <div className="motion">Motion 1</div>
            <div className="motion">Motion 2</div>
          </div>
        </div>
        
        <div className="chat-main">
          <div className="messages">
            <div className="message other-message">
              <span className="user">User1:</span>
              <div className="message-content">Hello!</div>
            </div>
            <div className="message other-message">
              <span className="user">User2:</span>
              <div className="message-content">Hi, how are you?</div>
            </div>
            <div className="message user-message">
              <div className="message-content">I'm good, thanks!</div>
            </div>
          </div>
          
          <div className="chat-input">
            <input 
              type="text" 
              placeholder="Enter text here..."
              className="message-input"
            />
            <button className="submit-button">Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
