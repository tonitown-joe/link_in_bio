# ⚡ @nt_town — Interactive Bento Link-in-Bio & Audio Cockpit

Website portofolio interaktif *Link-in-Bio* dengan tata letak *Full-Screen Bento Grid*, estetika *Glassmorphism*, dan generator audio prosedural berbasis Web Audio API murni tanpa ketergantungan pustaka eksternal (*zero external dependencies*).

---

## ✨ Fitur Utama

* **Full-Screen Cockpit Layout**: Tata letak layar penuh adaptif ($100\text{vw} \times 100\text{dvh}$) dengan panel profil *sticky* di sebelah kiri dan *interactive canvas* di sebelah kanan.
* **Procedural Lo-Fi Synthesizer & 4-Slider Mixer**:
  * **Synth Engine**: Progresi akord piano elektrik Lo-Fi (*Cmaj7, Am7, Dm7, G7*) berbasis osilator segitiga dan *envelope* ADSR.
  * **Master Volume**: Pengendali tingkat suara utama menuju output audio.
  * **Rain Ambience**: Generator derau hujan prosedural menggunakan aproksimasi *pink noise*.
  * **Vinyl Crackle**: Generator simulasi derau piringan hitam klasik dan letupan acak (*sporadic pop impulse*).
  * **Filter Cutoff (Low-Pass)**: Modulasi frekuensi *BiquadFilter* ($300\text{ Hz} - 3000\text{ Hz}$) untuk karakter suara hangat (*muffled*).
* **12-Project Bento Showcase**: Galeri proyek 3 kolom $\times$ 4 baris dengan bilah *scroll* internal, kartu ber-header terpadu, dan efek pembesaran saat kursor diarahkan (*hover zoom*).
* **Dual Theme Engine**: Mode Gelap dan Terang (*Dark/Light mode*) tersinkronisasi dengan preferensi sistem serta tersimpan di `localStorage`.
* **Telemetry & Analytics Mode**: Pelacakan analitik klik tautan berbasis `localStorage` yang dapat diakses melalui parameter URL `?analytics=true`.
* **Micro-interactions**: Efek kemiringan 3D (*3D Tilt Parallax*), animasi gelombang klik (*ripple wave*), dan umpan balik salin kontak via *Toast Notification*.

---

## 🛠️ Tech Stack

* **Markup**: HTML5 Semantik (dukungan Open Graph & Twitter Cards SEO)
* **Styling**: CSS3 Murni (CSS Grid, Flexbox, Custom Properties, Glassmorphism Backdrop-Filter)
* **Scripting**: Vanilla JavaScript (ES6+, Web Audio API, Clipboard API, DOM Telemetry)

---

## 📂 Struktur Direktori

```text
├── index.html          # Halaman utama & markup semantik
├── css/
│   └── style.css       # Token variabel, layout bento, dan animasi
├── js/
│   └── script.js       # Audio engine synthesizer, telemetri, dan interaksi UI
├── assets/
│   ├── avatar-3d.jpg   # Foto profil avatar karakter 3D
│   └── images/         # Banner Open Graph dan favicon
└── README.md           # Dokumentasi repositori