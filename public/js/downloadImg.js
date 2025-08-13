const downloadBtn = document.getElementById("downloadBtn");

downloadBtn.addEventListener("click", function(e){
    if(e.target && e.target.id === "downloadBtn"){
        const invId = e.target.getAttribute("data-id");
        window.location.href = `/inv/download-image/${invId}`
    }
})