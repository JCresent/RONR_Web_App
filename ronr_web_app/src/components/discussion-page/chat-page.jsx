import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './chat-style.css';

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const discussion = location.state?.discussion;

  const [messages, setMessages] = React.useState([]);
  const [inputMessage, setInputMessage] = React.useState('');
  const [members, setMembers] = React.useState(discussion?.members || []);
  const [usernames, setUsernames] = React.useState({});
  const [ws, setWs] = React.useState(null);
  const [issue, setIssue] = React.useState(''); 

  const[discussionState, setDiscussionState] = React.useState('Unmotioned'); // Default state when page starts
  const[motionButtonText, setMotionButtonText] = React.useState('Motion to Vote');

  React.useEffect(() => {
    console.log("Discussion object:", discussion);
    const fetchMessages = async () => {
      try {
        console.log("Fetching messages for ID:", discussion?._id);
        const response = await fetch(`/discussion/${discussion?._id}/messages`);
        if (response.ok) {
          const messageData = await response.json();
          setMessages(messageData);
        } else {
          console.error('Failed to fetch messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (discussion?._id) {
      fetchMessages();
    }
  }, [discussion]);


  React.useEffect(() => {
    const fetchDescription = async () => {
      try {
        console.log("Fetching issue description for ID:", discussion?._id);
        const response = await fetch(`/discussion/${discussion?._id}/description`);
        if (response.ok) {
            const issueData = await response.json();
            setIssue(issueData);
        } else {
          console.error('Failed to fetch description');
        }
      } catch (error) {
        console.error('Error fetching description:', error);
      }
    };

    if (discussion?._id) {
      fetchDescription();
    }
  }, [discussion]);

  React.useEffect(() => {
    const fetchUsernames = async () => {
      const usernamesMap = {};
      for (const memberId of discussion?.members || []) {
        try {
          const response = await fetch(`/user/${memberId}`);
          if (response.ok) {
            const userData = await response.json();
            usernamesMap[memberId] = userData.username;
          }
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      }
      setUsernames(usernamesMap);
    };

    fetchUsernames();
  }, [discussion?.members]);
  

  React.useEffect(() => {
    if (discussion?.members) {
      setMembers(discussion.members);
    }
  }, [discussion]);

  React.useEffect(() => {
    if (discussion?._id) {
      const websocket = new WebSocket('ws://localhost:3002');
      
      websocket.onopen = () => {
        websocket.send(JSON.stringify({
          type: 'join',
          discussionId: discussion._id
        }));
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          setMessages(prevMessages => [...prevMessages, [data.userId, data.message]]);
        }
      };

      setWs(websocket);

      return () => {
        websocket.close();
      };
    }
  }, [discussion?._id]);

  const handleExit = () => {
    navigate('/home');
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = async () => {
    if (!discussion?._id || !inputMessage.trim() || !ws) return;

    try {
      const messageData = {
        userId: user.id,
        message: inputMessage.trim()
      };

      // First send to WebSocket for real-time update
      ws.send(JSON.stringify({
        type: 'message',
        userId: user.id,
        message: inputMessage.trim()
      }));

      // Then persist to database
      const response = await fetch(`/discussion/${discussion._id}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        setMessages(prevMessages => [...prevMessages, [user.id, inputMessage.trim()]]);
        setInputMessage('');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  const handleMotion = async () => {
    //if (!discussion?._id || !inputMessage.trim()) return;

    setMotionButtonText('Motion Active: Second it?');

    try {
      console.log(discussion._id); 

      const motionData = {
        discussionId: discussion._id
      };

      const response = await fetch(`/discussion/${discussion._id}/motioned`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(motionData),
      });

      if (response.ok) {
        //setMessages(prevMessages => [...prevMessages, [user.id, inputMessage.trim()]]);
        //setInputMessage('');
        console.log("Sent motion request successfully!")
        setDiscussionState('Motioned')
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // Fetch method for seconding a motion
  const handleSecond = async () => {
    //if (!discussion?._id || !inputMessage.trim()) return;
    
    try {
      const motionData = {
        discussionId: discussion._id
      };

      const response = await fetch(`/discussion/${discussion._id}/seconded`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(motionData),
      });

      if (response.ok) {
        //setMessages(prevMessages => [...prevMessages, [user.id, inputMessage.trim()]]);
        //setInputMessage('');
        console.log("Sent second request successfully!")
        setDiscussionState('Seconded')
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
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
            {members.map(memberId => (
              <div key={memberId} className="participant">
                {usernames[memberId] || 'Loading...'}
              </div>
            ))}
          </div>
          
          <button className="motion-button" onClick={handleMotion}>{motionButtonText}</button>
          
          <h2>Issue:</h2>
          <div className="motions-list">
            <div className="motion">{issue || 'Issue Description'}</div>
          </div>
        </div>
        
        <div className="chat-main">
          <div className="messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message[0] === user.id ? 'user-message' : 'other-message'}`}
              >
                {message[0] !== user.id && (
                  <span className="user">{usernames[message[0]] || 'Unknown User'}:</span>
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
