// script.js
document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    // Fungsi untuk memuat halaman baru
    async function loadPage(url) {
        // Ambil konten halaman baru
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const newPage = doc.querySelector('.page').outerHTML;

        // Animasi fade-out untuk halaman saat ini
        const currentPage = app.querySelector('.page');
        currentPage.classList.add('fade-out');

        // Tunggu animasi fade-out selesai
        currentPage.addEventListener('transitionend', () => {
            // Ganti konten halaman
            app.innerHTML = newPage;
            const newPageElement = app.querySelector('.page');
            newPageElement.classList.add('fade-in');

            // Hapus class fade-in setelah animasi selesai
            setTimeout(() => {
                newPageElement.classList.remove('fade-in');
            }, 500);
        }, { once: true });
    }

    // Tangani klik pada link
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.href) {
            e.preventDefault(); // Hentikan perilaku default link
            const url = e.target.href;
            history.pushState(null, '', url); // Perbarui URL di address bar
            loadPage(url); // Muat halaman baru
        }
    });

    // Tangani perubahan history (misal: tombol back/forward)
    window.addEventListener('popstate', () => {
        loadPage(window.location.href);
    });
});