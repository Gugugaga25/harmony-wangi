document.addEventListener('DOMContentLoaded', () => {
    // Klik kartu parfum → pindah halaman
    const parfumCards = document.querySelectorAll('.parfum-card');
    parfumCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetPage = card.getAttribute('data-target');
            window.location.href = targetPage;
        });
    });

    // Smooth Scroll untuk internal link (About)
    const navLinks = document.querySelectorAll('.nav-link a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');

            // Kalau link internal (pakai #), jalankan smooth scroll
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 60,
                        behavior: 'smooth'
                    });
                }
            }
            // Kalau link eksternal (misal katalog.html), biarkan default
        });
    });

    // Hero Section Fade-in Animation
    const heroSection = document.querySelector('.hero');
    heroSection.style.opacity = '0';
    heroSection.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        heroSection.style.transition = 'opacity 1s ease, transform 1s ease';
        heroSection.style.opacity = '1';
        heroSection.style.transform = 'translateY(0)';
    }, 300);

    // About Section Slide-in Animation
    const homeImage = document.querySelector('.home-image');
    const homeText = document.querySelector('.home-text');

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                homeImage.style.opacity = '1';
                homeImage.style.transform = 'translateX(0)';
                
                homeText.style.opacity = '1';
                homeText.style.transform = 'translateX(0)';
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial styles
    homeImage.style.opacity = '0';
    homeImage.style.transform = 'translateX(-50px)';
    homeImage.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    homeText.style.opacity = '0';
    homeText.style.transform = 'translateX(50px)';
    homeText.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    observer.observe(document.querySelector('.home-content'));

    // Hover Animasi pada Navlink
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transition = 'transform 0.3s ease';
            link.style.transform = 'scale(1.1)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'scale(1)';
        });
    });

    // Footer Scroll Reveal
    const footer = document.querySelector('footer');
    footer.style.opacity = '0';
    footer.style.transform = 'translateY(20px)';

    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                footer.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                footer.style.opacity = '1';
                footer.style.transform = 'translateY(0)';
                footerObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    footerObserver.observe(footer);
});

// tambahan script js nya katalog
let perfumes = [];

fetch(jsonSource)
  .then(res => res.json())
  .then(data => {
    perfumes = data;
    renderPerfumes();
  })
  .catch(err => console.error("Gagal memuat JSON:", err));

let currentFilter = 'all';
let searchTerm = '';

function createPerfumeCard(perfume, index) {
  return `
    <div class="perfume-card fade-in" data-category="${perfume.category}" style="animation-delay: ${index * 0.1}s">
      <div class="perfume-image">
        <img src="${perfume.image}" alt="${perfume.name}">
      </div>
      <div class="perfume-info">
        <h3 class="perfume-name">${perfume.name}</h3>
        <p class="perfume-description">${perfume.description}</p>
        <div class="perfume-price">
          <span class="price-tag">Rp ${perfume.price}/ml</span>
          <span class="ml-info">${perfume.ml}</span>
        </div>
      </div>
    </div>
  `;
}

function renderPerfumes() {
  const catalogGrid = document.getElementById('catalogGrid');
  const noResults = document.getElementById('noResults');

  let filteredPerfumes = perfumes;

  if (currentFilter !== 'all') {
    filteredPerfumes = filteredPerfumes.filter(perfume =>
      perfume.category === currentFilter
    );
  }

  if (searchTerm) {
    filteredPerfumes = filteredPerfumes.filter(perfume =>
      perfume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perfume.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filteredPerfumes.length === 0) {
    catalogGrid.style.display = 'none';
    noResults.style.display = 'block';
  } else {
    catalogGrid.style.display = 'grid';
    noResults.style.display = 'none';
    catalogGrid.innerHTML = filteredPerfumes.map((perfume, index) => createPerfumeCard(perfume, index)).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchInput').addEventListener('input', e => {
    searchTerm = e.target.value;
    renderPerfumes();
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.dataset.category;
      renderPerfumes();
    });
  });
});

