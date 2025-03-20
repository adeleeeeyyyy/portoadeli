var swiper = new Swiper(".swiper-license", {
    slidesPerView: 3,  // Pastikan tidak melebihi batas
    spaceBetween: 20,    // Jarak antar slide
    loop: true,          // Loop infinite
    grabCursor: true,    // Cursor tangan untuk drag
    freeMode: false,     // Hindari scroll bebas
    centeredSlides: true, // Selalu di tengah
    // autoplay: {
    //     delay: 0, // Geser otomatis tiap 3 detik
    //     disableOnInteraction: false, // Tetap autoplay meski user interaksi
    // },
    speed: 3000, // Kecepatan transisi
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        768: {
            slidesPerView: 1.5, // Tablet
        },
        1024: {
            slidesPerView: 2.2, // Desktop
        }
    }
  });

  var swiper = new Swiper(".swiper", {
    slidesPerView: 1.2,  // Pastikan tidak melebihi batas
    spaceBetween: 20,    // Jarak antar slide
    loop: true,          // Loop infinite
    grabCursor: true,    // Cursor tangan untuk drag
    freeMode: false,     // Hindari scroll bebas
    centeredSlides: true, // Selalu di tengah
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        768: {
            slidesPerView: 1.5, // Tablet
        },
        1024: {
            slidesPerView: 2.2, // Desktop
        }
    }
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    AOS.init({
        duration: 800, // Durasi animasi
        easing: "ease-in-out",
        once: false, // Agar animasi bisa terjadi berulang
    });

    const modal = document.getElementById("about");
    const openModal = document.getElementById("showAbout");
    const closeModal = document.getElementById("closeAbout");
    const personalInfo = document.getElementById("personal-info");

    openModal.addEventListener("click", () => {
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
        
        setTimeout(() => {
            modal.classList.remove("translate-y-full");

            setTimeout(() => {
                AOS.refreshHard();
                console.log("AOS refreshed");
            }, 50);
        }, 50);
    });

    closeModal.addEventListener("click", () => {
        modal.classList.add("translate-y-full");

        setTimeout(() => {
            modal.classList.add("hidden");
        }, 700);
    });

    

    // FIX 2: Perbaiki IntersectionObserver agar tidak bentrok dengan AOS
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("opacity-100");
                entry.target.classList.remove("opacity-0");
            } else {
                entry.target.classList.remove("opacity-100");
                entry.target.classList.add("opacity-0");
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll(".observer-item").forEach((el) => observer.observe(el));

    // FIX 3: Pastikan Lenis tidak mengganggu AOS
    const lenis = new Lenis();

    function raf(time) {
        lenis.raf(time * 0.5);
        requestAnimationFrame(raf);
        AOS.refresh(); // Paksa AOS membaca ulang elemen setelah smooth scroll
    }

    requestAnimationFrame(raf);
});
