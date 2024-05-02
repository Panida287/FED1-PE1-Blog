const userData = JSON.parse(localStorage.getItem('userData'));

const accessToken = userData.data.accessToken;
const apiUrl = "https://v2.api.noroff.dev/blog/posts/panpae";
const formData = document.getElementById('blogPostForm');

formData.addEventListener('submit', function(event) {
    event.preventDefault();

    const titleData = document.getElementById('title').value;
    const bodyData = document.getElementById('body').value;
    const tagsData = document.getElementById('tags').value;
    const imageData = document.getElementById('imageUrl').value;

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
        }
    }

    fetch(apiUrl, {
        method: "POST",
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
            // Optionally, you can perform any further actions here upon successful posting
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

