(function () {
  'use strict';

  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');

  const programData = {
    soma: {
      title: '소마 사고력',
      grade: '예비초등 · 초등 저학년',
      desc: '연산보다 중요한 것은 사고력입니다. 소마 사고력 프로그램은 예비 7세반부터 수학이 재미있는 친구가 되는 첫걸음을 함께합니다. 교구와 활동을 통해 스스로 생각하고 탐구하는 힘을 키웁니다.',
      images: [
        { src: 'images/programs/soma-1.jpg', fallback: 'images/programs/soma-1.svg', alt: '소마 사고력 수업 모습' },
        { src: 'images/programs/soma-2.jpg', fallback: 'images/programs/soma-2.svg', alt: '사고력 활동 모습' }
      ],
      features: [
        '예비 7세반 · 초등 저학년 맞춤 커리큘럼',
        '교구 활용 사고력 활동 수업',
        '연산 암기가 아닌 원리 이해 중심',
        '이김 교과 수학으로 자연스럽게 연결'
      ],
      approach: '수학이 처음 만나는 아이에게 가장 중요한 것은 흥미와 자신감입니다. 소마 프로그램은 놀이와 탐구를 통해 수학적 사고의 기초를 다지고, 이후 교과 수학으로 매끄럽게 이어집니다.'
    },
    elementary: {
      title: '초등 교과',
      grade: '초등 전 학년',
      desc: '학교 수업과 연계한 개념 이해와 응용력 강화 프로그램입니다. 공부 습관 형성과 자기주도 학습의 기초를 다지며, 사고력 기반으로 교과 내용을 깊이 있게 학습합니다.',
      images: [
        { src: 'images/programs/elementary-1.jpg', fallback: 'images/programs/elementary-1.svg', alt: '초등 교과 수업 모습' },
        { src: 'images/programs/elementary-2.jpg', fallback: 'images/programs/elementary-2.svg', alt: '개념 이해 수업' }
      ],
      features: [
        '학교 진도 연계 맞춤 수업',
        '개념 이해 → 유형 훈련 → 심화 적용 단계별 학습',
        '서술형 · 응용 문제 대비',
        '공부 습관 · 자기주도 학습 형성'
      ],
      approach: '공식을 외우는 것과 원리를 이해하는 것은 다릅니다. \'왜 이렇게 풀어야 하는가\'에서 시작하는 수업으로, 변형 문제에서도 흔들리지 않는 탄탄한 기초를 만듭니다.'
    },
    middle: {
      title: '중등 수학',
      grade: '중1 ~ 중3',
      desc: '중학교 적응부터 내신 완벽 대비까지. 학교별 출제 경향 분석을 통한 시험 대비와 오답 중심 복습 관리로 고득점을 이끌어냅니다.',
      images: [
        { src: 'images/programs/middle-1.jpg', fallback: 'images/programs/middle-1.svg', alt: '중등 내신 대비 수업' },
        { src: 'images/programs/middle-2.jpg', fallback: 'images/programs/middle-2.svg', alt: '오답 복습 관리' }
      ],
      features: [
        '학교별 기출 분석 · 출제 포인트 집중 대비',
        '예비 중학생 적응 프로그램',
        '오답 노트 · 복습 관리 시스템',
        '고교 선택 전략 · 설명회 연계'
      ],
      approach: '넓게 훑는 공부가 아닌, 정확한 방향으로의 집중이 고득점의 출발입니다. 학생 개개인의 이해도를 체크하고 부족한 부분을 빠르게 보완합니다.'
    },
    high: {
      title: '고등 · 입시',
      grade: '고1 ~ 고3',
      desc: '내신과 수능을 놓치지 않는 고등 수학 학습 전략. 예비 고1 골든타임 프로그램, 생기부 관리, 고교학점제 대비까지 체계적으로 준비합니다.',
      images: [
        { src: 'images/programs/high-1.jpg', fallback: 'images/programs/high-1.svg', alt: '고등 수학 수업' },
        { src: 'images/programs/high-2.jpg', fallback: 'images/programs/high-2.svg', alt: '내신·수능 전략 수업' }
      ],
      features: [
        '내신 · 수능 동시 대비 전략',
        '예비 고1 골든타임 집중 프로그램',
        '2022 개정 교육과정 · 생기부 관리',
        '개인별 학습 상태 점검 · 피드백'
      ],
      approach: '성적은 시험장에서 결정되지 않습니다. 평소의 학습 습관과 시험 대비 방식이 결과를 만들어냅니다. 이김수학은 그 과정을 함께합니다.'
    },
    contest: {
      title: '경시 · 영재',
      grade: 'KMA · 성대경시 등',
      desc: '수학경시대회 대비 특강과 영재교육 프로그램. 사고력 기반 심화 학습으로 문제 해결력을 키우고, 경시대회와 영재교육원 연계 과정을 제공합니다.',
      images: [
        { src: 'images/programs/contest-1.jpg', fallback: 'images/programs/contest-1.svg', alt: '경시대회 특강' },
        { src: 'images/programs/contest-2.jpg', fallback: 'images/programs/contest-2.svg', alt: '영재 심화 수업' }
      ],
      features: [
        'KMA · 성대경시대회 대비 특강',
        '영재교육원 연계 심화 과정',
        '사고력 기반 문제 해결 훈련',
        '2관 영재관 전문 운영'
      ],
      approach: '경시 수학은 단순 암기가 아닌 창의적 사고력이 핵심입니다. 소마 사고력 기반 위에 심화 내용을 쌓아, 대회와 영재교육 모두에 대비합니다.'
    },
    admission: {
      title: '입시 컨설팅',
      grade: '특목고 · 자사고 · 일반고',
      desc: '고교학점제 대비, 특목·자사고 준비, 고등학교 선택 설명회 등 입시 전략을 체계적으로 안내합니다. 미래입시연구소와 협력한 전문 설명회도 진행합니다.',
      images: [
        { src: 'images/programs/admission-1.jpg', fallback: 'images/programs/admission-1.svg', alt: '입시 설명회' },
        { src: 'images/programs/admission-2.jpg', fallback: 'images/programs/admission-2.svg', alt: '고교 선택 컨설팅' }
      ],
      features: [
        '특목고 · 자사고 · 외고 · 일반고 전략',
        '고교학점제 대비 가이드',
        '광명 지역 고등학교 분석 설명회',
        '생기부 · 비교과 활동 관리'
      ],
      approach: '입시가 바뀌는 지금, 명확한 전략이 필요합니다. 막연한 고민이 아닌, 데이터와 경험에 기반한 입시 로드맵을 제시합니다.'
    }
  };

  function imgWithFallback(imgData) {
    const img = document.createElement('img');
    img.src = imgData.src;
    img.alt = imgData.alt;
    img.loading = 'lazy';
    img.onerror = function () {
      this.onerror = null;
      this.src = imgData.fallback;
    };
    return img;
  }

  // Header scroll
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', '메뉴 열기');
      });
    });
  }

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // Nav highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a');

  function highlightNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + id) {
            link.style.color = '#c9a962';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  // Program modal
  const modal = document.getElementById('programModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalGrade = document.getElementById('modalGrade');
  const modalDesc = document.getElementById('modalDesc');
  const modalGallery = document.getElementById('modalGallery');
  const modalFeatures = document.getElementById('modalFeatures');
  const modalApproach = document.getElementById('modalApproach');

  function openModal(programId) {
    const data = programData[programId];
    if (!data || !modal) return;

    modalTitle.textContent = data.title;
    modalGrade.textContent = data.grade;
    modalDesc.textContent = data.desc;
    modalApproach.textContent = data.approach;

    modalGallery.innerHTML = '';
    data.images.forEach(function (imgData) {
      modalGallery.appendChild(imgWithFallback(imgData));
    });

    modalFeatures.innerHTML = '';
    data.features.forEach(function (feature) {
      const li = document.createElement('li');
      li.textContent = feature;
      modalFeatures.appendChild(li);
    });

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('.program-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(this.getAttribute('data-program'));
    });
  });

  if (modal) {
    modal.querySelectorAll('[data-close-modal]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal();
      closeLightbox();
    }
  });

  // Gallery lightbox
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryItems = document.querySelectorAll('.gallery__item');
  let currentGalleryIndex = 0;

  function openLightbox(index) {
    const item = galleryItems[index];
    if (!item || !lightbox) return;

    const img = item.querySelector('img');
    const caption = item.querySelector('figcaption');
    const fallback = img.getAttribute('data-fallback');

    currentGalleryIndex = index;
    lightboxImg.onerror = fallback
      ? function () {
          this.onerror = null;
          this.src = fallback;
        }
      : null;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (!modal || !modal.classList.contains('is-open')) {
      document.body.classList.remove('modal-open');
    }
  }

  function navigateLightbox(dir) {
    const total = galleryItems.length;
    currentGalleryIndex = (currentGalleryIndex + dir + total) % total;
    openLightbox(currentGalleryIndex);
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener('click', function () {
      openLightbox(index);
    });
  });

  if (lightbox) {
    lightbox.querySelectorAll('[data-close-lightbox]').forEach(function (el) {
      el.addEventListener('click', closeLightbox);
    });
  }

  if (lightboxPrev) lightboxPrev.addEventListener('click', function () { navigateLightbox(-1); });
  if (lightboxNext) lightboxNext.addEventListener('click', function () { navigateLightbox(1); });

  // Consult form — save to server
  const consultForm = document.getElementById('consultForm');
  const consultSubmitBtn = document.getElementById('consultSubmitBtn');
  const consultFormNote = document.getElementById('consultFormNote');
  const CONSULT_API = '/.netlify/functions/consult-submit';

  function showConsultNote(text, isSuccess) {
    if (!consultFormNote) return;
    consultFormNote.textContent = text;
    consultFormNote.classList.toggle('is-success', !!isSuccess);
    consultFormNote.classList.toggle('is-error', !isSuccess);
  }

  async function submitConsultation(e) {
    e.preventDefault();

    const name = document.getElementById('consultName').value.trim();
    const grade = document.getElementById('consultGrade').value;
    const phone = document.getElementById('consultPhone').value.trim();
    const message = document.getElementById('consultMessage').value.trim();

    if (!name || !phone) {
      showConsultNote('학생 이름과 연락처를 입력해 주세요.', false);
      return;
    }

    if (consultSubmitBtn) {
      consultSubmitBtn.disabled = true;
      consultSubmitBtn.textContent = '저장 중…';
    }

    try {
      const res = await fetch(CONSULT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, grade: grade, phone: phone, message: message })
      });

      const data = await res.json().catch(function () { return {}; });

      if (!res.ok) {
        throw new Error(data.error || '저장에 실패했습니다.');
      }

      showConsultNote('상담 신청이 완료되었습니다. 학원에서 확인 후 연락드리겠습니다.', true);
      consultForm.reset();
      document.getElementById('consultGrade').value = '초등';
    } catch (err) {
      showConsultNote(err.message || '저장에 실패했습니다. 잠시 후 다시 시도해 주세요.', false);
    } finally {
      if (consultSubmitBtn) {
        consultSubmitBtn.disabled = false;
        consultSubmitBtn.textContent = '상담 신청하기';
      }
    }
  }

  if (consultForm) {
    consultForm.addEventListener('submit', submitConsultation);
  }
})();
