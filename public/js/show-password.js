
const getShowPassBtn = document.getElementById("showPass");

getShowPassBtn.addEventListener("click", () => {
    const inputPassword = document.getElementById("accountPassword");

    if (inputPassword.getAttribute("type") === "password"){
        inputPassword.setAttribute("type", "text");
    } else{
        inputPassword.setAttribute("type", "password");
    }
});