export const handleLogin = async (username, password, setErr, navigate) => {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: username, password: password })
    };
  
    try {
      const response = await fetch('https://auth.chathub.kontra.tel/login', options);
      if (response.ok) {
        const data = await response.json();
        console.log("OK");
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('username', username);
        navigate('/main');
      } else {
        console.error("Server responded with status:", response.status);
        setErr(true);
      }
    } catch (err) {
      console.error(err);
    }
  };