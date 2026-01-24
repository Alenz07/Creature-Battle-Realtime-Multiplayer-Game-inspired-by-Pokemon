// ============ AUTH ============
async function register() {
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value;
  
    if (!username || !password) {
      document.getElementById('loginMessage').textContent = 'Please fill all fields';
      return;
    }
  
    try {
      const res = await axios.post(`${API_URL}/register`, {
        username,
        password
      });
  
      const data = res.data; 
      currentUser = data.user;
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      document.getElementById('loginMessage').style.color = 'var(--success)';
      document.getElementById('loginMessage').textContent = data.message;
      setTimeout(() => {
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('gameScreen').classList.add('active');
  
        socket.emit('user:online', currentUser.id);
        initGame();
      }, 1000);
  
    } catch (error) {
      // Axios errors come here for 400/401/500
      document.getElementById('loginMessage').style.color = 'var(--danger)';
      document.getElementById('loginMessage').textContent =
        error.response?.data?.error || 'Connection error';
    }
  }
  
  async function login() {
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value;
  
    if (!username || !password) {
      document.getElementById('loginMessage').textContent = 'Please fill all fields';
      return;
    }
  
    try {
      const res = await axios.post(`${API_URL}/login`, {
        username,
        password
      });
  
      const data = res.data; 
  
      
      currentUser = data.user;
  
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
  
      document.getElementById('loginMessage').style.color = 'var(--success)';
      document.getElementById('loginMessage').textContent = data.message;
  
      setTimeout(() => {
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('gameScreen').classList.add('active');
  
        socket.emit('user:online', currentUser.id);
        initGame();
      }, 1000);
  
    } catch (error) {
   
      document.getElementById('loginMessage').style.color = 'var(--danger)';
      document.getElementById('loginMessage').textContent =
        error.response?.data?.error || 'Connection error';
    }
  }
  async function logout() {
    if (!confirm('Are you sure you want to logout?')) return;
  
    try {
      await axios.post(`${API_URL}/logout`, {
        userId: currentUser.id
      });
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      location.reload();
    }
  }
  

// Enter key for login
document.getElementById('passwordInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
});
