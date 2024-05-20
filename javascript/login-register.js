document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const isLogin = form.id === 'login-form';

        const payload = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        if (!isLogin) {
            payload.name = document.getElementById('username').value;
            payload.bio = document.getElementById('bio').value || '';
            payload.avatar = { url: document.getElementById('avatar').value || '', alt: '' };
        }

        fetch(`https://v2.api.noroff.dev/auth/${isLogin ? 'login' : 'register'}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (!response.ok) throw new Error(`${isLogin ? 'Login' : 'Registration'} failed`);
                return response.json();
            })
            .then(data => {
                if (isLogin) {
                    localStorage.setItem('userData', JSON.stringify(data));
                    localStorage.setItem('accessToken', data.data.accessToken);
                    window.location.href = 'admin.html';
                } else {
                    document.querySelector('.overlay').style.display = 'block';
                    document.querySelector('.successful').style.display = 'flex';
                }
            })
            .catch(error => {
                messageDiv.textContent = error.message;
                console.error(`${isLogin ? 'Login' : 'Registration'} error:`, error.message);
            });
    });

    if (document.getElementById('go-to-login')) {
        document.getElementById('go-to-login').addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
});
