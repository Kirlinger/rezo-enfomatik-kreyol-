/* ===================================================
   REZO ENFÒMATIK AN KREYÒL - Main JavaScript
   =================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* -------- Theme Toggle -------- */
  const themeBtn = document.getElementById('theme-toggle');
  const body = document.body;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') body.classList.add('light-mode');
  if (themeBtn) {
    updateThemeIcon();
    themeBtn.addEventListener('click', () => {
      body.classList.toggle('light-mode');
      localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
      updateThemeIcon();
    });
  }
  function updateThemeIcon() {
    if (!themeBtn) return;
    themeBtn.textContent = body.classList.contains('light-mode') ? '🌙' : '☀️';
    themeBtn.title = body.classList.contains('light-mode') ? 'Mòd nwa' : 'Mòd klè';
  }

  /* -------- Mobile Menu -------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
      }
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
    }));
  }

  /* -------- Back to Top -------- */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* -------- Active Nav Link -------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* -------- Accordion -------- */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function () {
      const body = this.nextElementSibling;
      const icon = this.querySelector('.acc-icon');
      const isOpen = this.classList.contains('open');
      // Close all in same accordion
      const accordion = this.closest('.accordion');
      if (accordion) {
        accordion.querySelectorAll('.accordion-header').forEach(h => {
          h.classList.remove('open');
          const b = h.nextElementSibling;
          if (b) b.classList.remove('open');
        });
      }
      if (!isOpen) {
        this.classList.add('open');
        if (body) body.classList.add('open');
      }
    });
  });

  /* -------- Tabs -------- */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const tabContainer = this.closest('.tab-container');
      if (!tabContainer) return;
      tabContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      tabContainer.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const target = document.getElementById(this.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  /* -------- Glossary / Resource Search -------- */
  const searchInput = document.getElementById('search-input');
  const searchCount = document.getElementById('search-count');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const query = this.value.toLowerCase().trim();
      const items = document.querySelectorAll('.searchable-item');
      let visible = 0;
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const match = !query || text.includes(query);
        item.classList.toggle('hidden', !match);
        if (match) visible++;
      });
      if (searchCount) searchCount.textContent = query ? `${visible} rezilta yo jwenn` : `${items.length} tèm yo`;
    });
    if (searchCount) {
      const items = document.querySelectorAll('.searchable-item');
      searchCount.textContent = `${items.length} tèm yo`;
    }
  }

  /* -------- Quiz Logic -------- */
  const quizForm = document.getElementById('quiz-form');
  const quizResult = document.getElementById('quiz-result');
  const quizScoreEl = document.getElementById('quiz-score');
  const quizFeedback = document.getElementById('quiz-feedback');
  const submitBtn = document.getElementById('quiz-submit');
  const resetBtn = document.getElementById('quiz-reset');
  const showAnswersBtn = document.getElementById('quiz-show-answers');

  if (quizForm) {
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        const questions = quizForm.querySelectorAll('.quiz-question');
        let score = 0;
        let answered = 0;
        questions.forEach((q, i) => {
          const selected = q.querySelector('input[type="radio"]:checked');
          const correct = q.dataset.answer;
          const options = q.querySelectorAll('.quiz-option');
          options.forEach(opt => {
            opt.classList.remove('correct', 'wrong');
          });
          if (selected) {
            answered++;
            const selectedLabel = selected.closest('.quiz-option');
            if (selected.value === correct) {
              score++;
              if (selectedLabel) selectedLabel.classList.add('correct');
            } else {
              if (selectedLabel) selectedLabel.classList.add('wrong');
              options.forEach(opt => {
                const inp = opt.querySelector('input[type="radio"]');
                if (inp && inp.value === correct) opt.classList.add('correct');
              });
            }
          } else {
            options.forEach(opt => {
              const inp = opt.querySelector('input[type="radio"]');
              if (inp && inp.value === correct) opt.classList.add('correct');
            });
          }
        });
        if (answered < questions.length) {
          const unanswered = questions.length - answered;
          if (!confirm(`Ou pa reponn ${unanswered} kesyon. Kontinye kanmèm?`)) return;
        }
        const pct = Math.round((score / questions.length) * 100);
        quizScoreEl.textContent = `${score} / ${questions.length}`;
        let msg = '';
        if (pct >= 90) msg = '🏆 Ekselan! Ou dominen materyèl la!';
        else if (pct >= 70) msg = '👍 Trè Byen! Kontinye travay.';
        else if (pct >= 50) msg = '📚 Pasab. Revize pati ou pa konnen yo.';
        else msg = '🔄 Kontinye aprann. Li ankò epi eseye.';
        quizFeedback.textContent = msg;
        quizResult.classList.add('show');
        quizResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Show explanations
        quizForm.querySelectorAll('.quiz-explanation').forEach(el => el.classList.remove('hidden'));
        // Show reset button
        if (resetBtn) resetBtn.style.display = '';
        if (submitBtn) submitBtn.style.display = 'none';
      });
    }

    function doReset() {
      quizForm.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
      quizForm.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('correct', 'wrong'));
      quizForm.querySelectorAll('.quiz-explanation').forEach(el => el.classList.add('hidden'));
      quizResult.classList.remove('show');
      if (resetBtn) resetBtn.style.display = 'none';
      if (submitBtn) submitBtn.style.display = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (resetBtn) resetBtn.addEventListener('click', doReset);
    const resetBtn2 = document.getElementById('quiz-reset-2');
    if (resetBtn2) resetBtn2.addEventListener('click', doReset);

    if (showAnswersBtn) {
      showAnswersBtn.addEventListener('click', function () {
        const questions = quizForm.querySelectorAll('.quiz-question');
        questions.forEach(q => {
          const correct = q.dataset.answer;
          const options = q.querySelectorAll('.quiz-option');
          options.forEach(opt => {
            const inp = opt.querySelector('input[type="radio"]');
            opt.classList.remove('correct', 'wrong');
            if (inp && inp.value === correct) opt.classList.add('correct');
          });
          // Show explanations
          const exp = q.querySelector('.quiz-explanation');
          if (exp) exp.classList.remove('hidden');
        });
      });
    }
  }

  /* -------- Smooth Fade Animations -------- */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.card, .topic-card, .lab-card, .resource-card, .glossary-item').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

  /* -------- Copy Code Blocks -------- */
  document.querySelectorAll('.code-block').forEach(block => {
    const btn = document.createElement('button');
    btn.textContent = '📋';
    btn.title = 'Kopye';
    btn.style.cssText = 'position:absolute;top:0.5rem;right:0.5rem;background:rgba(30,144,255,0.15);border:1px solid rgba(30,144,255,0.3);color:#1e90ff;border-radius:4px;padding:0.2rem 0.5rem;cursor:pointer;font-size:0.75rem;';
    block.style.position = 'relative';
    block.appendChild(btn);
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(block.innerText.replace('📋', '').trim()).then(() => {
        btn.textContent = '✅';
        setTimeout(() => btn.textContent = '📋', 1500);
      });
    });
  });

});
