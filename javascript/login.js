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
            return response.json().then(data => {
                if (!response.ok) {
                    // Log the response status and error message
                    console.error('Failed to register:', response.status, data);

                    // Extract and display the error message
                    const errorMessage = data.errors && data.errors.length > 0
                        ? data.errors[0].message
                        : 'Failed to register';

                    throw new Error(errorMessage);
                }
                return data;
            });
        })
        .then(data => {
            console.log(data);
            // If login successful, store data in local storage
            localStorage.setItem('userData', JSON.stringify(data));
            localStorage.setItem('accessToken', data.data.accessToken);
            // Redirect or perform other actions
            window.location.href = 'admin.html';
        })
        .catch(error => {
            console.error('Error:', error.message);
            // Display error message to user
            document.getElementById('message').textContent = error.message;
        });
});