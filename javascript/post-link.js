const avatarImage = document.querySelector('.avatar-img');
const authorName = document.querySelector('.author-name');
const authorBio = document.querySelector('.bio');
const title = document.querySelector('.title');
const recipeTitle = document.querySelector('.recipe-title');
const image = document.querySelector('.content-img');
const recipeImage = document.querySelector('.recipe-img');
const dateAndTime = document.querySelector('.date-time');
const body = document.querySelector('.content-body');

function getQueryParamValue(parameter) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameter);
}

const postId = getQueryParamValue('id');
const blog = "https://v2.api.noroff.dev/blog/posts/";

if (postId) {
    fetch(`${blog}panpae/${postId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const selectedPost = data.data;
            console.log(selectedPost);

            if (selectedPost) {
                title.textContent = selectedPost.title;
                recipeTitle.textContent = selectedPost.title;

                dateAndTime.textContent = formatDateTime(selectedPost.created);

                image.classList.add('content-image');
                image.style.backgroundImage = `url(${selectedPost.media.url})`;
                image.style.backgroundRepeat = 'no-repeat';
                image.style.backgroundSize = 'cover';
                image.style.backgroundPosition = 'center';

                recipeImage.style.backgroundImage = `url(${selectedPost.media.url})`;
                recipeImage.classList.add('recipe-image');
                recipeImage.style.backgroundRepeat = 'no-repeat';
                recipeImage.style.backgroundSize = 'cover';
                recipeImage.style.backgroundPosition = 'center';

                body.textContent = selectedPost.body;

                if (avatarImage) {
                    avatarImage.style.backgroundImage = `url(${selectedPost.author.avatar.url})`;
                    avatarImage.style.backgroundRepeat = 'no-repeat';
                    avatarImage.style.backgroundSize = 'cover';
                    avatarImage.style.backgroundPosition = 'center';
                } else {
                    console.error('Avatar image element not found');
                }

                if (authorName) {
                    authorName.textContent = selectedPost.author.name;
                } else {
                    console.error('Author name element not found');
                }

                if (authorBio) {
                    authorBio.textContent = selectedPost.author.bio;
                } else {
                    console.error('Author bio element not found');
                }
            } else {
                console.error('Selected post not found');
            }
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error.message);
            const errorElement = document.createElement('div');
            errorElement.classList.add('error fetching data');
            errorElement.textContent = error.message;
        });

    function formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleString(); // Convert date to local date and time format
    }
}
