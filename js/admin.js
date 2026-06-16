(function () {
  'use strict';

  const VERIFY_URL = '/.netlify/functions/consult-verify';
  const API_URL = '/.netlify/functions/consult-admin';
  const SESSION_KEY = 'soma_admin_password';
  const POLL_MS = 15000;

  const loginEl = document.getElementById('adminLogin');
  const appEl = document.getElementById('adminApp');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const adminPasswordInput = document.getElementById('adminPassword');
  const logoutBtn = document.getElementById('logoutBtn');
  const refreshBtn = document.getElementById('refreshBtn');
  const notifyBtn = document.getElementById('notifyBtn');
  const unreadBadge = document.getElementById('unreadBadge');
  const unreadCount = document.getElementById('unreadCount');
  const adminAlert = document.getElementById('adminAlert');
  const adminAlertText = document.getElementById('adminAlertText');
  const adminAlertClose = document.getElementById('adminAlertClose');
  const adminList = document.getElementById('adminList');
  const adminEmpty = document.getElementById('adminEmpty');
  const tabs = document.querySelectorAll('.admin-tab');

  let password = '';
  let consultations = [];
  let currentFilter = 'all';
  let lastUnread = 0;
  let pollTimer = null;
  let initialLoad = true;

  function showLogin(message) {
    loginEl.removeAttribute('hidden');
    appEl.setAttribute('hidden', '');
    stopPolling();
    if (message) {
      showLoginError(message);
    }
  }

  function showApp() {
    loginEl.setAttribute('hidden', '');
    appEl.removeAttribute('hidden');
    startPolling();
    loadConsultations();
  }

  function showLoginError(message) {
    loginError.textContent = message;
    loginError.removeAttribute('hidden');
  }

  function hideLoginError() {
    loginError.textContent = '';
    loginError.setAttribute('hidden', '');
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  function startPolling() {
    stopPolling();
    pollTimer = setInterval(loadConsultations, POLL_MS);
  }

  async function verifyPassword(pwd) {
    const res = await fetch(VERIFY_URL, {
      method: 'GET',
      headers: { 'X-Admin-Password': pwd }
    });

    let data = {};
    try {
      data = await res.json();
    } catch (err) {
      throw new Error('서버 응답을 읽을 수 없습니다. 잠시 후 다시 시도해 주세요.');
    }

    if (!res.ok) {
      throw new Error(data.error || '로그인에 실패했습니다.');
    }

    return data;
  }

  async function apiRequest(method, body) {
    const res = await fetch(API_URL, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Password': password
      },
      body: body ? JSON.stringify(body) : undefined
    });

    let data = {};
    try {
      data = await res.json();
    } catch (err) {
      throw new Error('서버 응답을 읽을 수 없습니다.');
    }

    if (!res.ok) {
      throw new Error(data.error || '요청에 실패했습니다.');
    }

    return data;
  }

  function formatDate(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getFilteredList() {
    if (currentFilter === 'unread') {
      return consultations.filter(function (item) { return !item.is_read; });
    }
    if (currentFilter === 'read') {
      return consultations.filter(function (item) { return item.is_read; });
    }
    return consultations;
  }

  function renderList() {
    const filtered = getFilteredList();
    adminList.innerHTML = '';

    if (!filtered.length) {
      adminEmpty.removeAttribute('hidden');
      return;
    }

    adminEmpty.setAttribute('hidden', '');

    filtered.forEach(function (item) {
      const card = document.createElement('article');
      card.className = 'admin-card' + (item.is_read ? '' : ' is-unread');
      card.innerHTML =
        '<div class="admin-card__head">' +
          '<div>' +
            '<div class="admin-card__title">' + escapeHtml(item.student_name) + ' · ' + escapeHtml(item.grade || '-') + '</div>' +
            '<div class="admin-card__meta">' + escapeHtml(item.phone) + ' · ' + formatDate(item.created_at) + '</div>' +
          '</div>' +
          '<span class="admin-card__status admin-card__status--' + (item.is_read ? 'read' : 'unread') + '">' +
            (item.is_read ? '확인함' : '미확인') +
          '</span>' +
        '</div>' +
        '<div class="admin-card__message">' + escapeHtml(item.message || '(상담 내용 없음)') + '</div>' +
        '<div class="admin-card__actions">' +
          (item.is_read
            ? '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-action="unread" data-id="' + item.id + '">미확인으로</button>'
            : '<button type="button" class="admin-btn admin-btn--primary admin-btn--sm" data-action="read" data-id="' + item.id + '">확인 완료</button>') +
          '<button type="button" class="admin-btn admin-btn--danger admin-btn--sm" data-action="delete" data-id="' + item.id + '">삭제</button>' +
        '</div>';

      adminList.appendChild(card);
    });
  }

  function updateUnreadUI(unread) {
    unreadCount.textContent = unread;
    if (unread === 0) {
      unreadBadge.setAttribute('hidden', '');
    } else {
      unreadBadge.removeAttribute('hidden');
    }

    if (!initialLoad && unread > lastUnread) {
      showNewAlert(unread - lastUnread);
    }

    lastUnread = unread;
    initialLoad = false;
  }

  function showNewAlert(count) {
    adminAlertText.textContent = '새로운 상담 ' + count + '건이 접수되었습니다.';
    adminAlert.removeAttribute('hidden');

    if (Notification.permission === 'granted') {
      new Notification('소마 이김수학 — 새 상담 신청', {
        body: '새로운 상담 ' + count + '건이 접수되었습니다.',
        icon: 'images/logo/ikim-emblem.png'
      });
    }
  }

  async function loadConsultations() {
    if (!password) return;

    try {
      const data = await apiRequest('GET');
      consultations = data.list || [];
      updateUnreadUI(data.unread || 0);
      renderList();

      if (data.warning) {
        adminAlertText.textContent = data.warning;
        adminAlert.removeAttribute('hidden');
      }
    } catch (err) {
      if (err.message.indexOf('비밀번호') !== -1 || err.message.indexOf('401') !== -1) {
        sessionStorage.removeItem(SESSION_KEY);
        password = '';
        showLogin(err.message);
        return;
      }

      adminAlertText.textContent = err.message || '상담 목록을 불러오지 못했습니다.';
      adminAlert.removeAttribute('hidden');
    }
  }

  async function markRead(id, isRead) {
    await apiRequest('PATCH', { id: id, is_read: isRead });
    await loadConsultations();
  }

  async function deleteItem(id) {
    if (!window.confirm('이 상담 내역을 삭제할까요?')) return;
    await apiRequest('DELETE', { id: id });
    await loadConsultations();
  }

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideLoginError();

    const inputPassword = adminPasswordInput.value.trim();
    if (!inputPassword) {
      showLoginError('비밀번호를 입력해 주세요.');
      return;
    }

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '확인 중…';
    }

    try {
      await verifyPassword(inputPassword);
      password = inputPassword;
      sessionStorage.setItem(SESSION_KEY, password);
      adminPasswordInput.value = '';
      showApp();
    } catch (err) {
      password = '';
      sessionStorage.removeItem(SESSION_KEY);
      showLoginError(err.message || '로그인에 실패했습니다.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '로그인';
      }
    }
  });

  logoutBtn.addEventListener('click', function () {
    sessionStorage.removeItem(SESSION_KEY);
    password = '';
    consultations = [];
    lastUnread = 0;
    initialLoad = true;
    hideLoginError();
    showLogin();
  });

  refreshBtn.addEventListener('click', loadConsultations);

  notifyBtn.addEventListener('click', async function () {
    if (!('Notification' in window)) {
      window.alert('이 브라우저는 알림을 지원하지 않습니다.');
      return;
    }
    const permission = await Notification.requestPermission();
    notifyBtn.textContent = permission === 'granted' ? '알림 켜짐' : '알림 켜기';
  });

  adminAlertClose.addEventListener('click', function () {
    adminAlert.setAttribute('hidden', '');
  });

  adminList.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');

    if (action === 'read') markRead(id, true);
    if (action === 'unread') markRead(id, false);
    if (action === 'delete') deleteItem(id);
  });

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');
      currentFilter = tab.getAttribute('data-filter');
      renderList();
    });
  });

  async function init() {
    showLogin();
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (!saved) return;

    try {
      await verifyPassword(saved);
      password = saved;
      showApp();
    } catch (err) {
      sessionStorage.removeItem(SESSION_KEY);
      password = '';
      showLogin('이전 로그인 정보가 만료되었습니다. Netlify에 설정한 비밀번호로 다시 로그인해 주세요.');
    }
  }

  init();
})();
