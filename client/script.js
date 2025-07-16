console.log("Client script loaded");
const HOST_URL = "http://localhost:8080";

const loginForm = document.getElementById("loginForm");
const userInfo = document.getElementById("userInfo");

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

        const avatarPreview = document.getElementById("avatarPreview");
        avatarPreview.src = HOST_URL + "/" + userInfo.avatar || "";

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

checkToken();
