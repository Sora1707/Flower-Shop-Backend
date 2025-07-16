console.log("Client script loaded");
const HOST_URL = "http://localhost:8080/";
const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODc0Yjc3Y2Y3NTU2ZDAzOTkzNWJkNmIiLCJpYXQiOjE3NTI2NTQzNjEsImV4cCI6MTc1MjY1Nzk2MX0.4kXYIBRex41r_Cig3NiTraxYyUeRQprp6Yfh1CsUxfU";

// const token =
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODc0Yjc3Y2Y3NTU2ZDAzOTkzNWJkNmMiLCJpYXQiOjE3NTI2NTY5MjIsImV4cCI6MTc1MjY2MDUyMn0.IlUeTDe4q0x60VfzBWT3jplmbSe0Jsu45GesVA9xHlM";

async function uploadAvatar() {
    const fileInput = document.getElementById("avatarInput");
    const file = fileInput.files[0];
    console.log("Selected file:", file);
    if (!file) return alert("Please select a file.");

    const formData = new FormData();
    formData.append("avatar", file);

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
        const res = await fetch("http://localhost:8080/api/user/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error("Failed to fetch user info");
        const userInfo = await res.json();

        const avatarPreview = document.getElementById("avatarPreview");
        avatarPreview.src = HOST_URL + userInfo.avatar || "";
        avatarPreview.style.display = userInfo.avatar !== HOST_URL ? "block" : "none";

        const userIdElement = document.getElementById("user-id");
        userIdElement.innerText = `User ID: ${userInfo._id}`;

        const usernameElement = document.getElementById("username");
        usernameElement.innerText = `Username: ${userInfo.username}`;

        // avatarPreview.style.display = userInfo.imagePath ? "block" : "none";
    } catch (err) {
        console.error("Error fetching user info:", err);
        document.getElementById("response").innerText = "Error fetching user info.";
    }
}
