console.log("Client script loaded");

async function uploadAvatar() {
    const fileInput = document.getElementById("avatarInput");
    const file = fileInput.files[0];
    console.log("Selected file:", file);
    if (!file) return alert("Please select a file.");

    const formData = new FormData();
    formData.append("avatar", file);

    try {
        const res = await fetch("http://localhost:8080/api/upload/avatar", {
            method: "POST",
            body: formData,
        });

        const result = await res.json();
        document.getElementById("response").innerText = "Uploaded to: " + result.imagePath;
    } catch (err) {
        console.error("Upload failed:", err);
        document.getElementById("response").innerText = "Upload failed.";
    }
}
