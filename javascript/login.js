document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('https://v2.api.noroff.dev/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed. Please check your credentials.');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            // If login successful, store data in local storage
            localStorage.setItem('userData', JSON.stringify(data));
            // Redirect or perform other actions
            window.location.href = 'admin.html';
        })
        .catch(error => {
            console.error('Error:', error.message);
            // Display error message to user
            document.getElementById('message').textContent = error.message;
        });
});