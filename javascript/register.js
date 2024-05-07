document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    const messageDiv = document.getElementById('message');
    const overlay = document.querySelector('.overlay');
    const successfulMessage = document.querySelector('.successful');
    const goToLoginButton = document.getElementById('go-to-login');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        // Retrieve form data
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const repeatPassword = document.getElementById('repeat-password').value;
        const avatar = document.getElementById('avatar').value;
        const bio = document.getElementById('bio').value;

        // Check if passwords match
        if (password !== repeatPassword) {
            messageDiv.textContent = 'Passwords do not match';
            return;
        }

        // Construct JSON payload
        const payload = {
            name: username,
            email: email,
            password: password,
            bio: bio || '',
            avatar: {
                url: avatar || '',
                alt: ''
            },
        };


        // Make POST request
        fetch('https://v2.api.noroff.dev/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to register');
                }
                return response.json();
            })
            .then(data => {
                // Handle successful registration
                console.log('Registration successful:', data);

                // Show overlay and successful message
                overlay.style.display = 'block';
                successfulMessage.style.display = 'flex';
            })
            .catch(error => {
                // Handle registration error
                console.error('Registration error:', error.message);
                messageDiv.textContent = 'Registration failed';
            });
    });

    // Handle click on "Go to Login" button
    goToLoginButton.addEventListener('click', function () {
        window.location.href = 'login.html'; // Navigate to login.html
    });
});
