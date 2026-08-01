document.addEventListener('DOMContentLoaded', function () {
    const selectors = {
        headerWrap: '.header_wrap',
        authorLinks: '.author-links',
        nav: '.nav',
        navWrap: '.nav-wrap'
    };

    const headerWrap = document.querySelector(selectors.headerWrap);
    const authorLinks = document.querySelector(selectors.authorLinks);
    const nav = document.querySelector(selectors.nav);
    const navWrap = document.querySelector(selectors.navWrap);

    const menusIcon = document.querySelector('.menus_icon');
    const mobileSocialToggle = document.querySelector('.m-social-links');
    const siteNavButton = document.querySelector('.site-nav');

    if (menusIcon && headerWrap) {
        menusIcon.addEventListener('click', function () {
            headerWrap.classList.toggle('menus-open');
        });
    }

    if (mobileSocialToggle && authorLinks) {
        mobileSocialToggle.addEventListener('click', function () {
            authorLinks.classList.toggle('is-open');
        });
    }

    if (siteNavButton && nav) {
        siteNavButton.addEventListener('click', function () {
            nav.classList.toggle('nav-open');
        });
    }

    document.addEventListener('click', function (event) {
        const target = event.target;

        if (nav && !target.closest(selectors.nav)) {
            nav.classList.remove('nav-open');
        }

        if (authorLinks && !target.closest(selectors.authorLinks)) {
            authorLinks.classList.remove('is-open');
        }

        if (headerWrap && !target.closest('.menus_icon') && !target.closest('.menus_items')) {
            headerWrap.classList.remove('menus-open');
        }
    });

    const offset = 100;
    if (navWrap) {
        window.addEventListener('scroll', function () {
            const isVisible = window.pageYOffset > offset;
            navWrap.classList.toggle('is-visible', isVisible);
        });
    }

    const backToTopButton = document.querySelector('.cd-top');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function (event) {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    document.querySelectorAll('a[href*="#"]:not([href="#"])').forEach(function (anchor) {
        anchor.addEventListener('click', function (event) {
            const currentPath = location.pathname.replace(/^\//, '');
            const targetPath = this.pathname.replace(/^\//, '');

            if (currentPath !== targetPath || location.hostname !== this.hostname) {
                return;
            }

            const hash = this.hash;
            if (!hash) {
                return;
            }

            const id = hash.slice(1);
            const target = document.getElementById(id) || document.querySelector('[name="' + id + '"]');
            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    function copyText(text) {
        if (!text) {
            return Promise.reject(new Error('empty text'));
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }

        return new Promise(function (resolve, reject) {
            const temp = document.createElement('input');
            temp.value = text;
            document.body.appendChild(temp);
            temp.select();
            temp.setSelectionRange(0, text.length);

            try {
                const ok = document.execCommand('copy');
                document.body.removeChild(temp);
                if (ok) {
                    resolve();
                } else {
                    reject(new Error('copy failed'));
                }
            } catch (err) {
                document.body.removeChild(temp);
                reject(err);
            }
        });
    }

    function showCopyTip(element, message) {
        element.setAttribute('data-copy-tip', message);
        element.classList.add('is-copied');
        setTimeout(function () {
            element.classList.remove('is-copied');
        }, 1200);
    }

    document.addEventListener('click', function (event) {
        const copyButton = event.target.closest('.social-copy');
        if (!copyButton) {
            return;
        }

        event.preventDefault();
        const value = copyButton.getAttribute('data-value') || '';
        copyText(value)
            .then(function () { showCopyTip(copyButton, 'Copied'); })
            .catch(function () { showCopyTip(copyButton, 'Copy failed'); });
    });

    document.addEventListener('keydown', function (event) {
        const copyButton = event.target.closest('.social-copy');
        if (!copyButton) {
            return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            copyButton.click();
        }
    });
});
