const userData = JSON.parse(localStorage.getItem('userData'));

// Define constants for each property
const name = userData.data.name;
const email = userData.data.email;
const avatarUrl = userData.data.avatar.url;
const avatarAlt = userData.data.avatar.alt;
const bannerUrl = userData.data.banner.url;
const bannerAlt = userData.data.banner.alt;
const accessToken = userData.data.accessToken;

const formData = document.getElementById('blogPostForm');
const apiUrl = "https://v2.api.noroff.dev/blog/posts/panpae";

formData.addEventListener('submit', function(event) {
    event.preventDefault();
})

const titleData =document.getElementById('title').value;
const bodyData =document.getElementById('body').value;
const tagsData =document.getElementById('tags').value;
const imageData =document.getElementById('imageUrl').value;

const postData = {
    title: titleData
};

if (bodyData.trim() !== "") {
    postData.body = bodyData;
}

if (tagsData.trim() !== "") {
    postData.tags = [tagData];
}

if (isValidUrl(imageData)) {
    postData.media = {
        url: imageData
    };
}

fetch("https://v2.api.noroff.dev/blog/posts/panpae", {
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
})

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}
