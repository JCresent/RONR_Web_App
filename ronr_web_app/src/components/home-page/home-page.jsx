import React from 'react';
import './home-style.css';
import courtroomImage from '../../icons/courtroom.jpg';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const HomePage = () => {
  const navigate = useNavigate();
  // const userEmail = location.state?.userEmail || 'No user logged in';
  const { user, setUser } = useUser();
  const [discussions, setDiscussions] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newDiscussion, setNewDiscussion] = React.useState({
    title: '',
    description: ''
  });

  //Grabbing committees
  const fetchCommittees = async () => {
    try {
      const response = await fetch('/getCommittees');
      const data = await response.json();
      console.log("Fetched committees:", data);
      setDiscussions(data);
    } catch (error) {
      console.error('Error fetching committees:', error);
    }
  };

  React.useEffect(() => {
    fetchCommittees();
    if (!user) {
      const storedEmail = localStorage.getItem('userEmail');
      const storedId = localStorage.getItem('userId');
      if (storedEmail && storedId) {
        setUser({ 
          id: storedId,
          email: storedEmail 
        });
      } else {
        navigate('/');
      }
    }
  }, [user, navigate, setUser]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const handleCreateDiscussion = () => {
    setIsModalOpen(true);
  };

  const handleSubmitDiscussion = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/creatediscussion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner_id: user?.id, // or user ID if you have one
          title: newDiscussion.title,
          description: newDiscussion.description,
          chair_id: user?.id, // initially set chair as creator
          members: {}, // empty initially
          voters: {}, // empty initially
        }),
      });

      if (response.ok) {
        await response.json();
        fetchCommittees();
        setIsModalOpen(false);
        setNewDiscussion({ title: '', description: '' });
      } else {
        console.error('Failed to create discussion');
      }
    } catch (error) {
      console.error('Error creating discussion:', error);
    }
  };

  const handleJoinDiscussion = async (discussion) => {
    try {
      const joinResponse = await fetch(`/discussion/${discussion._id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id
        }),
      });

      const data = await joinResponse.json();

      if (!joinResponse.ok) {
        console.error('Failed to join discussion');
        return;
      }

      navigate('/chat', { 
        state: { 
          discussion: {
            _id: data.discussion._id,
            title: data.discussion.title,
            description: data.discussion.description,
            messages: data.discussion.messages || [],
            members: data.discussion.members || []
          } 
        } 
      });
    } catch (error) {
      console.error('Error joining discussion:', error);
    }
  };

  return (
    <div className="home-page-container">
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Blinker&display=swap"
        rel="stylesheet"
      />
      <title>Home Page</title>

      <div id="topbar">
        <div className="topbar-left">
          <h2>Robert's Rules</h2>
        </div>
        <div className="topbar-right">
          <span className="user-email">{user?.email}</span>
          <button 
            type="button" 
            className="btn nav-btn"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="main_container">
        <div className="basicinfo">
          <img src={courtroomImage} id="courtroompic" alt="Courtroom" />
          <h1>Robert's Rules of Order</h1>
          <p>
            Complex discussions, made easy. Select a discussion from below, or
            start your own with the click of a button.
          </p>
        </div>

        <div className="discussions_container">
          <div className="discussions_header">
            <select name="filter" id="filter">
              <optgroup label="Filter">Filter</optgroup>
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="Open">Open Discussions First</option>
              <option value="Closed">Closed Discussions First</option>
            </select>
            <button 
              type="button" 
              className="btn" 
              onClick={handleCreateDiscussion}
            >
              Create a Discussion
            </button>
          </div>

          <table id="discussion_list">
            <thead>
              <tr>
                <th id="title">Information</th>
                <th id="join">Join</th>
              </tr>
            </thead>
            <tbody>
              {discussions.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{ textAlign: 'center' }}>
                    No discussions available
                  </td>
                </tr>
              ) : (
                discussions.map(discussion => (
                  <tr key={discussion._id}>
                    <td>{discussion.title}</td>
                    <td>
                      <button 
                        type="button" 
                        className="btn"
                        onClick={() => handleJoinDiscussion(discussion)}
                      >
                        Join
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal Dialog */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button 
              className="close-button" 
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <h2>Create New Discussion</h2>
            <form onSubmit={handleSubmitDiscussion}>
              <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  id="title"
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion({
                    ...newDiscussion,
                    title: e.target.value
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description of the issue:</label>
                <textarea
                  id="description"
                  value={newDiscussion.description}
                  onChange={(e) => setNewDiscussion({
                    ...newDiscussion,
                    description: e.target.value
                  })}
                  required
                />
              </div>

              <div className="modal-buttons">
                <button type="submit" className="btn">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
