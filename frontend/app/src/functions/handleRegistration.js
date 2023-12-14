export const handleRegistration = async (username, password, confirmPassword, setErr) => {
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return false;
    }

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, password: password })
    };

    try {
        const response = await fetch('https://api.chathub.kontra.tel/users/register', options);
        if (response.ok) {
            return true;
        } else {
            console.error("Server responded with status:", response.status);
            setErr(true);
            return false;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
};