const avatarInput = document.getElementById("avatarInput");
const preview = document.getElementById("preview");
const cropBtn = document.getElementById("cropBtn");

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
        const res = await fetch("http://localhost:8080/api/user/avatar", {
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

avatarInput.addEventListener("change", (e) => {
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

    cropper.getCroppedCanvas({ width: 512, height: 512 }).toBlob(async (blob) => {
        const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });

        const formData = new FormData();
        formData.append("avatar", file);

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8080/api/user/avatar", {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await res.json();
    }, "image/png");
});
