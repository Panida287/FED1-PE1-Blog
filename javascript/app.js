import {
    setupFormHandlers,
    initializeAdminPanel,
    setupBackToAdminButton,
    editPostForm,
    setupAdminPage,
    handleFormSubmission,
    setupNewPostButton,
    login,
    register,
    seeMore,
    displayPostDetails,
    displayHighlightContents,
    displayRelatedPostsSection,
    setupBrowsePage
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

    switch (cleanedPathname) {
        case '':
        case 'index.html':
            setupCarousel();
            displayHighlightContents();
            seeMore();
            break;
        case 'edit-post.html':
            setupFormHandlers();
            initializeAdminPanel();
            setupBackToAdminButton();
            editPostForm();
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
        case 'register.html':
            register();
    }
}

window.addEventListener('load', route);
window.addEventListener('popstate', route);
