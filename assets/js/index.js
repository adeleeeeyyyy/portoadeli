var swiper = new Swiper(".swiper-license", {
    slidesPerView: 1.2,  // Pastikan tidak melebihi batas
    spaceBetween: 20,    // Jarak antar slide
    loop: true,          // Loop infinite
    grabCursor: true,    // Cursor tangan untuk drag
    freeMode: false,     // Hindari scroll bebas
    centeredSlides: true, // Selalu di tengah
    autoplay: {
        delay: 0, // Geser otomatis tiap 3 detik
        disableOnInteraction: false, // Tetap autoplay meski user interaksi
    },
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
      duration: 800, // Durasi animasi dalam ms
      easing: "ease-in-out", // Jenis animasi
      once: true, // Animasi hanya terjadi sekali
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    AOS.init({
      duration: 500,
      easing: "ease-in-out",
      once: false, // Pastikan `once` diatur ke false agar bisa muncul & menghilang
    });
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100");
          entry.target.classList.remove("opacity-0");
        } else {
          entry.target.classList.add("opacity-0");
          entry.target.classList.remove("opacity-100");
        }
      });
    }, { threshold: 0.4 }); // 20% elemen terlihat, baru trigger
  
    document.querySelectorAll(".aos-item").forEach((el) => observer.observe(el));
  });
  
  function license(){
    window.location.href='https://www.cloudskillsboost.google/public_profiles/1a744bc0-1f9e-4bd6-83b8-f34a243393c3'
}

document.addEventListener("DOMContentLoaded", () => {
    const lenis = new Lenis();
  
    function raf(time) {
      lenis.raf(time * 0.5);
      requestAnimationFrame(raf);
    }
  
    requestAnimationFrame(raf);
  });