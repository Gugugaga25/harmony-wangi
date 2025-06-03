// Di dalam file parfum-mobil.js

// Pastikan skrip ini berjalan setelah DOM sepenuhnya dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Dapatkan elemen kontainer untuk daftar aroma
    const aromaGrid = document.getElementById('aromaGrid');

    // jsonSource didefinisikan secara global dari tag <script> di file HTML (parfum-mobil.html)
    // Periksa apakah variabel jsonSource sudah terdefinisi
    if (typeof jsonSource === 'undefined') {
        console.error('Kesalahan: Variabel global jsonSource tidak terdefinisi. Pastikan ada tag <script> di HTML yang mendefinisikannya, contoh: <script>const jsonSource = "parfum-mobil.json";</script>');
        if (aromaGrid) {
            aromaGrid.innerHTML = '<p style="color: red; text-align: center;">Kesalahan konfigurasi: Sumber data JSON tidak ditemukan.</p>';
        }
        return; // Hentikan eksekusi jika jsonSource tidak ada
    }

    // Periksa apakah elemen aromaGrid ada di HTML
    if (!aromaGrid) {
        console.error("Kesalahan: Elemen dengan ID 'aromaGrid' tidak ditemukan dalam dokumen HTML.");
        return; // Hentikan eksekusi jika kontainer aroma tidak ditemukan
    }

    // Ambil data dari file JSON yang ditentukan
    fetch(jsonSource)
        .then(response => {
            // Periksa apakah respons dari server OK (status 200-299)
            if (!response.ok) {
                // Jika tidak OK, lempar error dengan status respons
                throw new Error(`Gagal mengambil data dari ${jsonSource}. Status: ${response.status} ${response.statusText}`);
            }
            // Ubah respons menjadi format JSON
            return response.json();
        })
        .then(data => {
            // Periksa apakah data ada, memiliki properti aromaVariants, dan aromaVariants adalah sebuah array
            if (data && data.aromaVariants && Array.isArray(data.aromaVariants)) {
                aromaGrid.innerHTML = ''; // Kosongkan kontainer sebelum menambahkan elemen baru

                // Periksa apakah ada varian aroma
                if (data.aromaVariants.length === 0) {
                    aromaGrid.innerHTML = '<p style="text-align: center;">Tidak ada varian aroma yang tersedia saat ini.</p>';
                    return;
                }

                // Buat elemen untuk kolom kiri
                const leftColumn = document.createElement('div');
                leftColumn.className = 'aroma-list'; // Tambahkan kelas CSS untuk styling
                const leftList = document.createElement('ul'); // Buat unordered list

                // Buat elemen untuk kolom kanan
                const rightColumn = document.createElement('div');
                rightColumn.className = 'aroma-list'; // Tambahkan kelas CSS untuk styling
                const rightList = document.createElement('ul'); // Buat unordered list

                // Iterasi melalui setiap pasangan aroma dalam data.aromaVariants
                data.aromaVariants.forEach(pair => {
                    // Tambahkan item ke kolom kiri jika ada
                    if (pair && pair[0]) { // Periksa apakah pair ada dan pair[0] (item pertama) ada
                        const leftItem = document.createElement('li');
                        leftItem.textContent = pair[0];
                        leftList.appendChild(leftItem);
                    }

                    // Tambahkan item ke kolom kanan jika ada
                    if (pair && pair[1]) { // Periksa apakah pair ada dan pair[1] (item kedua) ada
                        const rightItem = document.createElement('li');
                        rightItem.textContent = pair[1];
                        rightList.appendChild(rightItem);
                    }
                });

                // Tambahkan list kiri ke kolom kiri, lalu kolom kiri ke aromaGrid
                if (leftList.hasChildNodes()) {
                    leftColumn.appendChild(leftList);
                    aromaGrid.appendChild(leftColumn);
                }

                // Tambahkan list kanan ke kolom kanan, lalu kolom kanan ke aromaGrid
                // Hanya tambahkan kolom kanan jika memiliki isi
                if (rightList.hasChildNodes()) {
                    rightColumn.appendChild(rightList);
                    aromaGrid.appendChild(rightColumn);
                }
                
                // Jika kedua list kosong setelah iterasi (misalnya semua pair dalam JSON kosong atau formatnya salah)
                if (!leftList.hasChildNodes() && !rightList.hasChildNodes() && data.aromaVariants.length > 0) {
                     aromaGrid.innerHTML = '<p style="text-align: center;">Tidak ada varian aroma yang valid untuk ditampilkan dari data yang ada.</p>';
                }


            } else {
                // Jika format data JSON tidak sesuai
                console.error("Format data JSON tidak sesuai. Properti 'aromaVariants' tidak ditemukan atau bukan sebuah array.", data);
                aromaGrid.innerHTML = '<p style="color: red; text-align: center;">Format data aroma tidak sesuai.</p>';
            }
        })
        .catch(error => {
            // Tangani error yang mungkin terjadi selama proses fetch atau pemrosesan data
            console.error('Terjadi kesalahan saat mengambil atau memproses data JSON:', error);
            aromaGrid.innerHTML = `<p style="color: red; text-align: center;">Gagal memuat varian aroma. ${error.message}</p>`;
        });
});
