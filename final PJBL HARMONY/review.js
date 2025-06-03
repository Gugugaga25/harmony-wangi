document.addEventListener('DOMContentLoaded', () => {
    const marqueeContent = document.querySelector('.marquee-content');
    const cardWidth = 350; // Lebar satu kartu review (sesuaikan dengan CSS .review-card width)
    const cardGap = 25;    // Jarak antar kartu (sesuaikan dengan CSS .marquee-content gap)

    // Fungsi untuk generate stars berdasarkan rating
    function generateStars(rating) {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    }

    // Fungsi untuk membuat HTML satu kartu review
    function createReviewCard(review) {
        return `
            <div class="review-card">
                <div class="reviewer-info">
                    <div class="avatar">${review.avatar}</div>
                    <div>
                        <div class="reviewer-name">${review.name}</div>
                        <div class="review-date">${review.date}</div>
                    </div>
                </div>
                <div class="stars">
                    <span class="star">${generateStars(review.rating)}</span>
                </div>
                <div class="review-text">${review.text}</div>
            </div>
        `;
    }

    // Fungsi untuk mengambil data dan me-render reviews
    async function fetchAndRenderReviews() {
        try {
            const response = await fetch('reviews-data.json'); // Ambil data dari file JSON
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const reviewsData = await response.json();

            if (!marqueeContent) {
                console.error('Elemen .marquee-content tidak ditemukan.');
                return;
            }
            
            if (reviewsData && reviewsData.length > 0) {
                let reviewsHTML = '';
                
                // Render original reviews
                reviewsData.forEach(review => {
                    reviewsHTML += createReviewCard(review);
                });
                
                // Render duplicate untuk seamless loop animasi marquee
                reviewsData.forEach(review => {
                    reviewsHTML += createReviewCard(review);
                });
                
                marqueeContent.innerHTML = reviewsHTML;

                // Update CSS untuk animasi marquee berdasarkan jumlah data asli
                const numberOfOriginalCards = reviewsData.length;
                const totalWidthOfOriginalSet = (cardWidth * numberOfOriginalCards) + (cardGap * (numberOfOriginalCards -1));
                
                // Atur lebar total marquee-content (2x set kartu untuk loop)
                marqueeContent.style.width = `calc((${cardWidth}px * ${numberOfOriginalCards} * 2) + (${cardGap}px * (${numberOfOriginalCards} * 2 - 1)))`;
                
                // Update animasi marquee
                // Hapus style animasi lama jika ada, lalu tambahkan yang baru
                const styleSheet = document.styleSheets[0]; // Asumsi style-reviews.css adalah stylesheet pertama
                let marqueeRuleIndex = -1;
                
                try { // Beberapa browser mungkin melempar error jika stylesheet lintas domain atau tidak bisa diakses
                    for(let i = 0; i < styleSheet.cssRules.length; i++) {
                        if(styleSheet.cssRules[i].name === 'marquee' && styleSheet.cssRules[i].type === CSSRule.KEYFRAMES_RULE) {
                            marqueeRuleIndex = i;
                            break;
                        }
                    }
                    if (marqueeRuleIndex !== -1) {
                        styleSheet.deleteRule(marqueeRuleIndex);
                    }
                    // Tambahkan keyframe rule baru
                    styleSheet.insertRule(`
                        @keyframes marquee {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(calc(-${totalWidthOfOriginalSet}px - ${cardGap}px)); }
                        }
                    `, styleSheet.cssRules.length);
                } catch (e) {
                    console.warn("Tidak dapat memodifikasi CSS @keyframes marquee secara dinamis. Pastikan CSS ada di domain yang sama dan dapat diakses.", e);
                    // Fallback: Anda mungkin perlu mendefinisikan beberapa animasi marquee di CSS
                    // dan memilihnya berdasarkan jumlah kartu jika modifikasi dinamis gagal.
                    // Atau, pastikan @keyframes marquee di CSS sudah sesuai untuk jumlah kartu default.
                }


            } else {
                marqueeContent.innerHTML = '<p style="text-align:center; padding: 20px;">Tidak ada review untuk ditampilkan.</p>';
            }

        } catch (error) {
            console.error('Gagal mengambil atau menampilkan reviews:', error);
            if (marqueeContent) {
                marqueeContent.innerHTML = `<p style="color:red; text-align:center; padding: 20px;">Gagal memuat review: ${error.message}</p>`;
            }
        }
    }

    // Panggil fungsi utama saat halaman dimuat
    fetchAndRenderReviews();
});
