import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './chat-style.css';

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const discussion = location.state?.discussion;

  const [messages, setMessages] = React.useState([
    ['User1', 'Hello!'],
    ['User2', 'Hi, how are you?'],
    [user?.email, "I'm good, thanks!"]
  ]);
  const [inputMessage, setInputMessage] = React.useState('');
  const [participants] = React.useState([1, 2, 7]);

  const handleExit = () => {
    navigate('/home');
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, [
        user?.email,
        inputMessage
      ]]);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>{discussion?.title || 'Discussion Title'}</h1>
        <button onClick={handleExit} className="exit-button">Exit</button>
      </div>
      
      <div className="chat-content">
        <div className="sidebar">
          <h2>Participants</h2>
          <div className="participants-list">
            {participants.map(participantId => (
              <div key={participantId} className="participant">
                Participant {participantId}
              </div>
            ))}
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
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message[0] === user?.email ? 'user-message' : 'other-message'}`}
              >
                {message[0] !== user?.email && (
                  <span className="user">{message[0]}:</span>
                )}
                <div className="message-content">{message[1]}</div>
              </div>
            ))}
          </div>
          
          <div className="chat-input">
            <input 
              type="text" 
              placeholder="Enter text here..."
              className="message-input"
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="submit-button"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
