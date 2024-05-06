const userData = JSON.parse(localStorage.getItem("userData"));
const avatar = document.getElementById("admin-avatar");
const username = document.getElementById("admin-username");
const logoutBtn = document.getElementById("logout-btn");
const logoutConfirm = document.getElementById("logout-confirm");
const logoutAbort = document.getElementById("logout-abort");
const logoutBox = document.getElementById("logout-box");
const overlay = document.getElementById('overlay');


avatar.style.backgroundImage = `url(${userData.data.avatar.url})`;
avatar.style.backgroundPosition = 'center';
avatar.style.backgroundRepeat = 'no-repeat';
avatar.style.backgroundSize = 'cover';

username.textContent = userData.data.name;

logoutBtn.addEventListener('click', function() {
    logoutBox.style.display = 'flex';
    overlay.style.display = 'flex';
})

logoutConfirm.addEventListener("click", function(){
    localStorage.removeItem("userData");
    localStorage.removeItem("accessToken");
    window.location.href = 'login.html';
})

logoutAbort.addEventListener('click', function() {
    logoutBox.style.display = 'none';
    overlay.style.display = 'none';
})

