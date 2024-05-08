const mainContents = document.querySelector('.main-contents-display');
const blog = ('https://v2.api.noroff.dev/blog/posts/panpae');
const limit = 6;
let page = 1;

// Fetch data from API
const fetchData = () => {
    fetch(`${blog}?limit=${limit}&page=${page}`)
        .then(response => response.json())
        .then(data => {
            const posts = data.data;
            const currentPage = data.meta.currentPage;
            const isFirstPage = data.meta.isFirstPage;
            const isLastPage = data.meta.isLastPage;

            const updateButtonsStages = () => {
               prevBtn.disabled = isFirstPage;
               nextBtn.disabled = isLastPage;
            }
            updateButtonsStages();

            const currentPageNumber = document.getElementById('current-page');
            currentPageNumber.innerHTML = currentPage;

            posts.forEach(post => {
                const contents = document.createElement('div');
                contents.classList.add('main-contents-container');

                mainContents.appendChild(contents);

                const tagsString = post.tags[0];
                const thumbnail = document.createElement('a');
                thumbnail.href = `single-post.html?id=${post.id}&tags=${tagsString}`;
                thumbnail.classList.add('main-contents-thumbnail');
                thumbnail.style.backgroundImage = `url(${post.media.url})`;
                thumbnail.style.backgroundRepeat = 'no-repeat';
                thumbnail.style.backgroundSize = 'cover';
                thumbnail.style.backgroundPosition = 'center';
                contents.appendChild(thumbnail);

                const overlay = document.createElement('div');
                overlay.classList.add('main-contents-overlay');
                thumbnail.appendChild(overlay);

                const contentTitle = document.createElement('h4');
                contentTitle.textContent = post.title;
                thumbnail.appendChild(contentTitle);

                const contentBody = document.createElement('p');
                const words = post.body.split(' ');

                if (words.length > 20) {
                    const truncatedText = words.slice(0, 10).join(' ');
                    contentBody.innerHTML = truncatedText + ['...<br><br>'];

                    // Create a button element
                    const readMoreButton = document.createElement('button');
                    readMoreButton.textContent = 'Read more';
                    readMoreButton.addEventListener('click', () => {
                        window.location.href = `single-post.html?id=${post.id}&tags=${tagsString}`;
                    });
                    contentBody.appendChild(readMoreButton);
                }
                contents.appendChild(contentBody);
            });
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error.message);
            const errorElement = document.createElement('div');
            errorElement.classList.add('error-fetching-data');
            errorElement.textContent = error.message;
            // Append the error message to the main contents display area
            mainContents.appendChild(errorElement);
        });
}

fetchData()

//pagination functionality
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('previous');
const nextPage = () => {
    page++; // Increment page number
    // Clear exiting content before fetching new data
    mainContents.innerHTML = '';
    fetchData();
}
const prevPage = () => {
    if (page > 1) {
        page--;
        mainContents.innerHTML ='';
        fetchData();
    }
};

nextBtn.addEventListener('click', nextPage);
prevBtn.addEventListener('click', prevPage);

