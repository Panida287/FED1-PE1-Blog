document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');
    const form = document.getElementById('form');
    const messageDiv = document.getElementById('message');
    const overlay = document.querySelector('.overlay');
    const successfulMessage = document.querySelector('.successful');
    const goToLoginButton = document.getElementById('go-to-login');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission
        console.log('Form submit event triggered');

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
            console.log('Passwords do not match');
            return;
        }

        // Check if email is in the correct format
        const emailPattern = /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/;
        if (!emailPattern.test(email)) {
            messageDiv.textContent = 'Email must be @stud.noroff.no';
            console.log('Email format is incorrect');
            return;
        }

        // Construct JSON payload
        const payload = {
            name: username,
            email: email,
            password: password,
        };

        // Conditionally add optional fields
        if (bio) {
            payload.bio = bio;
        }

        if (avatar) {
            payload.avatar = {
                url: avatar,
                alt: ''
            };
        }

        console.log('Payload:', payload);

        fetch('https://v2.api.noroff.dev/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
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
                // Handle successful registration
                console.log('Registration successful:', data);

                // Show overlay and successful message
                overlay.style.display = 'block';
                successfulMessage.style.display = 'flex';
            })
            .catch(error => {
                // Handle registration error
                console.error('Registration error:', error.message);
                messageDiv.textContent = `Registration failed: ${error.message}`;
            });
    });

    // Handle click on "Go to Login" button
    goToLoginButton.addEventListener('click', function () {
        window.location.href = 'login.html';
    });
});
