const loginForm = document.getElementById("loginForm");
const userInfo = document.getElementById("userInfo");
const logoutBtn = document.getElementById("logoutBtn");

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

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;

    try {
        const res = await fetch(`${HOST_URL}/api/auth/login`, {
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

checkToken();
