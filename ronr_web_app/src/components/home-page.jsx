import React from 'react';
import './home-style.css';
import courtroomImage from '../icons/courtroom.jpg';
import { useLocation, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state?.userEmail || 'No user logged in';

  const handleLogout = () => {
    navigate('/');
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
        <b style={{ marginLeft: '20px' }}>Currently logged in as: {userEmail}</b>
        <button 
          type="button" 
          className="btn" 
          style={{ marginRight: '20px' }}
          onClick={handleLogout}
        >
          Log Out
        </button>
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
            <button type="button" className="btn">Create a Discussion</button>
          </div>

          <table id="discussion_list">
            <thead>
              <tr>
                <th id="title">Information</th>
                <th id="join">Join</th>
              </tr>
            </thead>
            <tbody>
              {/* Discussions will be populated here */}
            </tbody>
          </table>

          <div className="discussions">
            <div className="discussion">
              <span>Discussion 1</span>
              <span>Join</span>
            </div>
            <div className="discussion">
              <span>Discussion 2</span>
              <span>Join</span>
            </div>
            <div className="discussion">
              <span>Discussion 3</span>
              <span>Join</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
