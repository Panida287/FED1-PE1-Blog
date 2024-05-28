import { checkIfLoggedIn } from './functions.js';

checkIfLoggedIn();

document.addEventListener('DOMContentLoaded', () => {
   fetch(`${blogUrl}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                const post = data.data;
                document.getElementById('title').value = post.title;
                document.getElementById('body').value = post.body;
                document.getElementById('tags').value = post.tags;
                document.getElementById('imageUrl').value = post.media.url;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                const errorElement = document.createElement('div');
                errorElement.textContent = error.message;
                document.body.appendChild(errorElement);
            });
    document.getElementById('blog-post-form').addEventListener('submit')
});

document.getElementById('preview-btn').addEventListener('click', (event) => {
    event.preventDefault();
    const overlay = document.getElementById('overlay');
    const previewContent = document.getElementById('preview');

    document.getElementById('preview-title').textContent = document.getElementById('title').value;
    document.getElementById('preview-body').textContent = document.getElementById('body').value;
    const imageData = document.getElementById('imageUrl').value;
    const previewImage = document.getElementById('preview-img');
    previewImage.style.backgroundImage = `url(${imageData})`;
    previewImage.style.backgroundRepeat = 'no-repeat';
    previewImage.style.backgroundSize = 'cover';
    previewImage.style.backgroundPosition = 'center';

    overlay.style.display = 'flex';
    previewContent.style.display = 'flex';

    document.getElementById('preview-close-btn').addEventListener('click', () => {
        previewContent.style.display = 'none';
        overlay.style.display = 'none';
    });
});
