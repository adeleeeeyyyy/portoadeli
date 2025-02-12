// script.js

// Simpan referensi ke semua garis bawah
let underlineElements = [];

// Fungsi untuk menghapus semua garis bawah
function clearUnderlines() {
  underlineElements.forEach((underline) => underline.remove());
  underlineElements = [];
}

// Fungsi untuk membuat garis bawah pada elemen terpilih
function createUnderline(rect) {
  const underline = document.createElement("div");
  underline.classList.add("custom-underline");
  underline.style.width = `${rect.width}px`;
  underline.style.height = "2px";
  underline.style.top = `${rect.bottom + window.scrollY}px`;
  underline.style.left = `${rect.left + window.scrollX}px`;
  document.body.appendChild(underline);

  // Animasi garis bawah
  requestAnimationFrame(() => {
    underline.style.transform = "scaleX(1)";
  });

  underlineElements.push(underline);
}

// Event untuk menangani seleksi
document.addEventListener("mousemove", () => {
  const selection = window.getSelection();
  const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  // Hapus garis bawah sebelumnya
  clearUnderlines();

  if (range && selection.toString()) {
    // Dapatkan setiap rect dari teks yang diseleksi
    const rects = range.getClientRects();

    // Tambahkan garis bawah untuk setiap rect
    for (const rect of rects) {
      createUnderline(rect);
    }
  }
});

// Event untuk menghapus garis bawah setelah seleksi selesai
document.addEventListener("mouseup", () => {
  const selection = window.getSelection();
  if (!selection.toString()) {
    clearUnderlines();
  }
});
