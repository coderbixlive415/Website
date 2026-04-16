const stuff = document.querySelectorAll('.fadeUp, .fadeIn, .slideIn');

const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('show');
    }
  });
});

stuff.forEach(el => obs.observe(el));