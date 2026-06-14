document.addEventListener("DOMContentLoaded", () => {
    
    // --------------------------------------------------------------------------
    // 1. Atmosferik & Optimize Canvas Yağmur Efekti
    // --------------------------------------------------------------------------
    const canvas = document.getElementById("rainCanvas");
    const ctx = canvas.getContext("2d");
    
    let w, h;
    let mapData = [];
    // Masaüstünde daha yoğun, mobilde performans dostu az damla sayısı
    let maxDrops = window.innerWidth > 768 ? 45 : 15;

    function resizeCanvas() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        maxDrops = window.innerWidth > 768 ? 45 : 15;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Drop {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * -h;
            this.vy = Math.random() * 2 + 3; // Düşüş hızı
            this.len = Math.random() * 15 + 10; // Damla uzunluğu
            this.opacity = Math.random() * 0.15 + 0.05;
        }
        update() {
            this.y += this.vy;
            if (this.y > h) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(197, 168, 128, ${this.opacity})`; // Gold temalı zarif damlalar
            ctx.lineWidth = 1;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + this.len);
            ctx.stroke();
        }
    }

    function initRain() {
        mapData = [];
        for (let i = 0; i < maxDrops; i++) {
            mapData.push(new Drop());
        }
    }
    initRain();

    function animateRain() {
        ctx.clearRect(0, 0, w, h);
        mapData.forEach(drop => {
            drop.update();
            drop.draw();
        });
        requestAnimationFrame(animateRain);
    }
    animateRain();

    // --------------------------------------------------------------------------
    // 2. Akıllı Menü Mantığı (Scroll Down Gizle - Scroll Up Göster)
    // --------------------------------------------------------------------------
    const nav = document.querySelector(".smart-nav");
    let lastScrollTop = 0;

    window.addEventListener("scroll", () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Şeffaflık kontrolü
        if (scrollTop > 50) {
            nav.classList.add("scroll-up");
        } else {
            nav.classList.remove("scroll-up");
        }

        // Aşağı / Yukarı kaydırma kontrolü
        if (scrollTop > lastScrollTop && scrollTop > 150) {
            nav.classList.add("scroll-down");
        } else {
            nav.classList.remove("scroll-down");
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });

    // Mobil Hamburger Menü Açılışı
    const mobileMenuBtn = document.getElementById("mobile-menu");
    const navLinks = document.querySelector(".nav-links");

    mobileMenuBtn.addEventListener("click", () => {
        mobileMenuBtn.classList.toggle("open");
        navLinks.classList.toggle("active");
    });

    // Linklere tıklanınca menüyü kapat
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            mobileMenuBtn.classList.remove("open");
            navLinks.classList.remove("active");
        });
    });

    // --------------------------------------------------------------------------
    // 3. Scroll Reveal Sistemi (IntersectionObserver Teknolojisi)
    // --------------------------------------------------------------------------
    const reveals = document.querySelectorAll(".reveal, .staggered-parent");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // Bir kez tetiklendikten sonra takibi bırak
            }
        });
    }, {
        threshold: window.innerWidth > 768 ? 0.15 : 0.05,
        rootMargin: "0px 0px -40px 0px"
    });

    reveals.forEach(el => revealObserver.observe(el));

    // --------------------------------------------------------------------------
    // 4. Müşteri Deneyimleri Otomatik Kayan Slider (Sonsuz Döngü & Dokunmatik Uyumlu)
    // --------------------------------------------------------------------------
    const slider = document.getElementById("testimonialSlider");
    let isTransitioning = false;
    let slideInterval;

    function getStep() {
        // Ekran boyutuna göre kaydırma oranını ayarla
        if (window.innerWidth > 1024) return 33.333;
        if (window.innerWidth > 768) return 50;
        return 100;
    }

    function startAutoSlide() {
        slideInterval = setInterval(() => {
            if (isTransitioning) return;
            isTransitioning = true;
            
            const step = getStep();
            slider.style.transition = "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
            slider.style.transform = `translateX(-${step}%)`;
            
            setTimeout(() => {
                // İlk elemanı sona taşıyarak sonsuz döngü simülasyonu yapıyoruz
                slider.appendChild(slider.firstElementChild);
                slider.style.transition = "none";
                slider.style.transform = "translateX(0)";
                isTransitioning = false;
            }, 600);

        }, 4000); // 4 saniyede bir otomatik kayar
    }

    startAutoSlide();

    // Fare veya dokunma ile üzerine gelindiğinde duraklat
    slider.addEventListener("mouseenter", () => clearInterval(slideInterval));
    slider.addEventListener("mouseleave", startAutoSlide);
    slider.addEventListener("touchstart", () => clearInterval(slideInterval), {passive: true});
    slider.addEventListener("touchend", startAutoSlide);

    // --------------------------------------------------------------------------
    // 5. Sık Sorulan Sorular Akordeon Sistemi
    // --------------------------------------------------------------------------
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const currentItem = header.parentElement;
            const isOpen = currentItem.classList.contains("active");

            // Diğer açık akordeonları kapat (Opsiyonel - premium görünüm sağlar)
            document.querySelectorAll(".accordion-item").forEach(item => {
                item.classList.remove("active");
                item.querySelector("span").textContent = "+";
            });

            if (!isOpen) {
                currentItem.classList.add("active");
                header.querySelector("span").textContent = "−";
            }
        });
    });
});