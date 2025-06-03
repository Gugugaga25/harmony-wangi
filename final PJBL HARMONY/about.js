document.addEventListener('DOMContentLoaded', function () {
  // Intersection Observer untuk animasi scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  // Observe section title
  const sectionTitle = document.querySelector('.section-title');
  if (sectionTitle) observer.observe(sectionTitle);

  // Observe paragraphs
  const storyTexts = document.querySelectorAll('.story-text');
  storyTexts.forEach((text, index) => {
    observer.observe(text);
    text.style.transitionDelay = `${index * 0.2}s`;
  });

  // Parallax hero image
  const heroImage = document.querySelector('.hero-image');
  const throttle = (fn, delay) => {
    let timeout;
    return () => {
      if (timeout) return;
      timeout = setTimeout(() => {
        fn();
        timeout = null;
      }, delay);
    };
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    if (heroImage && scrollTop < window.innerHeight) {
      const offset = scrollTop * 0.5;
      heroImage.style.transform = `translateY(${offset}px)`;
    }
  };

  window.addEventListener('scroll', throttle(handleScroll, 16));

  // Initial fade in
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    setTimeout(() => {
      heroContent.style.opacity = '1';
    }, 100);
  }
});
