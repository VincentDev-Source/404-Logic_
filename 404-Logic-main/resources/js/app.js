/**
 * URBANPULSE Smart City Intelligence Platform
 * Client-side Accessibility Manager & UI Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('js');
    initAccessibility();
    initMobileNavigation();
    initModals();
    initFormHandlers();
    initReportConfirmations();
    initReportFilters();
    initKeyboardShortcuts();
    initScrollReveal();
    initScrollToTop();
    initStickyHeader();
    initCopyReportCode();
    initTrackNewReportLink();
});

let activeModal = null;
let lastModalTrigger = null;
let copyResetTimer = null;
let closeMobileNavigation = () => {};
const trackingRequests = new WeakMap();

/* ======================================================
   1. ACCESSIBILITY MANAGER
   ====================================================== */
function initAccessibility() {
    const htmlEl = document.documentElement;

    let savedFontScale = 'normal';
    let savedContrast = false;
    let savedDyslexic = false;
    try {
        savedFontScale = localStorage.getItem('nk_font_scale') || 'normal';
        savedContrast = localStorage.getItem('nk_high_contrast') === 'true';
        savedDyslexic = localStorage.getItem('nk_dyslexic') === 'true';
    } catch (error) {
        // Storage may be unavailable in strict privacy contexts.
    }

    applyFontScale(savedFontScale);
    if (savedContrast) htmlEl.classList.add('high-contrast');
    if (savedDyslexic) htmlEl.classList.add('dyslexic-mode');

    // UI Buttons
    document.querySelectorAll('[data-font-scale]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const scale = e.currentTarget.getAttribute('data-font-scale');
            applyFontScale(scale);
            showToast(`Ukuran teks diubah ke: ${scale.toUpperCase()}`, 'info');
        });
    });

    const contrastBtn = document.getElementById('btn-toggle-contrast');
    if (contrastBtn) {
        contrastBtn.addEventListener('click', () => {
            const isHigh = htmlEl.classList.toggle('high-contrast');
            safeStorageSet('nk_high_contrast', isHigh);
            showToast(isHigh ? 'Mode Kontras Tinggi Aktif' : 'Mode Kontras Normal Aktif', 'info');
        });
    }

    const dyslexicBtn = document.getElementById('btn-toggle-dyslexic');
    if (dyslexicBtn) {
        dyslexicBtn.addEventListener('click', () => {
            const isDyslexic = htmlEl.classList.toggle('dyslexic-mode');
            safeStorageSet('nk_dyslexic', isDyslexic);
            showToast(isDyslexic ? 'Font Ramah Disleksia Aktif' : 'Font Standar Aktif', 'info');
        });
    }
}

function applyFontScale(scale) {
    const htmlEl = document.documentElement;
    htmlEl.classList.remove('font-scale-lg', 'font-scale-xl');
    if (scale === 'lg') htmlEl.classList.add('font-scale-lg');
    if (scale === 'xl') htmlEl.classList.add('font-scale-xl');
    safeStorageSet('nk_font_scale', scale);
}

function safeStorageSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        // UI preferences remain session-only when storage is unavailable.
    }
}

/* ======================================================
   2. RESPONSIVE TOP NAVIGATION
   ====================================================== */
function initMobileNavigation() {
    const header = document.getElementById('main-header');
    const toggle = document.querySelector('[data-mobile-menu-toggle]');
    const menu = document.querySelector('[data-mobile-menu]');
    if (!header || !toggle || !menu) return;

    const setOpen = (isOpen, restoreFocus = false) => {
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        toggle.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
        menu.hidden = !isOpen;
        header.classList.toggle('has-open-menu', isOpen);

        if (!isOpen && restoreFocus) toggle.focus();
    };

    closeMobileNavigation = ({ restoreFocus = false } = {}) => setOpen(false, restoreFocus);

    toggle.addEventListener('click', () => {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setOpen(false));
    });

    menu.querySelectorAll('[data-mobile-menu-action]').forEach(action => {
        action.addEventListener('click', () => setOpen(false, true));
    });

    document.addEventListener('click', event => {
        if (toggle.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) {
            setOpen(false);
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !activeModal && toggle.getAttribute('aria-expanded') === 'true') {
            event.preventDefault();
            setOpen(false, true);
        }
    });

    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const closeAtDesktop = event => {
        if (event.matches) setOpen(false);
    };
    desktopQuery.addEventListener?.('change', closeAtDesktop);
}

/* ======================================================
   3. TOAST NOTIFICATION SYSTEM
   ====================================================== */
window.showToast = function(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 p-4 rounded-xl shadow-lg border transition-all duration-300 transform translate-y-2 opacity-0 text-sm font-medium ${
        type === 'success' ? 'bg-emerald-900 text-emerald-50 border-emerald-700' :
        type === 'error' ? 'bg-red-900 text-red-50 border-red-700' :
        'bg-slate-900 text-slate-100 border-slate-700'
    }`;
    toast.setAttribute('role', 'alert');

    let iconSvg = '';
    if (type === 'success') {
        iconSvg = `<svg class="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`;
    } else if (type === 'error') {
        iconSvg = `<svg class="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`;
    } else {
        iconSvg = `<svg class="w-5 h-5 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    }

    toast.innerHTML = `${iconSvg} <span class="flex-1">${message}</span>`;
    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    });

    // Remove after 4s
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
};

/* ======================================================
   4. MODAL MANAGER (ACCESSIBLE & FOCUS TRAPPED)
   ====================================================== */
function initModals() {
    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetId = trigger.getAttribute('data-modal-target');
            openModal(targetId);
        });
    });

    document.querySelectorAll('[data-modal-close]').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal-backdrop');
            if (modal) closeModal(modal.id);
        });
    });

    // Backdrop click close
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-backdrop:not(.hidden)');
            if (activeModal) closeModal(activeModal.id);
        }
    });
}

window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal || activeModal) return;

    closeMobileNavigation();
    lastModalTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    activeModal = modal;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.querySelector('#main-content')?.setAttribute('inert', '');
    document.querySelector('#main-header')?.setAttribute('inert', '');
    document.querySelector('#scroll-top')?.setAttribute('inert', '');
    document.querySelector('.civic-footer')?.setAttribute('inert', '');

    // Focus first input or close button
    const focusable = modal.querySelectorAll('input, select, textarea, button');
    if (focusable.length > 0) {
        focusable[0].focus();
    }
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal || activeModal !== modal) return;

    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.querySelector('#main-content')?.removeAttribute('inert');
    document.querySelector('#main-header')?.removeAttribute('inert');
    document.querySelector('#scroll-top')?.removeAttribute('inert');
    document.querySelector('.civic-footer')?.removeAttribute('inert');
    activeModal = null;
    lastModalTrigger?.focus();
    lastModalTrigger = null;
};

document.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !activeModal) return;

    const focusable = [...activeModal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter(element => !element.closest('[hidden]'));
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
});

/* ======================================================
   4. FORM HANDLERS (AJAX WITH USER FEEDBACK)
   ====================================================== */
function initFormHandlers() {
    // 1. Form Lapor Warga
    const formLapor = document.getElementById('form-lapor-warga');
    if (formLapor) {
        formLapor.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = formLapor.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<svg aria-hidden="true" class="inline-block animate-spin mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3"></circle><path class="opacity-75" fill="currentColor" d="M21 12a9 9 0 0 0-9-9v3a6 6 0 0 1 6 6h3Z"></path></svg> Mengirim Laporan...`;

            try {
                const formData = new FormData(formLapor);
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

                const response = await fetch(formLapor.action, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken || '',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        category: formData.get('category'),
                        title: formData.get('title'),
                        address: formData.get('address'),
                        description: formData.get('description')
                    })
                });

                const data = await response.json();

                if (response.status === 401) {
                    window.location.assign(document.querySelector('meta[name="login-url"]')?.content || '/login');
                    return;
                }

                if (response.ok && data.data) {
                    closeModal('modal-lapor');
                    formLapor.reset();
                    showReportSuccess(data.data.tracking_code);
                } else {
                    const firstError = data.errors ? Object.values(data.errors).flat()[0] : null;
                    showToast(firstError || data.message || 'Gagal mengirim laporan. Periksa kelengkapan form.', 'error');
                }
            } catch (err) {
                showToast('Terjadi kesalahan jaringan. Coba lagi.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    // 2. Report tracking forms can be reused across pages.
    document.querySelectorAll('[data-report-tracking-form]').forEach(form => {
        const input = form.querySelector('[data-report-tracking-input]');
        const result = form.querySelector('[data-report-tracking-result]')
            || form.parentElement?.querySelector('[data-report-tracking-result]');
        if (!input || !result) return;

        if (input.id === 'citizen-report-tracking' && !input.value) {
            input.value = safeSessionStorageGet('urbanpulse_recent_tracking_code') || '';
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const code = input.value.trim().toUpperCase();
            if (!code) {
                showToast('Masukkan tracking code laporan.', 'error');
                return;
            }
            input.value = code;

            result.innerHTML = `<div class="p-4 text-center text-slate-500 animate-pulse">Memeriksa laporan ${escapeHtml(code)}...</div>`;
            result.classList.remove('hidden');

            trackingRequests.get(form)?.abort();
            const controller = new AbortController();
            trackingRequests.set(form, controller);
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) submitButton.disabled = true;

            try {
                const reportsUrl = document.querySelector('meta[name="reports-url"]')?.content || '/api/reports';
                const response = await fetch(`${reportsUrl}/${encodeURIComponent(code)}`, {
                    headers: { 'Accept': 'application/json' },
                    signal: controller.signal
                });
                const data = await response.json();

                if (response.ok && data.data) {
                    const report = data.data;
                    const timeline = report.updates || [];
                    result.innerHTML = `
                        <div class="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-slate-800">
                            <div class="flex flex-col gap-3 border-b border-emerald-200 pb-3 mb-3 sm:flex-row sm:items-center sm:justify-between">
                                <div class="min-w-0">
                                    <span class="text-xs font-bold text-emerald-700 tracking-wider uppercase">Status laporan</span>
                                    <h4 class="break-all font-bold text-lg text-emerald-950">${escapeHtml(report.tracking_code)}</h4>
                                </div>
                                <span class="self-start px-3 py-1 bg-emerald-600 text-white font-semibold text-xs rounded-full">${escapeHtml(report.status.label)}</span>
                            </div>
                            <p class="text-xs font-medium text-emerald-800 mb-4">${escapeHtml(report.title)}</p>
                            <div class="space-y-2 text-xs">
                                ${timeline.map(t => `
                                    <div class="flex items-center gap-2 text-emerald-900 font-semibold">
                                        <span class="w-4 h-4 rounded-full flex items-center justify-center bg-emerald-600 text-white text-[10px]">✓</span>
                                        <span class="flex-1">${escapeHtml(t.status_label || t.note || 'Pembaruan laporan')}</span>
                                        <span class="text-[10px] text-slate-500">${escapeHtml(formatDate(t.created_at))}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                } else {
                    result.innerHTML = `
                        <div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                            ${escapeHtml(data.message || 'Laporan tidak ditemukan.')}
                        </div>
                    `;
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    result.innerHTML = `<div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">Gagal terhubung ke server. Coba lagi.</div>`;
                }
            } finally {
                if (trackingRequests.get(form) === controller) {
                    trackingRequests.delete(form);
                    if (submitButton) submitButton.disabled = false;
                }
            }
        });
    });
}

function showReportSuccess(trackingCode) {
    const modal = document.getElementById('modal-report-success');
    const code = modal?.querySelector('[data-new-report-code]');
    if (!modal || !code) {
        showToast(`Laporan tersimpan. Simpan tracking code: ${trackingCode}`, 'success');
        return;
    }

    safeSessionStorageSet('urbanpulse_recent_tracking_code', trackingCode);
    code.textContent = trackingCode;
    modal.querySelector('[data-copy-report-code]').textContent = 'Salin kode';
    window.clearTimeout(copyResetTimer);
    openModal('modal-report-success');
}

function initCopyReportCode() {
    document.querySelectorAll('[data-copy-report-code]').forEach(button => {
        button.addEventListener('click', async () => {
            const code = button.closest('.modal-backdrop')?.querySelector('[data-new-report-code]')?.textContent?.trim();
            if (!code) return;

            try {
                await navigator.clipboard.writeText(code);
                button.textContent = 'Tersalin';
                window.clearTimeout(copyResetTimer);
                copyResetTimer = window.setTimeout(() => { button.textContent = 'Salin kode'; }, 1800);
            } catch (error) {
                showToast('Salin kode secara manual dari kotak tracking.', 'info');
            }
        });
    });
}

function initTrackNewReportLink() {
    document.querySelectorAll('[data-track-new-report]').forEach(link => {
        link.addEventListener('click', () => {
            const code = link.closest('.modal-backdrop')?.querySelector('[data-new-report-code]')?.textContent?.trim();
            const input = document.getElementById('citizen-report-tracking');
            if (code && input) {
                input.value = code;
                window.setTimeout(() => input.focus(), 0);
            }
        });
    });
}

function safeSessionStorageGet(key) {
    try {
        return sessionStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

function safeSessionStorageSet(key, value) {
    try {
        sessionStorage.setItem(key, value);
    } catch (error) {
        // Tracking code remains visible in the persistent success dialog.
    }
}

function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDate(value) {
    if (!value) return '';
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date(value));
}

function initReportConfirmations() {
    document.addEventListener('click', async (event) => {
        const button = event.target.closest('[data-confirm-report]');
        if (!button) return;

        button.disabled = true;
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            const response = await fetch(button.dataset.confirmReport, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();

            if (response.status === 401) {
                window.location.assign(document.querySelector('meta[name="login-url"]')?.content || '/login');
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || 'Konfirmasi tidak dapat dicatat.');
            }

            const count = button.querySelector('[data-confirmation-count]');
            if (count) count.textContent = `${data.confirmation_count} Konfirmasi`;
            showToast(data.message, data.already_confirmed ? 'info' : 'success');
        } catch (error) {
            showToast(error.message || 'Konfirmasi tidak dapat dicatat.', 'error');
        } finally {
            button.disabled = false;
        }
    });
}

function initReportFilters() {
    const filters = document.querySelectorAll('[data-report-filter]');
    if (!filters.length) return;

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            const selectedStatus = filter.dataset.reportFilter;

            filters.forEach(item => item.classList.toggle('is-active', item === filter));
            filters.forEach(item => item.setAttribute('aria-pressed', item === filter ? 'true' : 'false'));
            let visibleCount = 0;
            document.querySelectorAll('[data-report-status]').forEach(report => {
                const hidden = selectedStatus !== 'all' && report.dataset.reportStatus !== selectedStatus;
                report.classList.toggle('hidden', hidden);
                if (!hidden) visibleCount += 1;
            });
            document.querySelector('[data-report-filter-empty]')?.classList.toggle('hidden', visibleCount > 0);
        });
    });
}

/* ======================================================
   6. KEYBOARD SHORTCUTS HANDLER
   ====================================================== */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Press '?' (Shift + /) to show keyboard guide modal
        if (e.key === '?' && !activeModal && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            openModal('modal-keyboard-shortcuts');
        }
    });
}

/* ======================================================
   7. SCROLL REVEAL ANIMATIONS
   ====================================================== */
function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach(el => {
        observer.observe(el);
    });
}

/* ======================================================
   8. SCROLL TO TOP BUTTON
   ====================================================== */
function initScrollToTop() {
    const btn = document.getElementById('scroll-top');
    if (!btn) return;

    const updateScrollTopState = () => {
        if (window.scrollY > 400) {
            btn.classList.add('is-visible');
            btn.removeAttribute('aria-hidden');
            btn.removeAttribute('tabindex');
        } else {
            btn.classList.remove('is-visible');
            btn.setAttribute('aria-hidden', 'true');
            btn.setAttribute('tabindex', '-1');
        }
    };

    window.addEventListener('scroll', updateScrollTopState, { passive: true });
    updateScrollTopState();

    btn.addEventListener('click', () => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
}

/* ======================================================
   9. STICKY HEADER EFFECT
   ====================================================== */
function initStickyHeader() {
    const header = document.getElementById('main-header');
    if (!header) return;

    const updateHeaderState = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
    window.addEventListener('scroll', updateHeaderState, { passive: true });
    updateHeaderState();
}
