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
                const titleInput = document.getElementById('title');
                const bodyInput = document.getElementById('body');
                const tagsInput = document.getElementById('tags');
                const imageInput = document.getElementById('imageUrl');

                titleInput.value = selectedPost.title;
                bodyInput.value = selectedPost.body;
                tagsInput.value = selectedPost.tags;
                imageInput.value = selectedPost.media.url; // Corrected property name
            }
        })
        .catch(error => {
        console.error('Error fetching or processing data:', error.message);
        const errorElement = document.createElement('div');
        errorElement.classList.add('error fetching data');
        errorElement.textContent = error.message;
    });
}
