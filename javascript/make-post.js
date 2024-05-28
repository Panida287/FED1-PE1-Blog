// Function to get query parameter value
function getQueryParamValue(parameter) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameter);
}

const accessToken = localStorage.getItem('accessToken');
const apiUrl = "https://v2.api.noroff.dev/blog/posts/panpae";
const formData = document.getElementById('blog-post-form');
const previewBtn = document.getElementById('preview-btn');
const backToAdmin = document.getElementById('back-to-admin');
const postNewBtn = document.getElementById('new-post');
const editPostBtn = document.getElementById('edit-post');

backToAdmin.addEventListener('click', () => {
    window.location.href = 'admin.html';
});

// Function to handle form submission
function handleFormSubmission(method, postId = null) {
    return function(event) {
        event.preventDefault();

        const titleData = document.getElementById('title').value;
        const bodyData = document.getElementById('body').value;
        const tagsData = document.getElementById('tags').value;
        const imageData = document.getElementById('imageUrl').value;
        const postSuccess = document.getElementById('post-success');
        const overlay = document.getElementById('overlay');

        const postData = {
            title: titleData
        };

        if (bodyData.trim() !== "") {
            postData.body = bodyData;
        }
        if (tagsData.trim() !== "") {
            postData.tags = [tagsData];
        }
        if (isValidUrl(imageData)) {
            postData.media = {
                url: imageData
            };
        }

        let url = apiUrl;
        if (method === 'PUT' && postId) {
            url += `/${postId}`;
        }

        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(postData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                // Clear input fields after successful posting
                formData.reset();
            })
            .catch(error => {
                console.error('Error:', error);
            });

        postSuccess.style.display = 'flex';
        overlay.style.display = 'flex';
        const closeBtn = document.getElementById('success-close-btn');

        closeBtn.addEventListener('click', function() {
            postSuccess.style.display ='none';
            overlay.style.display ='none';
            window.location.href = 'admin.html';
        });
    };
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Attach event listeners to buttons
if (postNewBtn) {
    postNewBtn.addEventListener('click', handleFormSubmission('POST'));
}

if (editPostBtn) {
    const postId = getQueryParamValue('id'); // Retrieve postId from query params
    editPostBtn.addEventListener('click', handleFormSubmission('PUT', postId));
}

previewBtn.addEventListener('click', function(event) {
    event.preventDefault();
    const previewContent = document.getElementById('preview');
    const titleData = document.getElementById('title').value;
    const bodyData = document.getElementById('body').value;
    const imageData = document.getElementById('imageUrl').value;
    const previewTitle = document.getElementById('preview-title');
    const previewBody = document.getElementById('preview-body');
    const previewImage = document.getElementById('preview-img');
    const overlay = document.getElementById('overlay');

    previewTitle.textContent = titleData;
    previewBody.textContent = bodyData;
    previewImage.style.backgroundImage = `url(${imageData})`;
    previewImage.style.backgroundRepeat = 'no-repeat';
    previewImage.style.backgroundSize = 'cover';
    previewImage.style.backgroundPosition = 'center';

    overlay.style.display = 'flex';
    previewContent.style.display = 'flex';

    const closeBtn = document.getElementById('preview-close-btn');

    closeBtn.addEventListener('click', function() {
        previewContent.style.display = 'none';
        overlay.style.display ='none';
    });
});