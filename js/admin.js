(function () {
  'use strict';

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

  let password = sessionStorage.getItem(SESSION_KEY) || '';
  let consultations = [];
  let currentFilter = 'all';
  let lastUnread = 0;
  let pollTimer = null;
  let initialLoad = true;

  function showLogin() {
    loginEl.hidden = false;
    appEl.hidden = true;
    stopPolling();
  }

  function showApp() {
    loginEl.hidden = true;
    appEl.hidden = false;
    startPolling();
    loadConsultations();
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

  async function apiRequest(method, body) {
    const res = await fetch(API_URL, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Password': password
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const data = await res.json().catch(function () {
      return {};
    });

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
      adminEmpty.hidden = false;
      return;
    }

    adminEmpty.hidden = true;

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
    unreadBadge.hidden = unread === 0;

    if (!initialLoad && unread > lastUnread) {
      showNewAlert(unread - lastUnread);
    }

    lastUnread = unread;
    initialLoad = false;
  }

  function showNewAlert(count) {
    adminAlertText.textContent = '새로운 상담 ' + count + '건이 접수되었습니다.';
    adminAlert.hidden = false;

    if (Notification.permission === 'granted') {
      new Notification('소마 이김수학 — 새 상담 신청', {
        body: '새로운 상담 ' + count + '건이 접수되었습니다.',
        icon: 'images/logo/ikim-emblem.png'
      });
    }
  }

  async function loadConsultations() {
    try {
      const data = await apiRequest('GET');
      consultations = data.list || [];
      updateUnreadUI(data.unread || 0);
      renderList();
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('비밀번호')) {
        sessionStorage.removeItem(SESSION_KEY);
        password = '';
        showLogin();
        loginError.textContent = err.message;
        loginError.hidden = false;
      }
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
    loginError.hidden = true;
    password = adminPasswordInput.value.trim();

    if (!password) {
      loginError.textContent = '비밀번호를 입력해 주세요.';
      loginError.hidden = false;
      return;
    }

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '확인 중…';
    }

    try {
      const data = await apiRequest('GET');
      sessionStorage.setItem(SESSION_KEY, password);
      adminPasswordInput.value = '';
      showApp();
      if (data.warning) {
        window.alert(data.warning);
      }
    } catch (err) {
      password = '';
      loginError.textContent = err.message || '로그인에 실패했습니다. Netlify에 설정한 ADMIN_PASSWORD와 동일한지 확인해 주세요.';
      loginError.hidden = false;
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
    adminAlert.hidden = true;
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

  if (password) {
    showApp();
  } else {
    showLogin();
  }
})();
