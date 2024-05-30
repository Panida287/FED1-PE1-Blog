import {
    setupFormHandlers,
    initializeAdminPanel,
    setupBackToAdminButton,
    editPostForm,
    setupAdminPage,
    handleFormSubmission,
    setupNewPostButton,
    login,
    seeMore,
    displayPostDetails,
    displayBlogContents,
    displayRelatedPostsSection,
    setupBrowsePage,
} from "./functions.js";
import {
    checkIfLoggedIn,
    setupCarousel} from "./utils.js";

function getPathname() {
    const url = new URL(window.location.href);
    // Return the pathname part without the leading and trailing slashes
    return url.pathname.replace(/^\/|\/$/g, '');
}

function route() {
    const pathname = getPathname();
    // If workspace.xml appears in the pathname, remove it
    const cleanedPathname = pathname.replace('workspace.xml/', '');
    const blog = 'https://v2.api.noroff.dev/blog/posts/panpae';
    const limit = 12;

    switch (cleanedPathname) {
        case '':
        case 'index.html':
            setupCarousel();
            displayBlogContents();
            seeMore();
            break;
        case 'edit-post.html':
            setupFormHandlers();
            initializeAdminPanel();
            setupBackToAdminButton();
            editPostForm();
            break;
        case 'browse.html':
            setupBrowsePage(blog, limit);
            break;
        case 'single-post.html':
            displayPostDetails()
            displayRelatedPostsSection()
            break;
        case 'admin.html':
            setupAdminPage();
            handleFormSubmission();
            setupBackToAdminButton()
            editPostForm();
            initializeAdminPanel();
            checkIfLoggedIn();
            setupNewPostButton();
            break;
        case 'new-post.html':
            setupFormHandlers();
            initializeAdminPanel();
            setupBackToAdminButton();
            editPostForm();
            break;
        case 'login.html':
            login();
            break;
    }
}

window.addEventListener('load', route);
window.addEventListener('popstate', route);
