const userData = JSON.parse(localStorage.getItem('userData'));

// Define constants for each property
const accessToken = userData.data.accessToken;
const apiUrl = "https://v2.api.noroff.dev/blog/posts/panpae";
const formData = document.getElementById('blogPostForm');
const postsResult = document.getElementById('posts');

// Post new posts
formData.addEventListener('submit', function(event) {
    event.preventDefault();

    const titleData = document.getElementById('title').value;
    const bodyData = document.getElementById('body').value;
    const tagsData = document.getElementById('tags').value;
    const imageData = document.getElementById('imageUrl').value;
    const imageAlt = document.getElementById('imageAlt').value;

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
        if (imageAlt.trim() !== "") {
            postData.media.alt = imageAlt;
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

// Display posts
fetch(apiUrl)
    .then(res => {
        return res.json();
    })
    .then(response => {
        const posts = response.data; // Access the array of posts
        posts.forEach(post => {
            displayPost(post);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });

function displayPost(post) {
    const media = post.media || { url: '', alt: '' }; // Provide default values if media is null,
    const author = post.author || { name: '', avatar: { url: '', alt: '' }
    };
    const formattedCreatedDate = formatDateTime(post.created);
    postsResult.innerHTML += `
        <div class="post">
            <img alt="${media.alt}" src="${media.url}">
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <p>Published: ${formattedCreatedDate}</p>
            <div class="author">
                <img class="avatar" alt="${author.avatar.alt}" src="${author.avatar.url}">
                <p>${author.name}</p>
            </div>
            <div class="btn-container">
                <button type="button">Edit</button>
                <button type="button">Delete</button>
            </div>
        </div>`;
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

// change date and time format

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString(); // Convert date to local date and time format
}
