import React from 'react';
import './home-style.css';
import courtroomImage from '../../icons/courtroom.jpg';
import { useLocation, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state?.userEmail || 'No user logged in';
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
      setDiscussions(data);
    } catch (error) {
      console.error('Error fetching committees:', error);
    }
  };

  React.useEffect(() => {
    fetchCommittees();
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  const handleCreateDiscussion = () => {
    setIsModalOpen(true);
  };

  const handleSubmitDiscussion = (e) => {
    e.preventDefault();
    const discussion = {
      id: discussions.length + 1,
      ...newDiscussion,
      createdAt: new Date().toISOString(),
    };
    setDiscussions([...discussions, discussion]);
    setIsModalOpen(false);
    setNewDiscussion({ title: '', description: '' }); // Reset form
  };

  const handleJoinDiscussion = (discussion) => {
    navigate('/chat', { state: { discussion } });
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
          <span className="user-email">{userEmail}</span>
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
                  <tr key={discussion.id}>
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
                <label htmlFor="description">Description:</label>
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