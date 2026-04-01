// On écoute le scroll de la page
window.addEventListener("scroll", function() {

    // On récupère le header
    let header = document.getElementById("header");

    // Si on a scrollé de plus de 50px
    if (window.scrollY > 50) {
        
        // On ajoute la classe "shrink"
        header.classList.add("shrink");

    } else {
        
        // Sinon on enlève la classe
        header.classList.remove("shrink");
    }
});