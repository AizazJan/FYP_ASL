import React, { useState, useRef, useEffect } from 'react';

  const Home = ({ user, onLogout }) => {
  const [showChat, setShowChat] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'System', text: 'Welcome to the chat!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [detectedSign, setDetectedSign] = useState('');
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [education, setEducation] = useState('');
  const [bio, setBio] = useState('');

  // Webcam setup/cleanup
  useEffect(() => {
    if (showVideo) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          setVideoStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        });
    } else if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    // eslint-disable-next-line
  }, [showVideo]);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  const getAccessibilityStatus = () => {
    if (user.isDeaf && user.isMute) return 'Deaf and Mute';
    if (user.isDeaf) return 'Deaf';
    if (user.isMute) return 'Mute';
    return 'Standard';
  };

  // Chat logic
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatInput.trim() === '') return;
    setChatMessages([...chatMessages, { sender: user.name, text: chatInput }]);
    setChatInput('');
  };

  // Simulated sign detection
  const signs = [
    { sign: '🤟', meaning: 'I love you' },
    { sign: '👋', meaning: 'Hello' },
    { sign: '🙏', meaning: 'Thank you' },
    { sign: '✋', meaning: 'Stop' },
    { sign: '👍', meaning: 'Good' },
    { sign: '👎', meaning: 'Bad' },
  ];
  const detectRandomSign = () => {
    const random = signs[Math.floor(Math.random() * signs.length)];
    setDetectedSign(`${random.sign} = ${random.meaning}`);
  };

  // Handle profile pic upload
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="home-container">
      <div className="container">
        {/* Navigation Bar */}
        <div className="navbar">
          <h1>Deaf & Mute Communication App</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: '#666' }}>
              Welcome, {user.name} ({getAccessibilityStatus()})
            </span>
            <button onClick={() => setShowProfile(true)} className="profile-btn" title="Edit Profile">
              {profilePicPreview ? (
                <img src={profilePicPreview} alt="Profile" className="profile-pic-thumb" />
              ) : (
                <span role="img" aria-label="profile" style={{ fontSize: '1.7rem' }}>👤</span>
              )}
            </button>
            <button onClick={onLogout}>Logout</button>
          </div>
        </div>

        {/* Profile Modal */}
        {showProfile && (
          <div className="modal-overlay">
            <div className="modal profile-modal">
              <button className="modal-close" onClick={() => setShowProfile(false)}>&times;</button>
              <h2>Edit Profile</h2>
              <form className="profile-form" onSubmit={e => { e.preventDefault(); setShowProfile(false); }}>
                <div className="profile-pic-upload">
                  <label htmlFor="profile-pic-input">
                    {profilePicPreview ? (
                      <img src={profilePicPreview} alt="Profile Preview" className="profile-pic-large" />
                    ) : (
                      <div className="profile-pic-placeholder">Upload Picture</div>
                    )}
                  </label>
                  <input
                    id="profile-pic-input"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleProfilePicChange}
                  />
                </div>
                <div className="form-group">
                  <label>Education Details</label>
                  <input
                    type="text"
                    value={education}
                    onChange={e => setEducation(e.target.value)}
                    placeholder="e.g. B.A. in Special Education"
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '18px' }}>Save</button>
              </form>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="welcome-section">
          <h2>Welcome to Your Communication Hub</h2>
          <p>
            Connect with others in the deaf and mute community. Use our specialized tools 
            to communicate effectively and build meaningful relationships.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Text Chat</h3>
            <p>
              Real-time text messaging with other users. Perfect for both deaf and mute 
              individuals to communicate clearly and effectively.
            </p>
            <button 
              className="btn btn-primary" 
              style={{ marginTop: '20px' }}
              onClick={() => setShowChat(true)}
            >
              Start Chat
            </button>
          </div>

          
          <div className="feature-card">
            <div className="feature-icon">🤟</div>
            <h3>Sign Language Translator</h3>
            <p>
              AI-powered sign language recognition and translation. Convert signs to text 
              and vice versa for seamless communication.
            </p>
            <button 
              className="btn btn-primary" 
              style={{ marginTop: '20px' }}
              onClick={() => setShowVideo(true)}
            >
              Open Translator
            </button>
          </div>


          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Learning Resources</h3>
            <p>
              Access tutorials, guides, and resources for sign language learning. 
              Improve your communication skills at your own pace.
            </p>
            <button 
              className="btn btn-primary" 
              style={{ marginTop: '20px' }}
              onClick={() => alert('Learning Resources feature coming soon!')}
            >
              Explore Resources
            </button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚙️</div>
            <h3>Accessibility Settings</h3>
            <p>
              Customize your experience with accessibility options. Adjust text size, 
              colors, and other settings to suit your needs.
            </p>
            <button 
              className="btn btn-primary" 
              style={{ marginTop: '20px' }}
              onClick={() => alert('Accessibility Settings feature coming soon!')}
            >
              Open Settings
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ 
          background: 'white', 
          borderRadius: '15px', 
          padding: '30px', 
          marginTop: '30px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#333', marginBottom: '20px' }}>Community Statistics</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px' 
          }}>
            <div>
              <h4 style={{ color: '#667eea', fontSize: '2rem', margin: '0' }}>1,247</h4>
              <p style={{ color: '#666' }}>Active Users</p>
            </div>
            <div>
              <h4 style={{ color: '#667eea', fontSize: '2rem', margin: '0' }}>156</h4>
              <p style={{ color: '#666' }}>Online Now</p>
            </div>
            <div>
              <h4 style={{ color: '#667eea', fontSize: '2rem', margin: '0' }}>89</h4>
              <p style={{ color: '#666' }}>Groups</p>
            </div>
            <div>
              <h4 style={{ color: '#667eea', fontSize: '2rem', margin: '0' }}>2.3K</h4>
              <p style={{ color: '#666' }}>Messages Today</p>
            </div>
          </div>
        </div>

        {/* Chat Modal */}
        {showChat && (
          <div className="modal-overlay">
            <div className="modal chat-modal">
              <button className="modal-close" onClick={() => setShowChat(false)}>&times;</button>
              <h2>Text Chat</h2>
              <div className="chat-messages">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={msg.sender === user.name ? 'chat-msg self' : 'chat-msg'}>
                    <b>{msg.sender}:</b> {msg.text}
                  </div>
                ))}
              </div>
              <form className="chat-input-row" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  autoFocus
                />
                <button type="submit" className="btn btn-primary">Send</button>
              </form>
            </div>
          </div>
        )}

        {/* Video/Sign Modal */}
        {showVideo && (
          <div className="modal-overlay">
            <div className="modal video-modal">
              <button className="modal-close" onClick={() => { setShowVideo(false); setDetectedSign(''); }}>&times;</button>
              <h2>Video Communication & Sign Detection</h2>
              <div className="video-sign-flex">
                <div className="video-section">
                  <video ref={videoRef} autoPlay playsInline width="320" height="240" style={{ borderRadius: '10px', background: '#222' }} />
                  <button className="btn btn-primary" style={{ marginTop: '15px' }} onClick={detectRandomSign}>
                    Detect Sign
                  </button>
                </div>
                <div className="sign-section">
                  <h3>Detected Sign</h3>
                  <div className="detected-sign-box">
                    {detectedSign ? detectedSign : <span style={{ color: '#aaa' }}>No sign detected yet.</span>}
                  </div>
                  <div style={{ marginTop: '20px', color: '#666', fontSize: '0.95rem' }}>
                    <b>Try making a sign in front of your webcam and click "Detect Sign"!</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Home; 