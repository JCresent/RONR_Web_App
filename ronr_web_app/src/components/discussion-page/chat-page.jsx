import React, { useState, useEffect } from 'react';
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

  const[motioned, setMotioned] = React.useState(false);
  const[motionedFetched, setMotionedFetched] = React.useState(false);
  const[seconded, setSeconded] = React.useState(false); 
  const[secondedFetched, setSecondedFetched] = React.useState(false);

  const[motionedStageButton, setMotionedStageButton] = React.useState(null);

  const[votesFor, setVotesFor] = React.useState(0);
  const[votesAgainst, setVotesAgainst] = React.useState(0);

  // Using this to correctly update which button is to be shown in regard
  // to the motions state (i.e. motioned, seconded, vote stage) when the
  // discussion is opened.
  const initializeMotionedState = () => {
    //console.log("Motions state fetched.");
    if(!motioned){
      // Put up motion button since no motion has been started.
      setMotionedStageButton ( <PrimaryMotionButton/> );
    }
    else if(!seconded){
      // Put up seconded button since a motion is started but no
      // one has seconded.
      setMotionedStageButton ( <SecondedMotionButton/> );
    }
    else if(motioned && seconded){
      // Put up Yes / No here since a motion is up and has been seconded.
      setMotionedStageButton ( <VotingStageButtons votesFor={votesFor} votesAgainst={votesAgainst} /> );
    }

  };

  React.useEffect(() => { //Run the initialization logic on startup.
    if(motionedFetched && secondedFetched){
      initializeMotionedState();
    }
  }, [motionedFetched, secondedFetched]);

  React.useEffect(() => {
    console.log("Discussion object:", discussion);
    const fetchVotesFor = async () => {
      try {
        console.log("Fetching vote counts (for) for ID:", discussion?._id);
        const response = await fetch(`/discussion/${discussion?._id}/votes_for`);
        if (response.ok) {
          const votes_for = await response.json();
          if(votes_for == 0){ // It wouldn't display 0 for some reason, so this had to be added.
            console.log("The votes for are: " + 0);
            setVotesFor(0);
          }
          else{
            console.log("The votes for are: " + votes_for);
            setVotesFor(votes_for);
          }
        
        } else {
          console.error('Failed to fetch votes (for)');
        }
      } catch (error) {
        console.error('Error fetching votes (for):', error);
      }
    };
    if (discussion?._id) {
      fetchVotesFor();
    }
  }, [discussion]);

  React.useEffect(() => {
    console.log("Discussion object:", discussion);
    const fetchVotesAgainst = async () => {
      try {
        console.log("Fetching vote counts (against) for ID:", discussion?._id);
        const response = await fetch(`/discussion/${discussion?._id}/votes_against`);
        if (response.ok) {
          const votes_against = await response.json();
          if(votes_against == 0){
            console.log("The votes against are: " + 0);
            setVotesAgainst(0);
          }
          else{
            console.log("The votes against are: " + votes_against);
            setVotesAgainst(votes_against);
          }
        } else {
          console.error('Failed to fetch votes (against)');
        }
      } catch (error) {
        console.error('Error fetching votes (against):', error);
      }
    };

    if (discussion?._id) {
      fetchVotesAgainst();
    }
  }, [discussion]);

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

  //Will handle grabbing motioned
  React.useEffect(() => {
    const fetchMotioned = async () => {
      try {
        const response = await fetch(`/discussion/${discussion?._id}/motioned`);
        if (response.ok) {
            const motionedBoolean = await response.json();
            //console.log("Committee is motioned:", motionedBoolean);

            setMotioned(motionedBoolean);
            setMotionedFetched(true);
        } else {
          console.error('Failed to fetch motioned boolean.');
        }
      } catch (error) {
        console.error('Error fetching motioned boolean, error:', error);
      }
    };

    if (discussion?._id) {
      fetchMotioned();
    }
  }, [discussion]);

  //Will handle grabbing seconded
  React.useEffect(() => {
    const fetchSeconded = async () => {
      try {
        const response = await fetch(`/discussion/${discussion?._id}/seconded`);
        if (response.ok) {
            const secondedBoolean = await response.json();
            //console.log("Committee is seconded:", secondedBoolean);

            setSeconded(secondedBoolean);
            setSecondedFetched(true);
        } else {
          console.error('Failed to fetch seconded boolean.');
        }
      } catch (error) {
        console.error('Error fetching motioned boolean, error:', error);
      }
    };

    if (discussion?._id) {
      fetchSeconded();
    }
  }, [discussion]);

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
        console.log("Sent motion request successfully!")
        setMotionedStageButton(<SecondedMotionButton/>);

      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // Fetch method for seconding a motion
  const handleSecond = async () => {    
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
        console.log("Sent second request successfully!")
        setMotionedStageButton(<VotingStageButtons votesFor={votesFor} votesAgainst={votesAgainst}/>);

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

  function handleVoting(voteForOrAgainst){
    // handleVotingFrontend(voteForOrAgainst);
    handleVotingBackend(voteForOrAgainst);
  }

  // ISSUES HERE:
  //  - updating front-end vote counter. Refreshing the page has the desired effect, but
  //    the vote should incremented right after a user presses the button.
  function handleVotingFrontend(voteForOrAgainst){
    if(voteForOrAgainst === 'for'){
      setVotesFor(prevVotesFor => prevVotesFor + 1);
    }
    if(voteForOrAgainst === 'against'){ 
      setVotesAgainst(prevVotesAgainst => prevVotesAgainst + 1);
    }
  }

  // Re-render the state variables 
  useEffect(() => {
    if (motioned && seconded) {
      setMotionedStageButton(
        <VotingStageButtons votesFor={votesFor} votesAgainst={votesAgainst} />
      );
    }
  }, [votesFor, votesAgainst, motioned, seconded]);

  const handleVotingBackend = async (voteForOrAgainst) => {
    try {
      const motionData = {
        committee_id: discussion._id,
        userId: user?.id,
        vote: voteForOrAgainst
      };

      const response = await fetch(`/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(motionData),
      });

      if (response.ok) {
        console.log("Sent vote request successfully!");
        handleVotingFrontend(voteForOrAgainst);
      } else {
        console.error('Failed to vote.');
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  function PrimaryMotionButton(props){
    return (
      <div>
        <button onClick={handleMotion}>Motion</button>
      </div>
    )
  }

  function SecondedMotionButton(props){
    return (
      <div>
        <button onClick={handleSecond}>Second Motion?</button>
      </div>
    )
  }

  function VotingStageButtons({ votesFor, votesAgainst }) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'center',  marginTop: '5px', marginBottom: '0px' }}>
          <button
            onClick={() => handleVoting('for')}
            style={{
              padding: '10px 25px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Yes
          </button>
          <button
            onClick={() => handleVoting('against')}
            style={{
              padding: '10px 25px',
              backgroundColor: '#F44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            No
          </button>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '0px', marginBottom: '5px'}}>
            <header style={{backgroundColor:'#f4f4f4', color:'black'}}> Yes: </header>
            <h1 style={{backgroundColor:'#f4f4f4', color:'green'}}> {votesFor} </h1>
            <header style={{backgroundColor:'#f4f4f4', color:'black', marginLeft: '40px'}}> No: </header>
            <h1 style={{backgroundColor:'#f4f4f4',color:'red'}}> {votesAgainst} </h1>
        </div>
        <div>
          <h2>{}</h2>
        </div>
      </div>
    );
  }
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
          
          <hr width="100%;" color="gray" size="3"/>

          {motionedStageButton}
          
          <hr width="100%;" color="gray" size="3"/>

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
