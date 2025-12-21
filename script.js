/* Main script for Howatya-Saba website */

document.addEventListener('DOMContentLoaded', () => {
    // Page loader handling
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 500);
            }, 800);
        });
    }

    // Hero Slideshow logic (Index page)
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // Hamburger menu toggle (All pages)
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close menu on link click
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // Tab switching logic (Join page)
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-tab');

                // Update button states
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Update content visibility
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === targetId) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    // External link handling: target="_blank"
    const externalDomains = [
        'discord.gg',
        'x.com',
        'minecraft.jp'
    ];

    document.querySelectorAll('a').forEach(anchor => {
        const href = anchor.getAttribute('href');
        if (href && externalDomains.some(domain => href.includes(domain))) {
            anchor.setAttribute('target', '_blank');
            anchor.setAttribute('rel', 'noopener noreferrer');
        }
    });

    // News data initialization (Index and News pages)
    const latestNewsContainer = document.getElementById('latest-news');
    const allNewsContainer = document.getElementById('news-list');

    if (latestNewsContainer || allNewsContainer) {
        fetch('news.json')
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                if (latestNewsContainer) {
                    renderNews(sortedData.slice(0, 3), latestNewsContainer);
                }
                
                if (allNewsContainer) {
                    renderNews(sortedData, allNewsContainer);
                    initFilters(sortedData);
                }
            })
            .catch(err => console.error('News loading failed:', err));
    }
});

/* Helper to render news elements */
function renderNews(items, container) {
    if (!container) return;
    container.innerHTML = '';
    items.forEach(item => {
        const article = document.createElement('div');
        article.className = 'news-item';
        article.innerHTML = `
            <div class="news-header">
                <div>
                    <span class="category-tag">${item.category.toUpperCase()}</span>
                    <span class="news-title">${item.title}</span>
                </div>
                <div class="news-meta">${item.date}</div>
            </div>
            <div class="news-content">
                ${item.content}
            </div>
        `;
        container.appendChild(article);
    });
}

/* Category filter initialization */
function initFilters(data) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const newsList = document.getElementById('news-list');
    
    if (!filterBtns.length || !newsList) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filtered = (category === 'all') 
                ? data 
                : data.filter(n => n.category === category);
            
            renderNews(filtered, newsList);
        });
    });
}