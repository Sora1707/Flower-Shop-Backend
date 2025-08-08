console.log("Client script loaded");
const HOST_URL = "http://localhost:8080";

function getToken() {
    return localStorage.getItem("token");
}

function setToken(token) {
    localStorage.setItem("token", token);
}
