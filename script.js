// HEADER scroll
window.addEventListener("scroll", function() {
    let header = document.getElementById("header");

    if (window.scrollY > 50) {
        header.classList.add("shrink");
    } else {
        header.classList.remove("shrink");
    }
});

// ANIMATION SECTIONS
const sections = document.querySelectorAll(".section");

function checkScroll() {
    const triggerBottom = window.innerHeight * 0.8;

    sections.forEach(section => {
        const boxTop = section.getBoundingClientRect().top;

        if (boxTop < triggerBottom) {
            section.classList.add("visible");
        }
    });
}

window.addEventListener("scroll", checkScroll);
window.addEventListener("load", checkScroll);