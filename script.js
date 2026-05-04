// =========================
// HEADER SCROLL
// =========================
const header = document.getElementById("header");

if (header) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            header.classList.add("shrink");
        } else {
            header.classList.remove("shrink");
        }
    });
}

// =========================
// GALERIE LIGHTBOX
// =========================
const images = document.querySelectorAll(".gallery-grid img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".close");
const prevBtn = document.querySelector(".prev-lightbox");
const nextBtn = document.querySelector(".next-lightbox");

let currentIndex = 0;

if (images.length > 0 && lightbox && lightboxImg) {

    images.forEach((img, index) => {
        img.addEventListener("click", () => {
            currentIndex = index;
            showImage();
            lightbox.style.display = "flex";
        });
    });

    function showImage() {
        lightboxImg.src = images[currentIndex].src;
    }

    function changeImage(direction) {

        lightboxImg.classList.add(
            direction === "next" ? "slide-out-left" : "slide-out-right"
        );

        setTimeout(() => {

            if (direction === "next") {
                currentIndex = (currentIndex + 1) % images.length;
            } else {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
            }

            lightboxImg.src = images[currentIndex].src;

            lightboxImg.classList.remove("slide-out-left", "slide-out-right");
            lightboxImg.classList.add("slide-in");

        }, 300);
    }

    if (nextBtn) nextBtn.addEventListener("click", () => changeImage("next"));
    if (prevBtn) prevBtn.addEventListener("click", () => changeImage("prev"));

    document.addEventListener("keydown", (e) => {
        if (lightbox.style.display === "flex") {
            if (e.key === "ArrowRight") changeImage("next");
            if (e.key === "ArrowLeft") changeImage("prev");
            if (e.key === "Escape") lightbox.style.display = "none";
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            lightbox.style.display = "none";
        });
    }

    lightbox.addEventListener("click", (e) => {
        if (e.target !== lightboxImg) {
            lightbox.style.display = "none";
        }
    });

    // SWIPE MOBILE
    let startX = 0;
    let endX = 0;

    lightbox.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    lightbox.addEventListener("touchend", (e) => {
        endX = e.changedTouches[0].clientX;

        const diff = startX - endX;

        if (Math.abs(diff) < 50) return;

        if (diff > 0) {
            changeImage("next");
        } else {
            changeImage("prev");
        }
    });
}

// =========================
// ANIMATION SECTIONS
// =========================
const sections = document.querySelectorAll(".section");

if (sections.length > 0) {
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
}

// =========================
// FORMULAIRE MULTI-ETAPES
// =========================
const steps = document.querySelectorAll(".form-step");

if (steps.length > 0) {

    const nextBtns = document.querySelectorAll(".next");
    const prevBtns = document.querySelectorAll(".prev");
    const progress = document.querySelector(".progress");

    let currentStep = 0;

    const mineurSection = document.getElementById("mineur-section");
    const materielSection = document.getElementById("materiel-section");
    const federauxSection = document.getElementById("federaux-section");

    // cacher au départ
    if (mineurSection) mineurSection.style.display = "none";
    if (materielSection) materielSection.style.display = "none";
    if (federauxSection) federauxSection.style.display = "none";

    function updateProgress() {
        progress.style.width = ((currentStep + 1) / steps.length) * 100 + "%";
    }

    function showStep(index) {
        steps.forEach(step => step.classList.remove("active"));
        steps[index].classList.add("active");
        updateProgress();
    }

    // NEXT
    nextBtns.forEach(btn => {
        btn.addEventListener("click", () => {

            steps[currentStep].classList.remove("active");
            currentStep++;

            while (
                steps[currentStep] &&
                steps[currentStep].style.display === "none"
            ) {
                currentStep++;
            }

            if (steps[currentStep]) {
                showStep(currentStep);
            }
        });
    });

    // PREV
    prevBtns.forEach(btn => {
        btn.addEventListener("click", () => {

            steps[currentStep].classList.remove("active");
            currentStep--;

            while (
                steps[currentStep] &&
                steps[currentStep].style.display === "none"
            ) {
                currentStep--;
            }

            if (steps[currentStep]) {
                showStep(currentStep);
            }
        });
    });

    // CONDITIONS

    const birthdate = document.getElementById("birthdate");
    if (birthdate) {
        birthdate.addEventListener("change", function () {
            const age = new Date().getFullYear() - new Date(this.value).getFullYear();

            if (mineurSection) {
                mineurSection.style.display = age < 18 ? "block" : "none";
            }
        });
    }

    const materiel = document.getElementById("materiel");
    if (materiel) {
        materiel.addEventListener("change", function () {
            if (materielSection) {
                materielSection.style.display = this.value === "oui" ? "block" : "none";
            }
        });
    }

    const federaux = document.getElementById("federaux");
    if (federaux) {
        federaux.addEventListener("change", function () {
            if (federauxSection) {
                federauxSection.style.display = this.value === "oui" ? "block" : "none";
            }
        });
    }

    showStep(currentStep);
}

let allData = [];

onSnapshot(collection(db, "inscriptions"), (snapshot) => {

    liste.innerHTML = "";
    allData = [];

    snapshot.forEach(doc => {
        const data = doc.data();
        allData.push(data);

        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <strong>${data.prenom} ${data.nom}</strong><br>
            📧 ${data.email || "—"}<br>
            📱 ${data.telephone || "—"}<br>
            🎂 ${data.dateNaissance || "—"}
        `;

        liste.appendChild(div);
    });
});


// =========================
// MENU BURGER
// =========================
/*const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

if (burger && nav) {
    burger.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
}

document.querySelectorAll("#nav a").forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("active");
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const faders = document.querySelectorAll('.fade-up');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    });

    faders.forEach(el => observer.observe(el));

});

document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !burger.contains(e.target)) {
        nav.classList.remove("active");
    }
});*/