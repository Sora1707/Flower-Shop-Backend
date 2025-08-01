console.log("Client script loaded");
const HOST_URL = "http://localhost:8080";

const loginForm = document.getElementById("loginForm");
const userInfo = document.getElementById("userInfo");
const avatarInput = document.getElementById("avatarInput");
const preview = document.getElementById("preview");
const cropBtn = document.getElementById("cropBtn");
const logoutBtn = document.getElementById("logoutBtn");

let cropper = null;

async function uploadAvatar() {
    const fileInput = document.getElementById("avatarInput");
    const file = fileInput.files[0];
    console.log("Selected file:", file);
    if (!file) return alert("Please select a file.");

    const formData = new FormData();
    formData.append("avatar", file);

    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:8080/api/user/me", {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const result = await res.json();
        document.getElementById("response").innerText = "Uploaded to: " + result.imagePath;
    } catch (err) {
        console.error("Upload failed:", err);
        document.getElementById("response").innerText = "Upload failed.";
    }
}

async function getUserInfo() {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/user/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error("Failed to fetch user info");
        const userInfo = (await res.json()).data.user;

        console.log(userInfo);

        const avatar = document.getElementById("avatar");
        avatar.src = HOST_URL + "/" + userInfo.avatar.medium || "";

        const userIdElement = document.getElementById("userid");
        userIdElement.innerText = `User ID: ${userInfo._id}`;

        const usernameElement = document.getElementById("username");
        usernameElement.innerText = `Username: ${userInfo.username}`;

        const fullnameElement = document.getElementById("fullname");
        fullnameElement.innerText = `Full Name: ${userInfo.firstName} ${userInfo.lastName}`;
    } catch (err) {
        console.error("Error fetching user info:", err);
        document.getElementById("response").innerText = "Error fetching user info.";
    }
}

function login() {
    loginForm.classList.add("invisible");
    userInfo.classList.remove("invisible");
    getUserInfo();
}

function logout() {
    loginForm.classList.remove("invisible");
    userInfo.classList.add("invisible");
    localStorage.removeItem("token");
}

async function checkToken() {
    const token = localStorage.getItem("token");

    if (!token) {
        logout();
        alert("Please log in to continue.");
        return;
    }
    const res = await fetch("http://localhost:8080/api/user/me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.status === 200) {
        login();
    } else {
        logout();
        alert("Token expired. Please log in.");
    }
}

loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;

    try {
        const res = await fetch(`${HOST_URL}/api/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (data.status === "error") {
            alert(data.message || "Login failed");
            return;
        }
        token = data.data.token;

        localStorage.setItem("token", token);
        login();
        alert("Login successful!");
    } catch (err) {
        console.error("Login error:", err);
        alert("Login failed. Please check your credentials.");
    }
});

logoutBtn.addEventListener("click", () => {
    logout();
});

avatarInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    preview.src = url;
    preview.style.display = "block";

    if (cropper) {
        cropper.destroy();
    }

    preview.onemptied = function () {
        cropBtn.disabled = true;
    };

    preview.onload = function () {
        cropper = new window.Cropper(preview, {
            aspectRatio: 1,
            viewMode: 1,
            autoCrop: true,
            autoCropArea: 1,
        });
        cropBtn.disabled = false;
    };
});

cropBtn.addEventListener("click", () => {
    if (!cropper) return;

    cropper.getCroppedCanvas({ width: 512, height: 512 }).toBlob(async blob => {
        const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });

        const formData = new FormData();
        formData.append("avatar", file);

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8080/api/user/me", {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await res.json();
    }, "image/png");
});

checkToken();
