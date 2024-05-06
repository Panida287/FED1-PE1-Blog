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
                const titleData = document.getElementById('title').value;
                const bodyData = document.getElementById('body').value;
                const tagsData = document.getElementById('tags').value;
                const imageData = document.getElementById('imageUrl').value;

                titleData.value = selectedPost.title;
                bodyData.value = selectedPost.body;
                tagsData.value = selectedPost.tags;
                imageData.value = selectedPost.imageUrl;
            }
        })
}