// --- FUNCTIONS DATA ---
document.addEventListener("DOMContentLoaded", () => {
    initTabNavigation();
    initThemeToggle();
    renderTechniques();
    renderTheory();
    renderBooks();
    renderArchive(); // For worksheets/archive
    setupModal();
    setupArchiveSearch(); setupWorksheetGenerator();
    setupHelper();
    setupTechFilters();
    setupMainSearch();
});

function initThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    if (!themeToggle) return;
    
    themeToggle.addEventListener("click", () => {
        const isDark = document.body.classList.contains("dark-mode");
        if (isDark) {
            document.body.classList.remove("dark-mode");
            document.body.classList.add("light-mode");
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem("theme", "light");
        } else {
            document.body.classList.remove("light-mode");
            document.body.classList.add("dark-mode");
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
            localStorage.setItem("theme", "dark");
        }
    });
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.remove("light-mode");
        document.body.classList.add("dark-mode");
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        document.body.classList.remove("dark-mode");
        document.body.classList.add("light-mode");
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
}

function renderHeroBookshelf() {
    const shelf = document.getElementById("hero-bookshelf");
    if (!shelf || typeof books === 'undefined' || books.length === 0) return;
    
    // 12 representative books with diverse gradient themes (sorted indices)
    const selectedIndices = [0, 1, 2, 4, 6, 12, 22, 23, 30, 32, 38, 52];
    
    let html = "";
    
    // Row 1
    html += '<div class="shelf-row">';
    for (let i = 0; i < 6; i++) {
        const idx = selectedIndices[i];
        if (idx === undefined || !books[idx]) continue;
        const book = books[idx];
        const isRotated = (i % 3 === 0) ? "skewed-left" : (i % 5 === 0 ? "skewed-right" : "");
        html += `
            <div class="book-spine-3d ${isRotated}" style="background: ${book.gradient || 'var(--accent-coral)'}" onclick="openModal('book', ${idx})" title="${book.title} (클릭 시 토론 가이드 열기)">
                <div class="spine-text">${book.title}</div>
                <div class="spine-decor"></div>
            </div>
        `;
    }
    html += '</div><div class="shelf-board"></div>';
    
    // Row 2
    html += '<div class="shelf-row">';
    for (let i = 6; i < 12; i++) {
        const idx = selectedIndices[i];
        if (idx === undefined || !books[idx]) continue;
        const book = books[idx];
        const isRotated = (i % 3 === 0) ? "skewed-left" : (i % 4 === 0 ? "skewed-right" : "");
        html += `
            <div class="book-spine-3d ${isRotated}" style="background: ${book.gradient || 'var(--accent-coral)'}" onclick="openModal('book', ${idx})" title="${book.title} (클릭 시 토론 가이드 열기)">
                <div class="spine-text">${book.title}</div>
                <div class="spine-decor"></div>
            </div>
        `;
    }
    html += '</div><div class="shelf-board"></div>';
    
    shelf.innerHTML = html;
}

function initTabNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = document.querySelectorAll('section[id$="-section"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            navLinks.forEach(n => n.classList.remove('active'));
            link.classList.add('active');
            
            sections.forEach(s => {
                if(s.id === targetId || (targetId === 'search-section' && s.classList.contains('hero-section'))) {
                    s.classList.add('active');
                    s.style.display = 'block';
                } else if(s.id === targetId) {
                     s.style.display = 'block';
                } else {
                    s.classList.remove('active');
                    s.style.display = 'none';
                }
            });
            // Also hero section handling
            const hero = document.querySelector('.hero-section');
            if(hero) {
                if(targetId === 'search-section') {
                    hero.style.display = 'block';
                } else {
                    hero.style.display = 'none';
                }
            }
            
            window.scrollTo({top:0, behavior:'smooth'});
        });
    });
    
    // Default Tab
    const hash = window.location.hash || '#search-section';
    const defaultLink = document.querySelector(`.nav-links a[href="${hash}"]`);
    if(defaultLink) {
        defaultLink.click();
    } else {
        // Fallback
        if(navLinks.length > 0) navLinks[0].click();
    }
}

function fetchRealCover(bookTitle, domElement) {
    const book = typeof books !== 'undefined' ? books.find(b => {
        const t1 = b.title.replace(/\s/g, '').toLowerCase();
        const t2 = bookTitle.replace(/\s/g, '').toLowerCase();
        const normalize = (str) => str.replace(/x/g, '엑스').replace(/X/g, '엑스');
        return normalize(t1) === normalize(t2) || t1.includes(t2) || t2.includes(t1);
    }) : null;

    if (book) {
        // Ensure absolute positioning context if needed
        if (window.getComputedStyle(domElement).position === 'static') {
            domElement.style.position = 'relative';
        }
        
        let fallbackCont = domElement.querySelector(".book-fallback-content");
        if (!fallbackCont) {
            fallbackCont = document.createElement("div");
            fallbackCont.className = "book-fallback-content";
            fallbackCont.style.cssText = "width:100%; height:100%; display:flex; flex-direction:column; justify-content:space-between; box-sizing:border-box; position:absolute; top:0; left:0; padding:12px;";
            
            // Move existing children to fallback container
            while (domElement.firstChild) {
                fallbackCont.appendChild(domElement.firstChild);
            }
            domElement.appendChild(fallbackCont);
        }
        
        let realImg = domElement.querySelector("img.real-book-cover-loaded");
        if (!realImg) {
            realImg = document.createElement("img");
            realImg.className = "real-book-cover-loaded";
            realImg.alt = `${bookTitle} 표지`;
            realImg.style.cssText = "width:100% !important; height:100% !important; object-fit:cover; border-radius:4px; display:none; border:none !important; outline:none !important; box-shadow:none !important; position:absolute; top:0; left:0;";
            domElement.appendChild(realImg);
        }
        
        realImg.onload = () => {
            realImg.style.display = "block";
            fallbackCont.style.display = "none";
            if (coverId === 14 || coverId === 44 || coverId === 46 || coverId === 21) {
                domElement.style.background = "#ffffff";
            }
        };
        realImg.onerror = () => {
            realImg.style.display = "none";
            fallbackCont.style.display = "flex";
        };
        
        const coverId = book.coverId;
        const ext = (coverId === 14 || coverId === 22 || coverId === 15 || coverId === 44 || coverId === 34) ? 'png' : 'jpg';
        if (coverId === 14 || coverId === 44 || coverId === 46 || coverId === 21) {
            realImg.style.objectFit = "contain";
        } else {
            realImg.style.objectFit = "cover";
        }
        const imgName = coverId === 44 ? `book_cover_${coverId}_v3` : `book_cover_${coverId}`;
        realImg.src = `images/${imgName}.${ext}?v=1.3.6`;
    }
}

function renderTechniques() {
    const container = document.getElementById("techniques-grid");
    if(!container) return;
    container.innerHTML = "";
    techniques.forEach(tech => {
        let booksText = "준비중";
        if(typeof books !== 'undefined') {
            const matchedBooks = books.filter(b => b.technique && b.technique.includes(tech.name.split(" ")[0]));
            if(matchedBooks.length > 0) {
                booksText = matchedBooks.map(b => b.title).join(", ");
            }
        }
        
        // 난이도 판별
        let difficulty = "초급";
        let difficultyClass = "badge-difficulty-low";
        let diffIcon = "fa-circle";
        
        const advancedTechs = ["lincoln", "leadership", "panel"];
        const intermediateTechs = ["procon", "socratic", "panorama", "digital", "reason"];
        
        if (advancedTechs.includes(tech.id)) {
            difficulty = "고급";
            difficultyClass = "badge-difficulty-high";
            diffIcon = "fa-circle-dot";
        } else if (intermediateTechs.includes(tech.id) || (tech.tags && tech.tags.includes("논리강화"))) {
            difficulty = "중급";
            difficultyClass = "badge-difficulty-mid";
            diffIcon = "fa-circle-half-stroke";
        }

        // 소요 시간 텍스트 정리
        let durationText = tech.time ? tech.time.split(" ")[0] : "40분";
        
        container.innerHTML += `
            <div class="technique-card" onclick="openModal('tech', '${tech.id}')" data-difficulty="${difficulty}" data-tags="${(tech.tags || []).join(",")}" data-name="${tech.name}" data-concept="${tech.concept}">
                <div class="tech-header">
                    <div class="tech-icon-wrapper">
                        <i class="fa-solid ${tech.icon}"></i>
                    </div>
                </div>
                <h3 style="margin-top:14px; font-size:1.15rem; color:var(--text-primary); font-family:var(--font-sans); font-weight:700;">${tech.name}</h3>
                <div class="tech-tags" style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">
                    ${(tech.tags || []).map(tag => `<span class="tech-tag">${tag}</span>`).join("")}
                </div>
                <p class="tech-desc">${tech.concept}</p>
                <div class="tech-footer" style="margin-top:auto; padding-top:14px; border-top:1px dashed var(--border-color); display:flex; justify-content:space-between; align-items:center;">
                    <span class="tech-matching-book" style="font-size:0.8rem; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;">
                        <i class="fa-solid fa-book" style="margin-right: 4px; color:var(--accent-coral);"></i> ${booksText}
                    </span>
                    <span class="tech-more-btn" style="font-size:0.85rem; font-weight:700; color:var(--accent-coral); white-space:nowrap;">
                        더보기 <i class="fa-solid fa-arrow-right"></i>
                    </span>
                </div>
            </div>
        `;
    });
}

function renderTheory() {
    const container = document.getElementById("theory-grid");
    if(!container || typeof debateTheory === 'undefined') return;
    container.innerHTML = "";
    debateTheory.sections.forEach(sec => {
        container.innerHTML += `
            <div class="theory-card">
                <div class="theory-icon-wrapper">
                    <i class="fa-solid ${sec.icon}"></i>
                </div>
                <h3>${sec.title}</h3>
                <p class="theory-content">${sec.content}</p>
                ${sec.keyPoints ? `
                    <ul class="theory-points">
                        ${sec.keyPoints.map(kp => `<li><strong>${kp.label}:</strong> ${kp.desc}</li>`).join("")}
                    </ul>
                ` : ''}
            </div>
        `;
    });
}

function renderBooks() {
    const container = document.getElementById("books-grid");
    if(!container || typeof books === 'undefined') return;
    container.innerHTML = "";
    books.forEach((book, idx) => {
        const card = document.createElement("div");
        card.className = "book-card";
        card.onclick = () => openModal('book', idx);
        
        const designInner = document.createElement("div");
        designInner.className = "book-design-inner";
        designInner.style.background = book.gradient || 'var(--accent-coral)';
        
        const titleSpan = document.createElement("span");
        titleSpan.className = "book-design-title";
        titleSpan.innerText = book.title;
        
        const iconI = document.createElement("i");
        iconI.className = `fa-solid ${book.icon || 'fa-book'} book-design-icon`;
        
        designInner.appendChild(titleSpan);
        designInner.appendChild(iconI);
        
        const infoDiv = document.createElement("div");
        infoDiv.className = "book-info";
        infoDiv.innerHTML = `
            <h4>${book.title}</h4>
            <p>${book.author}</p>
            <div style="margin-top:8px;">
                ${(book.tags || []).map(t => `<span class="tech-tag">${t}</span>`).join("")}
            </div>
        `;
        
        const bookDesign = document.createElement("div");
        bookDesign.className = "book-design";
        bookDesign.appendChild(designInner);
        
        card.appendChild(bookDesign);
        card.appendChild(infoDiv);
        container.appendChild(card);
        
        // Fetch real cover
        fetchRealCover(book.title, designInner);
    });
}

function renderArchive() {
    const container = document.getElementById("archive-grid");
    if(!container || typeof worksheets === 'undefined') return;
    container.innerHTML = "";
    worksheets.forEach(ws => {
        let btnClass = "btn-primary";
        let iconHtml = `<i class="fa-solid ${ws.icon}"></i>`;
        
        if(ws.icon && ws.icon.includes('file-pdf')) {
            btnClass = "btn-secondary";
            iconHtml = `<i class="fa-regular fa-file-pdf" style="color: #E01918;"></i>`;
        } else if(ws.icon && ws.icon.includes('file-powerpoint')) {
            iconHtml = `<i class="fa-regular fa-file-powerpoint" style="color: #D24726;"></i>`;
        } else if(ws.icon && ws.icon.includes('file-word')) {
            iconHtml = `<i class="fa-regular fa-file-word" style="color: #2B579A;"></i>`;
        }

        let category = "theory";
        if (ws.title.includes("[활동지]") || ws.title.includes("[대본]") || ws.title.includes("무드미터")) {
            category = "sheet";
        } else if (ws.title.includes("[수업자료]") && ws.title.includes(".pptx")) {
            category = "ppt";
        } else if (ws.title.includes("[자료]") || ws.title.includes("[수업자료]")) {
            category = "theory";
        }

        container.innerHTML += `
            <div class="archive-card" data-category="${category}">
                <div style="font-size: 2.5rem; margin-bottom: 15px;">
                    ${iconHtml}
                </div>
                <h4 style="margin-bottom: 10px; font-size: 1.1rem; color: var(--text-primary);">${ws.title}</h4>
                <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5;">${ws.desc}</p>
                <a href="${ws.link}" class="btn ${btnClass}" style="width: 100%; text-align: center;"><i class="fa-solid fa-download"></i> 다운로드</a>
            </div>
        `;
    });
}

function setupModal() {
    const modal = document.getElementById("detail-modal");
    const closeBtn = document.getElementById("modal-close");
    if(!modal || !closeBtn) return;
    
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
    });
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });
}

window.openModal = function(type, key) {
    const modal = document.getElementById("detail-modal");
    const modalBody = document.getElementById("modal-body");
    if(!modal || !modalBody) return;
    
    modalBody.innerHTML = "";
    
    if (type === "tech") {
        const tech = techniques.find(t => t.id === key);
        if (!tech) return;
        
        let booksHTML = "";
        if(typeof books !== 'undefined') {
            const matchedBooks = books.filter(b => b.technique && b.technique.includes(tech.name.split(" ")[0]));
            matchedBooks.forEach(book => {
                booksHTML += `
                    <div class="modal-book-layout" style="display:flex; gap:16px; margin-bottom:16px;">
                        <div class="book-design-inner modal-book-design" style="background: ${book.gradient || 'var(--accent-coral)'}; width:120px; height:162px; position:relative;" id="modal-cover-${book.title.replace(/\s/g,'')}">
                            <span class="book-design-title" style="font-size:0.85rem;">${book.title}</span>
                            <i class="fa-solid ${book.icon || 'fa-book'} book-design-icon" style="font-size:1.5rem;"></i>
                        </div>
                        <div class="modal-book-detail">
                            <h5>${book.title}</h5>
                            <p class="author">${book.author}</p>
                            <p style="font-size: 0.9rem; color:var(--text-secondary); line-height: 1.6;">${book.summary}</p>
                            <div style="display:flex; gap:10px; margin-top:12px;">
                                <button class="btn btn-secondary" onclick="openModal('book', ${books.indexOf(book)})" style="padding:6px 16px; font-size:0.8rem;"><i class="fa-solid fa-arrow-right"></i> 책 상세 보기</button>
                                <a href="${encodeURI(book.youtube || '#')}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" class="btn btn-youtube" style="display:inline-flex; align-items:center; gap:6px; padding:6px 16px; font-size:0.8rem;"><i class="fa-brands fa-youtube"></i> 유튜브 보기</a>
                            </div>
                        </div>
                    </div>
                `;
                setTimeout(() => {
                    const el = document.getElementById(`modal-cover-${book.title.replace(/\s/g,'')}`);
                    if(el) fetchRealCover(book.title, el);
                }, 0);
            });
        }
        
        let stepsHTML = "";
        if (tech.steps && tech.steps.length > 0) {
            stepsHTML = `
                <div class="modal-section" style="margin-bottom:20px;">
                    <h4><i class="fa-solid fa-list-ol"></i> 진행 단계 (시간)</h4>
                    <div style="display:flex; flex-direction:column; gap:14px; margin-top:10px;">
                        ${tech.steps.map((step, sIdx) => `
                            <div style="background-color: var(--bg-secondary); padding:16px; border-radius:12px; border-left:4px solid var(--accent-coral); display:flex; gap:12px; align-items:flex-start;">
                                <span style="background-color: var(--accent-coral); color:white; width:24px; height:24px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-weight:700; font-size:0.85rem; flex-shrink:0;">${sIdx + 1}</span>
                                <div>
                                    <strong style="color:var(--text-primary); font-size:0.95rem; display:block; margin-bottom:4px;">${step.title}</strong>
                                    <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.5;">${step.desc}</p>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `;
        }

        let tipsHTML = "";
        if (tech.tips && tech.tips.length > 0) {
            tipsHTML = `
                <div class="modal-section" style="margin-bottom:20px; background-color:rgba(138, 168, 161, 0.1); padding:20px; border-radius:12px; border:1px solid rgba(138, 168, 161, 0.3);">
                    <h4 style="color:var(--accent-sage);"><i class="fa-solid fa-lightbulb"></i> 진행 팁 및 주의사항</h4>
                    <ul style="margin-top:10px; padding-left:20px; font-size:0.9rem; color:var(--text-primary); line-height:1.6;">
                        ${tech.tips.map(tip => `<li style="margin-bottom:8px;">${tip}</li>`).join("")}
                    </ul>
                </div>
            `;
        }
        
        let teacherScenarioHTML = "";
        if (tech.teacherScenario) {
            teacherScenarioHTML = `
                <div class="modal-section" style="margin-bottom:20px; background-color:rgba(112, 138, 111, 0.05); padding:20px; border-radius:16px; border:1px solid rgba(112, 138, 111, 0.2);">
                    <h4 style="color:var(--accent-sage); margin-bottom:12px;"><i class="fa-solid fa-chalkboard-user"></i> 교사 가상 시나리오 (수업 발문)</h4>
                    <div style="font-size:0.9rem; line-height:1.6; color:var(--text-primary); display:flex; flex-direction:column; gap:12px;">
                        <div>
                            <strong style="color:var(--accent-sage); display:block; margin-bottom:4px;"><i class="fa-solid fa-play"></i> 도입 (활동 안내)</strong>
                            <p style="margin:0; background:var(--bg-primary); padding:12px; border-radius:8px; border:1px solid var(--border-color); font-style:italic; line-height:1.5;">"${tech.teacherScenario.intro}"</p>
                        </div>
                        <div>
                            <strong style="color:var(--accent-sage); display:block; margin-bottom:4px;"><i class="fa-solid fa-stop"></i> 정리 (활동 마무리)</strong>
                            <p style="margin:0; background:var(--bg-primary); padding:12px; border-radius:8px; border:1px solid var(--border-color); font-style:italic; line-height:1.5;">"${tech.teacherScenario.wrapUp}"</p>
                        </div>
                    </div>
                </div>
            `;
        }

        let scriptHTML = "";
        if (tech.script) {
            scriptHTML = `
                <div class="modal-section" style="margin-bottom:20px;">
                    <h4><i class="fa-regular fa-comment-dots" style="color:var(--accent-coral);"></i> 가상 스크립트 (시뮬레이션)</h4>
                    <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;">
                        그림책 <strong>${tech.script.book}</strong>을 활용한 가상 스크립트입니다.
                    </p>
                    <div class="debate-script-container" style="display:flex; flex-direction:column; gap:12px; margin-top:10px; background-color:var(--bg-secondary); padding:20px; border-radius:16px; border:1px solid var(--border-color);">
                        ${tech.script.dialog.map(d => {
                            let icon = "fa-user-graduate";
                            let color = "var(--text-primary)";
                            let bgColor = "var(--bg-primary)";
                            let border = "none";
                            
                            if (d.role.includes("교사") || d.role.includes("사회자")) {
                                icon = "fa-chalkboard-user";
                                color = "var(--accent-sage)";
                                bgColor = "rgba(112, 138, 111, 0.08)";
                                border = "1px solid rgba(112, 138, 111, 0.2)";
                            } else if (d.role.includes("찬성") || d.role.includes("Pro")) {
                                icon = "fa-circle-check";
                                color = "var(--accent-coral)";
                                bgColor = "rgba(224, 122, 95, 0.06)";
                            } else if (d.role.includes("반대") || d.role.includes("Con")) {
                                icon = "fa-circle-xmark";
                                color = "var(--accent-navy)";
                                bgColor = "rgba(44, 62, 80, 0.06)";
                            }
                            
                            return `
                                <div style="display:flex; gap:12px; align-items:flex-start; padding:12px; background-color:${bgColor}; border-radius:12px; border:${border};">
                                    <div style="background-color:white; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                                        <i class="fa-solid ${icon}" style="color:${color}; font-size:1.1rem;"></i>
                                    </div>
                                    <div style="flex-grow:1;">
                                        <span style="display:block; font-size:0.8rem; font-weight:700; color:${color}; margin-bottom:4px;">${d.role}</span>
                                        <p style="font-size:0.9rem; color:var(--text-primary); line-height:1.5;">${d.text}</p>
                                    </div>
                                </div>
                            `;
                        }).join("")}
                    </div>
                </div>
            `;
        }
        
        modalBody.innerHTML = `
            <div class="modal-tech-view">
                <div style="text-align:center; margin-bottom:24px;">
                    <i class="fa-solid ${tech.icon}" style="font-size:3rem; color:var(--accent-coral); margin-bottom:16px;"></i>
                    <h3 style="font-size:1.8rem; margin-bottom:8px;">${tech.name}</h3>
                    <div class="tech-tag-container" style="justify-content:center; margin-bottom:16px;">
                        ${(tech.tags || []).map(tag => `<span class="tech-tag">${tag}</span>`).join("")}
                    </div>
                </div>
                
                <div class="modal-section" style="margin-bottom:20px;">
                    <h4><i class="fa-solid fa-lightbulb"></i> 핵심 개념</h4>
                    <p style="font-size:0.95rem; line-height:1.6; color:var(--text-primary);">${tech.concept}</p>
                </div>
                
                <div class="modal-section" style="margin-bottom:20px;">
                    <h4><i class="fa-solid fa-star"></i> 학습 효과</h4>
                    <p style="font-size:0.95rem; line-height:1.6; color:var(--text-primary);">${tech.effect}</p>
                </div>
                
                ${tipsHTML}
                ${stepsHTML}
                ${scriptHTML}
                ${teacherScenarioHTML}
                
                <div class="modal-section" style="border-bottom:none;">
                    <h4><i class="fa-solid fa-circle-check"></i> 추천 그림책</h4>
                    ${booksHTML}
                </div>
            </div>
        `;
    } else if (type === "book") {
        const book = books[key];
        if (!book) return;
        
        const matchedTech = book.technique ? (
            techniques.find(t => t.name.trim() === book.technique.trim()) ||
            techniques.find(t => book.technique.includes(t.name)) ||
            techniques.find(t => t.name.includes(book.technique)) ||
            techniques.find(t => book.technique.includes(t.name.split(" ")[0])) ||
            techniques[0]
        ) : techniques[0];
        
        modalBody.innerHTML = `
            <div class="modal-tech-view">
                <div style="display:flex; gap:24px; align-items:center; margin-bottom:24px; border-bottom:1px solid var(--border-color); padding-bottom:24px;">
                    <div class="book-design-inner" style="background: ${book.gradient || 'var(--accent-coral)'}; width:132px; height:180px; flex-shrink:0; position:relative;" id="modal-cover2-${book.title.replace(/\s/g,'')}">
                        <span class="book-design-title" style="font-size:0.8rem;">${book.title}</span>
                        <i class="fa-solid ${book.icon || 'fa-book'} book-design-icon" style="font-size:1.4rem;"></i>
                    </div>
                    <div>
                        <h3 style="font-size:1.5rem; margin-bottom:8px;">${book.title}</h3>
                        <p style="color:var(--text-secondary); margin-bottom:12px;">${book.author}</p>
                        <div class="tech-tag-container">
                            ${(book.tags || []).map(tag => `<span class="tech-tag">${tag}</span>`).join("")}
                        </div>
                    </div>
                </div>
                
                <div class="modal-section" style="margin-bottom:20px;">
                    <h4><i class="fa-solid fa-book-open"></i> 그림책 줄거리</h4>
                    <p style="font-size:0.95rem; line-height:1.6;">${book.summary}</p>
                    <a href="${encodeURI(book.youtube || '#')}" target="_blank" rel="noopener noreferrer" class="btn btn-youtube" style="margin-top: 16px; display: inline-flex; align-items: center; gap: 8px;"><i class="fa-brands fa-youtube"></i> 유튜브로 그림책 읽기</a>
                </div>
                
                <div class="modal-section" style="margin-bottom:20px;">
                    <h4><i class="fa-solid fa-comments"></i> 추천 토론 질문</h4>
                    <ul style="margin-top: 10px; padding-left: 20px; color: var(--text-primary); line-height: 1.8;">
                        ${book.debateTopics ? book.debateTopics.map(topic => `<li style="margin-bottom: 8px;">Q. ${topic}</li>`).join("") : '<li>추천 질문이 준비중입니다.</li>'}
                    </ul>
                </div>
                
                <div class="modal-section" style="margin-bottom:20px;">
                    <h4><i class="fa-solid fa-scale-balanced"></i> 추천 토론 논제</h4>
                    <ul style="margin-top: 10px; padding-left: 20px; color: var(--text-primary); line-height: 1.8;">
                        ${book.debatePropositions ? book.debatePropositions.map(prop => `<li style="margin-bottom: 8px; font-weight: 500;"><i class="fa-solid fa-chevron-right" style="font-size:0.8rem; color:var(--accent-coral); margin-right:6px;"></i> ${prop}</li>`).join("") : '<li>추천 논제가 준비중입니다.</li>'}
                    </ul>
                </div>
                
                <div class="modal-section" style="border-bottom:none;">
                    <h4><i class="fa-solid fa-comments"></i> 추천 토론 기법</h4>
                    <div style="background-color: var(--bg-secondary); border-radius:16px; padding:20px; border-left:4px solid var(--accent-sage);">
                        <h5 style="font-size: 1.15rem; font-family:var(--font-sans); color: var(--text-primary); margin-bottom:8px;">${matchedTech.name}</h5>
                        <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.6; margin-bottom:12px;">${matchedTech.concept}</p>
                        <button class="btn btn-primary" onclick="openModal('tech', '${matchedTech.id}')" style="padding:6px 16px; font-size:0.8rem;"><i class="fa-solid fa-arrow-right"></i> 기법 상세 보기</button>
                    </div>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            const el = document.getElementById(`modal-cover2-${book.title.replace(/\s/g,'')}`);
            if(el) fetchRealCover(book.title, el);
        }, 0);
    }
    
    modal.classList.add("active");
};

function setupArchiveSearch() {
    const archiveSearchInput = document.getElementById("archive-search-input");
    const clearArchiveBtn = document.getElementById("clear-archive-search");
    const archiveFilters = document.querySelectorAll(".archive-filter-btn");

    if(!archiveSearchInput) return;

    let currentFilter = "all";

    function doSearch() {
        executeArchiveSearch(archiveSearchInput.value, currentFilter);
    }

    archiveSearchInput.addEventListener("input", doSearch);
    
    if(clearArchiveBtn) {
        clearArchiveBtn.addEventListener("click", () => {
            archiveSearchInput.value = "";
            doSearch();
        });
    }

    archiveFilters.forEach(btn => {
        btn.addEventListener("click", () => {
            archiveFilters.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            doSearch();
        });
    });
}

function executeArchiveSearch(query, filter) {
    const q = query.toLowerCase();
    
    const cards = document.querySelectorAll('#archive-grid .archive-card');
    cards.forEach(card => {
        const title = card.querySelector('h4').innerText.toLowerCase();
        const desc = card.querySelector('p').innerText.toLowerCase();
        const matchesQuery = title.includes(q) || desc.includes(q);
        
        const cardCategory = card.dataset.category;
        const matchesFilter = (filter === 'all') || (cardCategory === filter);
        
        card.style.display = (matchesQuery && matchesFilter) ? 'block' : 'none';
    });
}

// ── 인터랙티브 토론 설계 헬퍼 및 열두 달 커리큘럼 조회 기능 ──────────────────────────
function setupHelper() {
    // 1. Tab navigation inside helper
    const tabSituation = document.getElementById("tab-helper-situation");
    const tabMonthly = document.getElementById("tab-helper-monthly");
    const formSituation = document.getElementById("helper-situation-form");
    const formMonthly = document.getElementById("helper-monthly-form");
    const output = document.getElementById("generated-guide-output");

    if (tabSituation && tabMonthly && formSituation && formMonthly) {
        tabSituation.addEventListener("click", () => {
            tabSituation.style.color = "var(--accent-coral)";
            tabSituation.style.borderBottom = "3px solid var(--accent-coral)";
            tabMonthly.style.color = "var(--text-secondary)";
            tabMonthly.style.borderBottom = "3px solid transparent";
            
            formSituation.style.display = "block";
            formMonthly.style.display = "none";
            if (output) output.classList.add("hidden");
        });

        tabMonthly.addEventListener("click", () => {
            tabMonthly.style.color = "var(--accent-coral)";
            tabMonthly.style.borderBottom = "3px solid var(--accent-coral)";
            tabSituation.style.color = "var(--text-secondary)";
            tabSituation.style.borderBottom = "3px solid transparent";

            formSituation.style.display = "none";
            formMonthly.style.display = "block";
            if (output) output.classList.add("hidden");
        });
    }

    // 2. Month selection grid
    const monthButtons = document.querySelectorAll(".month-btn");
    let selectedMonth = "3"; // default March
    monthButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            monthButtons.forEach(b => {
                b.style.backgroundColor = "var(--bg-secondary)";
                b.style.color = "var(--text-primary)";
                b.style.borderColor = "var(--border-color)";
            });
            btn.style.backgroundColor = "var(--accent-coral)";
            btn.style.color = "white";
            btn.style.borderColor = "var(--accent-coral)";
            selectedMonth = btn.dataset.month;
        });
    });

    // Styling month buttons originally (ensure nice visual feedback)
    monthButtons.forEach(btn => {
        if (btn.dataset.month === selectedMonth) {
            btn.style.backgroundColor = "var(--accent-coral)";
            btn.style.color = "white";
            btn.style.borderColor = "var(--accent-coral)";
        } else {
            btn.style.backgroundColor = "var(--bg-secondary)";
            btn.style.color = "var(--text-primary)";
            btn.style.borderColor = "var(--border-color)";
            btn.style.padding = "8px 0";
            btn.style.border = "1px solid var(--border-color)";
            btn.style.borderRadius = "8px";
            btn.style.cursor = "pointer";
            btn.style.fontFamily = "inherit";
            btn.style.fontWeight = "600";
            btn.style.transition = "all 0.2s";
        }
    });

    // 3. Situation Guide Generator
    const btnGenerate = document.getElementById("btn-generate-guide");
    if (btnGenerate && output) {
        btnGenerate.addEventListener("click", () => {
            const target = document.getElementById("helper-target").value;
            const goal = document.getElementById("helper-goal").value;

            let targetText = "";
            let goalText = goal === 'empathy' ? '공감과 관계 성찰' : goal === 'logical' ? '논리적인 의사결정' : goal === 'social' ? '사회 문제 및 가치관' : '쉽고 재미있는 토론 입문';
            
            if (target === 'low') targetText = '초등 저학년';
            else if (target === 'mid') targetText = '초등 중고학년';
            else if (target === 'middle') targetText = '중학생';
            else if (target === 'high') targetText = '고등학생';

            if (target === 'middle' || target === 'high') {
                let secondaryData = {};
                if (target === 'middle') {
                    secondaryData = {
                        title: `중학생 추천 그림책 3선 (${goalText})`,
                        tip: "중학생 단계의 핵심 교육 목표는 <strong>'윤리적 탐구(Ethical Inquiry)'</strong>입니다. 사춘기 또래 집단의 소속감과 타인의 시선에 극도로 예민한 중학생들에게는 교사의 일방적인 훈계(교화)를 지양해야 합니다. 동등한 토론의 촉진자로서 <strong>'자기수정적 질문'</strong>(예: \"친구의 반박을 듣고 생각이 달라졌나요?\", \"내 의견을 보완하려면 어떻게 고쳐야 할까요?\")을 던져 스스로 생각을 다듬어가는 쾌감을 느끼게 하는 지도법이 핵심입니다.",
                        colorTheme: "var(--accent-sage)",
                        accentClass: "rgba(112, 138, 111, 0.08)",
                        books: []
                    };
                    
                    if (goal === 'empathy') {
                        secondaryData.books = [
                            { title: "착한 달걀", author: "조리 존", topic: "진짜 내 소원, 착한 아이 증후군, 루소의 교육관", desc: "타인의 기대와 압박 속에서 '착한 역할'만 하려다 금이 간 달걀의 이야기를 통해, 내면의 건강한 경계를 세우고 나를 돌보는 성찰을 나눕니다." },
                            { title: "나는 강물처럼 말해요", author: "조던 스콧 글, 시드니 스미스 그림", topic: "신체적 콤플렉스 극복, 자아 수용과 공감", desc: "말더듬증을 앓는 소년의 좌절을 물결치며 묵묵히 흐르는 강물의 흐름에 빗대어, 자신의 약점을 수용하고 타인의 아픔에 깊이 공감하는 심오한 위로를 전합니다." },
                            { title: "초코곰과 젤리곰", author: "얀 케비 (Yann Kebbi) 글/그림", topic: "다름에 대한 이해, 편견 극복과 연대", desc: "외모와 질감의 태생적 다름에도 불구하고 두 곰이 우정을 쌓아가는 모험을 통해, 차별과 편견의 벽을 허물고 공존하는 관계의 중요성을 나눕니다." }
                        ];
                    } else if (goal === 'logical') {
                        secondaryData.books = [
                            { title: "내 탓이 아니야", author: "레이프 크리스티안손", topic: "집단 방관자 효과, 개인의 도덕적 책임", desc: "괴롭힘당하는 아이를 방관하며 책임을 회피하는 독백을 통해, '방관한 집단의 잘못은 어디까지인가'에 대해 윤리적이고 논리적인 판단을 세우는 토론을 벌입니다." },
                            { title: "아름다운 실수", author: "코리나 루켄", topic: "실패의 창조적 재구성, 과정 중심의 삶", desc: "실수 하나로 인생이 무너질 것 같은 완벽주의 강박에서 벗어나, 실수로 번진 얼룩이 상상력을 거쳐 더 큰 아름다움으로 승화되는 과정을 보여줍니다." },
                            { title: "샌지와 빵집 주인", author: "로빈 트와디 글", topic: "소유권의 한계, 공유 자산의 정의", desc: "빵의 맛있는 냄새를 공짜로 맡았다고 기소된 재판 이야기를 통해, 무형 공유 자산의 권리와 물질적 소유욕의 한계를 논박합니다." }
                        ];
                    } else if (goal === 'social') {
                        secondaryData.books = [
                            { title: "돼지책", author: "앤서니 브라운", topic: "가족 내 독박 노동, 양성평등과 공정", desc: "가사 분담을 당연시하던 세 남자가 돼지로 변하는 풍자를 통해, 가족 내 성평등과 공정, 그리고 배려의 가치를 사회학적으로 탐색합니다." },
                            { title: "꽃을 선물할게", author: "강경수 글/그림", topic: "강자와 약자의 공존, 생태적 정의", desc: "거미줄에 걸린 애벌레를 구하는 것이 과연 거미의 생존권을 해치는 부당한 자비인지에 대해 질문하며, 생태계 법칙과 윤리적 공존을 토론합니다." },
                            { title: "30번 곰", author: "지경애 글/그림", topic: "기후 위기, 서식지 파괴, 동물권", desc: "기후 변화로 터전을 잃은 북극곰을 도시의 반려동물로 길들이는 설정을 통해, 기후 재난과 인간 중심적 환경 극복의 모순을 고발합니다." }
                        ];
                    } else { // fun
                        secondaryData.books = [
                            { title: "세 강도", author: "토미 웅거러 글/그림", topic: "도덕적 딜레마, 수단의 정당성 (의적 행위)", desc: "훔친 보물로 불우한 아이들을 구휼한 세 강도의 행위를 두고, 수단의 도덕성과 목적의 정당성을 쉬운 찬반 구도로 나눕니다." },
                            { title: "으르렁 이발소", author: "염혜원 글/그림", topic: "자녀의 결정권, 부모의 통제와 개성", desc: "헤어스타일을 마음대로 결정하려는 사자 아빠와 아들의 대립을 통해, 부모의 양육적 강요와 아동의 자기결정권 충돌을 재미있게 다룹니다." },
                            { title: "터널", author: "앤서니 브라운", topic: "형제 갈등과 관계 회복, 가족애", desc: "영리한 오빠 잭과 무서움 많은 동생 로즈의 티김태김 충돌에서 시작하여, 동생이 오빠를 구하려 어둠과 위험 속으로 뒤어드는 이야기를 통해, 형제 갈등이 외면의 대립이 아닌 내면의 사랑임을 논바합니다." }
                        ];
                    }
                } else { // high
                    secondaryData = {
                        title: `고등학생 추천 그림책 3선 (${goalText})`,
                        tip: "고등학생들에게는 철학적 깊이를 주어 입시 스트레스 및 진로, 관계, 자아에 대한 진지한 고뇌를 다루어야 합니다. 이들은 이미 문자 언어에 익숙하므로 <strong>VTS(Visual Thinking Strategies) 발문</strong>(예: \"작가가 왜 이 장면에 이 색채를 썼을까?\", \"인물의 배치를 왜 좌측에서 우측으로 바꿨을까?\")을 통해 시각적 디자인 문법과 은유를 해독하고 고차원적 비판 사고를 발휘하도록 돕는 것이 핵심입니다.",
                        colorTheme: "var(--accent-coral)",
                        accentClass: "rgba(224, 122, 95, 0.08)",
                        books: []
                    };
                    
                    if (goal === 'empathy') {
                        secondaryData.books = [
                            { title: "빨간 나무", author: "숀 탠", topic: "실존주의적 고독, 현대인의 우울과 희망", desc: "입시 스트레스와 미래에 대한 극심한 불안으로 말로 표현하기 어려운 고독을 숀 탠 특유의 초현실주의 작화로 들여다보고, 결국 피어오르는 빨간 나무를 통해 희망을 포착합니다." },
                            { title: "아름다운 실수", author: "코리나 루켄", topic: "실패의 창조적 재구성, 과정 중심의 삶", desc: "실수 하나로 인생이 무너질 것 같은 완벽주의 강박에 시달리는 고등학생들에게, 실수로 번진 얼룩이 상상력을 거쳐 더 큰 아름다움으로 승화되는 과정을 통해 실패를 긍정하는 법을 제안합니다." },
                            { title: "나는 강물처럼 말해요", author: "조던 스콧 글", topic: "신체적 콤플렉스 극복, 자아 수용", desc: "말더듬증을 앓는 소년의 좌절을 물결치며 묵묵히 흐르는 강물의 자연스러운 흐름에 빗대어, 자신의 약점을 있는 그대로 수용하는 심오한 위로를 전합니다." }
                        ];
                    } else if (goal === 'logical') {
                        secondaryData.books = [
                            { title: "낱말공장 나라", author: "아녜스 드 레스트라드", topic: "언어의 계급화, 자본주의와 불평등", desc: "돈으로 단어를 사서 삼켜야 말을 할 수 있는 디스토피아적 가상 국가를 통해, 자본주의의 소유 구조와 언어마저 양극화되는 불평등을 고발하고 비판적으로 사유합니다." },
                            { title: "지각대장 존", author: "존 버닝햄 글/그림", topic: "권위주의 비판, 교육의 본질과 신뢰", desc: "학생의 진실한 해명을 한낱 거짓말로 치부하는 교사의 편견을 다루어, 교육 제도의 모순과 권위자가 저지르는 독단적인 권력 남용의 논리적 오류를 분석합니다." },
                            { title: "원숭이 꽃신", author: "소설/동화 원작", topic: "종속적 관계, 자본과 기술적 지배", desc: "오소리에게 꽃신을 길들여 자유를 빼앗고 지배하는 원숭이의 계략을 통해, 현대 자본주의 플랫폼 비즈니스나 대기업-중소기업의 종속 구조를 논박합니다." }
                        ];
                    } else if (goal === 'social') {
                        secondaryData.books = [
                            { title: "내가 라면을 먹을 때", author: "하세가와 요시후미", topic: "세계시민 의식, 글로벌 불평등과 연대", desc: "지구촌 반대편에서 아동 노동과 가난에 시달리는 아이들의 삶을 동시간대로 보여주어, 평화로운 일상 속에서 세계시민으로서 져야 할 도덕적 의무와 공동 책임을 깨닫게 합니다." },
                            { title: "우리, 집", author: "진경", topic: "제도적 배제, 동물원 비판과 소수자 인권", desc: "인간의 유희를 위해 지어진 '우리'에 갇힌 동물의 관점을 통해, 다수자의 편의를 위해 소수자를 배제하고 감금하는 사회적 시스템의 폭력성을 날카롭게 지적합니다." },
                            { title: "30번 곰", author: "지경애 글/그림", topic: "기후 위기, 서식지 파괴, 동물권", desc: "기후 변화로 터전을 잃은 북극곰을 도시의 반려동물로 길들이는 설정을 통해, 기후 재난과 인간 중심적 환경 극복의 모순을 고발합니다." }
                        ];
                    } else { // fun
                        secondaryData.books = [
                            { title: "돼지책", author: "앤서니 브라운 글/그림", topic: "가족 내 독박 노동, 양성평등과 공정", desc: "가사 분담을 당연시하던 세 남자가 돼지로 변하는 풍자를 통해, 가족 내 성평등과 공정, 그리고 배려의 가치를 사회학적으로 탐색합니다." },
                            { title: "슈퍼 거북", author: "유설화 글/그림", topic: "타인의 시선과 기대, 참된 자아의 속도", desc: "억지로 빠른 삶에 맞추느라 고통받는 거북이 꾸물이의 이야기를 통해, 주변의 영웅 대우나 사회적 성공 지표에 자신을 우겨넣는 강박에서 벗어나 진짜 내 속도를 찾는 과정을 유쾌하게 성찰합니다." },
                            { title: "원숭이 꽃신", author: "정휘창 글, 송아 그림", topic: "종속적 관계, 자본과 기술적 지배", desc: "오소리에게 꽃신을 길들여 자유를 빼앗고 지배하는 원숭이의 계략을 통해, 현대 자본주의 플랫폼 비즈니스나 대기업-중소기업의 종속 구조를 논박합니다." }
                        ];
                    }
                }

            let booksHTML = "";
                secondaryData.books.forEach(b => {
                    const mainBook = books.find(mb => mb.title === b.title);
                    const buttonHTML = mainBook 
                        ? `<button class="btn btn-secondary" onclick="openModal('book', ${books.indexOf(mainBook)})" style="padding:6px 12px; font-size:0.8rem; width:100%; text-align:center;"><i class="fa-solid fa-circle-info"></i> 책 상세 및 수업 팁</button>`
                        : `<span style="font-size:0.8rem; color:var(--text-secondary); display:block; padding:6px 0; font-style:italic;">* 상세 안내는 교육과정 가이드북 참조</span>`;

                    booksHTML += `
                        <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius:16px; padding:20px; display:flex; flex-direction:column; gap:12px; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                                <h4 style="font-size:1.15rem; color:var(--text-primary); margin:0; font-family:var(--font-serif); font-weight:700;">${b.title}</h4>
                                <span class="tech-tag" style="background-color:${secondaryData.colorTheme}; color:white; border:none; padding:4px 8px; font-size:0.75rem; border-radius:8px; flex-shrink:0;">${b.author}</span>
                            </div>
                            <p style="font-size:0.82rem; color:var(--accent-coral); font-weight:600; margin:0;"><i class="fa-solid fa-tags"></i> ${b.topic}</p>
                            <p style="font-size:0.86rem; color:var(--text-secondary); line-height:1.5; margin:0;">${b.desc}</p>
                            <div style="margin-top:auto; padding-top:12px; border-top:1px dashed var(--border-color);">
                                ${buttonHTML}
                            </div>
                        </div>
                    `;
                });

                output.innerHTML = `
                    <div style="background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 30px; box-shadow: var(--shadow-soft);">
                        <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px; border-bottom: 2px solid ${secondaryData.colorTheme}; padding-bottom:12px;">
                            <i class="fa-solid fa-graduation-cap" style="font-size:1.8rem; color:${secondaryData.colorTheme};"></i>
                            <h3 style="margin:0; font-size:1.4rem;">${secondaryData.title}</h3>
                        </div>
                        <div style="background-color:${secondaryData.accentClass}; padding:18px; border-radius:12px; border-left:4px solid ${secondaryData.colorTheme}; font-size:0.9rem; color:var(--text-primary); line-height:1.6; margin-bottom:20px;">
                            <i class="fa-solid fa-lightbulb" style="color:${secondaryData.colorTheme}; margin-right:6px;"></i> ${secondaryData.tip}
                        </div>
                        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
                            ${booksHTML}
                        </div>
                    </div>
                `;
            } else {
                let recBooks = [];
                if (target === 'low') {
                    if (goal === 'empathy') recBooks = ["틀려도 괜찮아", "나는 강물처럼 말해요", "초코곰과 젤리곰"];
                    else if (goal === 'logical') recBooks = ["감기 걸린 물고기", "터널", "토끼와 거북이, 두 번째 경주"];
                    else if (goal === 'social') recBooks = ["30번 곰", "돼지책", "까마귀 소년"];
                    else recBooks = ["슈퍼 거북", "세 강도", "알사탕"];
                } else {
                    if (goal === 'empathy') recBooks = ["꽃을 선물할게", "나는 사실대로 말했을 뿐이야!", "알사탕"];
                    else if (goal === 'logical') recBooks = ["지각대장 존", "원숭이 꽃신", "난 황금알을 낳을 거야!"];
                    else if (goal === 'social') recBooks = ["돼지책", "프레드릭", "마당을 나온 암탉"];
                    else recBooks = ["미어캣의 스카프", "샌지와 빵집 주인", "원숭이 꽃신"];
                }

                let booksHTML = "";
                recBooks.forEach(title => {
                    const b = books.find(item => item.title === title);
                    if (b) {
                        const matchedTech = b.technique ? (
                            techniques.find(t => t.name.trim() === b.technique.trim()) ||
                            techniques.find(t => b.technique.includes(t.name)) ||
                            techniques.find(t => t.name.includes(b.technique)) ||
                            techniques.find(t => b.technique.includes(t.name.split(" ")[0])) ||
                            techniques[0]
                        ) : techniques[0];
                        booksHTML += `
                            <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius:16px; padding:20px; display:flex; flex-direction:column; gap:12px; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                                    <h4 style="font-size:1.15rem; color:var(--text-primary); margin:0; font-family:var(--font-serif); font-weight:700;">${b.title}</h4>
                                    <span class="tech-tag" style="background-color:var(--accent-coral); color:white; border:none; padding:4px 8px; font-size:0.75rem; border-radius:8px; flex-shrink:0;">${matchedTech.name.split(" ")[0]}</span>
                                </div>
                                <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">작가: ${b.author}</p>
                                <p style="font-size:0.88rem; color:var(--text-primary); line-height:1.5; margin:0; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">${b.summary}</p>
                                <div style="margin-top:auto; padding-top:12px; border-top:1px dashed var(--border-color); display:flex; flex-direction:column; gap:8px;">
                                    <span style="font-size:0.82rem; font-weight:700; color:var(--accent-sage); line-height:1.4;">Q. ${b.debateTopics ? b.debateTopics[0] : '추천 논제 준비중'}</span>
                                    <button class="btn btn-secondary" onclick="openModal('book', ${books.indexOf(b)})" style="padding:6px 12px; font-size:0.8rem; width:100%; text-align:center; margin-top:4px;"><i class="fa-solid fa-circle-info"></i> 책 상세 및 수업 팁</button>
                                </div>
                            </div>
                        `;
                    }
                });

                output.innerHTML = `
                    <div style="background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 30px; box-shadow: var(--shadow-soft);">
                        <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px; border-bottom: 2px solid var(--accent-coral); padding-bottom:12px;">
                            <i class="fa-solid fa-wand-magic-sparkles" style="font-size:1.8rem; color:var(--accent-coral);"></i>
                            <h3 style="margin:0; font-size:1.4rem;">맞춤형 수업 설계 결과</h3>
                        </div>
                        <p style="font-size:0.95rem; color:var(--text-secondary); margin-bottom:20px;">
                            대상을 <strong>${targetText}</strong>으로 설정하고, <strong>${goalText}</strong> 목표에 초점을 맞춘 그림책 토론 추천 패키지입니다.
                        </p>
                        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
                            ${booksHTML}
                        </div>
                    </div>
                `;
            }
            output.classList.remove("hidden");
            output.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // 4. Monthly Curriculum Explorer
    const btnShowMonthly = document.getElementById("btn-show-monthly");
    if (btnShowMonthly && output) {
        const monthlyCurriculum = {
            "1": {
                theme: "자아와 주체성 (겨울방학 및 자기 탐색)",
                books: [
                    { title: "착한 달걀", author: "조리 존", tech: "하브루타 (Havruta)", topic: "공동체의 평화와 기대를 유지하기 위해 자신의 욕망과 피로를 숨기고 착한 행동을 강제하는 교육은 정당한가?" },
                    { title: "고슴도치 엑스", author: "노인경 글/그림", tech: "찬반패널토론", topic: "자신을 보호하기 위해 날카로운 가시(방어기제)를 세우는 행동은 대인관계 형성에 득보다 실이 많은가?" },
                    { title: "슈퍼 거북", author: "유설화 글/그림", tech: "브레인라이팅 (Brainwriting)", topic: "타인의 기대와 좋은 평판을 유지하기 위해 자신의 본성과 자유를 희생하는 삶은 가치 있는가?" }
                ]
            },
            "2": {
                theme: "성장과 회복 (학기말 마무리)",
                books: [
                    { title: "알사탕", author: "백희나 글/그림", tech: "소크라틱 세미나", topic: "아무에게도 털어놓지 못할 갈등과 고민을 안고 혼자서 전전긍긍하는 주인공의 마음을 헤아려 주는 행동은 가치 있는가?" },
                    { title: "강아지똥", author: "권정생 글, 정승각 그림", tech: "하브루타 (Havruta)", topic: "아무짝에도 쓸모없어 보이는 보잘것없는 존재라도 세상에 기여할 수 있는 고유한 가치를 지니고 있는가?" },
                    { title: "백만 번 산 고양이", author: "사노 요코 글/그림", tech: "소크라틱 세미나", topic: "자신의 편안함만 쫓아 이기적으로 사는 삶보다 타인을 뜨겁게 사랑하고 애도하는 삶이 가치 있는가?" }
                ]
            },
            "3": {
                theme: "새로운 시작과 약속 (신학기 적응)",
                books: [
                    { title: "으르렁 이발소", author: "염혜원 글/그림", tech: "핫시팅 (Hot-seating)", topic: "아이는 자신의 헤어스타일을 아빠의 결정에 전적으로 따라야 하는가?" },
                    { title: "틀려도 괜찮아", author: "마키타 신지 글", tech: "소크라틱 세미나", topic: "수업 시간에 발표는 가능한 한 자주 해야 하는가? (정답만 말해야 하는가?)" },
                    { title: "나는 강물처럼 말해요", author: "조던 스콧 글", tech: "핫시팅 (Hot-seating)", topic: "발표 수업에서 모든 학생에게 동일한 규칙과 발표 방식을 규정하는 것은 공정한가?" }
                ]
            },
            "4": {
                theme: "소통과 관계 (정직과 소문)",
                books: [
                    { title: "나는 사실대로 말했을 뿐이야!", author: "패트리샤 맥키삭 글", tech: "PMI 토론", topic: "남에게 상처가 되는 진실이라도 언제나 솔직하고 투명하게 말해야 하는가?" },
                    { title: "감기 걸린 물고기", author: "박정섭 글/그림", tech: "프로콘 (Pro-Con) 토론", topic: "가짜 뉴스로부터 공동체를 보호하기 위해 의심스러운 동료를 추방하는 것은 정당한가?" },
                    { title: "아낌없이 주는 나무", author: "쉘 실버스타인 글/그림", tech: "가치수직선 토론", topic: "나무의 조건 없는 일방적인 희생과 헌신은 소년의 자립과 진정한 행복을 위해 바람직한 사랑이었는가?" }
                ]
            },
            "5": {
                theme: "가족과 사랑 (어버이날 및 가족의 달)",
                books: [
                    { title: "할머니의 여름휴가", author: "안녕달 글/그림", tech: "소크라틱 세미나", topic: "홀로 계신 조부모님의 여가와 생활 돌봄은 자녀들이 의무적으로 챙겨드려야 하는가?" }
                ]
            },
            "6": {
                theme: "환경과 공존 (세계 환경의 날)",
                books: [
                    { title: "30번 곰", author: "지경애 글/그림", tech: "오픈 스페이스 (Open Space)", topic: "기후 위기로 서식지를 잃은 야생동물(북극곰)을 도시의 반려동물로 사육하는 것은 정당한가?" },
                    { title: "꽃을 선물할게", author: "강경수 글/그림", tech: "둘 가고 둘 남기 (2 Stay 2 Stray)", topic: "거미줄에 걸린 애벌레를 살려주는 자비가 거미의 생존권을 침해하는 부당한 개입인가?" }
                ]
            },
            "7": {
                theme: "친구와 우정 (학기 말 갈등 해결)",
                books: [
                    { title: "곰아, 놀자!", author: "존 버닝햄 글", tech: "회전목마 토론 (Carousel)", topic: "친구가 함께 놀자고 제안한 활동을 내가 하기 싫더라도 참고 함께해 주어야 하는가?" },
                    { title: "우리는 친구", author: "앤서니 브라운 글/그림", tech: "핫시팅 (Hot-seating)", topic: "평소 친한 친구가 화가 나서 폭력적인 돌발 행동을 하더라도 친구 관계를 지속해야 하는가?" }
                ]
            },
            "8": {
                theme: "자율성과 가치관 (여름방학 및 성장)",
                books: [
                    { title: "블랙 독", author: "레비 핀폴드 글/그림", tech: "이유찾기 토론", topic: "미지의 두려운 대상(검둥개)의 실체를 확인하기 위해 스스로 위험 속으로 나아가는 모험은 정당한가?" },
                    { title: "슈퍼 거북", author: "유설화 글/그림", tech: "브레인라이팅 (Brainwriting)", topic: "타인의 기대와 좋은 평판을 유지하기 위해 자신의 본성과 자유를 희생하는 삶은 가치 있는가?" }
                ]
            },
            "9": {
                theme: "다양성 이해와 존중 (2학기 시작)",
                books: [
                    { title: "초코곰과 젤리곰", author: "얀 케비 글/그림", tech: "하브루타 (Havruta)", topic: "집단 공동체의 안전과 평화를 위해 소수를 차별하는 불합리한 사회 규칙에 맹종해야 하는가?" },
                    { title: "돌멩이 국", author: "존 뮤스 글/그림", tech: "월드카페 (World Cafe)", topic: "이기적인 소유욕보다 타인에게 먼저 베풀고 헌신하는 나눔 교육이 현대 자본주의 사회에서 중요한가?" },
                    { title: "지각대장 존", author: "존 버닝햄 글/그림", tech: "프로콘 (Pro-Con) 토론", topic: "어른이나 권위자(교사)의 훈계는 항상 옳으며, 아이의 황당한 해명은 거짓으로 치부해야 하는가?" }
                ]
            },
            "10": {
                theme: "생명 존중과 권리 (세계 동물의 날)",
                books: [
                    { title: "나는 기다립니다", author: "세르주 블로크 글", tech: "소크라틱 세미나", topic: "반려동물을 끝까지 돌볼 수 있는지 사전 검증하고 법적으로 제한하는 '반려인 자격증제'를 도입해야 하는가?" },
                    { title: "탁탁, 톡톡, 음매~ 젖소가 편지를 쓴대요", author: "도린 크로닌 글", tech: "주도권 토론", topic: "노동 및 거주 환경 개선을 요구하며 농장주의 지시를 따르지 않는 젖소들의 파업 시위는 정당한가?" }
                ]
            },
            "11": {
                theme: "진정한 협력과 가치 (가을의 깊은 성찰)",
                books: [
                    { title: "프레드릭", author: "레오 리오니 글/그림", tech: "월드카페 (World Cafe)", topic: "물질적인 식량 마련 대신 공동체의 정신적 풍요를 위해 헌신한 예술가(프레드릭)도 식량을 배급받을 권리가 있는가?" },
                    { title: "원숭이 꽃신", author: "정휘창 글, 송아 그림", tech: "링컨-더글라스 1:1 디베이트", topic: "오소리가 꽃신에 길들여져 자유를 잃은 것처럼, 현대인이 대기업의 편리한 서비스에 종속되는 것은 자발적 노예화인가?" },
                    { title: "밴드 브레멘", author: "유설화 글/그림", tech: "가치수직선 토론", topic: "늙고 쓸모없어져 버려진 동물들이 연대하여 스스로 존재의 가치를 증명하는 협력 방식은 정당한가?" }
                ]
            },
            "12": {
                theme: "나눔과 포용 (한 해의 마무리)",
                books: [
                    { title: "미어캣의 스카프", author: "임경섭 글/그림", tech: "브레인라이팅 (Brainwriting)", topic: "남에게 뽐내기 위한 유행 모방 소비와 사재기 경쟁 현상은 개인의 자유적 권리로만 이해해야 하는가?" },
                    { title: "부리 동물 출입 금지!", author: "소피 레스코 글", tech: "지우개 토론", topic: "특정 집단(부리 동물)의 출입을 전면 차단하는 규제가 공동체의 질서 유지를 위해 불가피한가?" },
                    { title: "세 강도", author: "토미 웅거러 글/그림", tech: "신호등 토론 (Traffic Light)", topic: "훔친 보물로 고아들을 구휼하고 마을을 건설한 세 강도의 의적 행위는 도덕적으로 정당화될 수 있는가?" }
                ]
            }
        };

        btnShowMonthly.addEventListener("click", () => {
            const data = monthlyCurriculum[selectedMonth];
            if (!data) return;

            let booksHTML = "";
            data.books.forEach(b => {
                const mainBook = books.find(mb => mb.title === b.title);
                const buttonHTML = mainBook 
                    ? `<button class="btn btn-secondary" onclick="openModal('book', ${books.indexOf(mainBook)})" style="padding:6px 12px; font-size:0.8rem; width:100%; text-align:center;"><i class="fa-solid fa-circle-info"></i> 책 상세 및 수업 팁</button>`
                    : `<span style="font-size:0.8rem; color:var(--text-secondary); display:block; padding:6px 0; font-style:italic;">* 상세 안내는 교육과정 가이드북 참조</span>`;

                booksHTML += `
                    <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius:16px; padding:20px; display:flex; flex-direction:column; gap:12px; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                            <h4 style="font-size:1.15rem; color:var(--text-primary); margin:0; font-family:var(--font-serif); font-weight:700;">${b.title}</h4>
                            <span class="tech-tag" style="background-color:var(--accent-sage); color:white; border:none; padding:4px 8px; font-size:0.75rem; border-radius:8px; flex-shrink:0;">${b.tech}</span>
                        </div>
                        <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">작가: ${b.author}</p>
                        <div style="background-color: rgba(224, 122, 95, 0.04); border-left: 3px solid var(--accent-coral); padding:8px 12px; border-radius:4px; font-size:0.85rem; color:var(--text-primary); line-height:1.4; font-weight:500;">
                            Q. ${b.topic}
                        </div>
                        <div style="margin-top:auto; padding-top:12px; border-top:1px dashed var(--border-color);">
                            ${buttonHTML}
                        </div>
                    </div>
                `;
            });

            output.innerHTML = `
                <div style="background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 30px; box-shadow: var(--shadow-soft);">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px; border-bottom: 2px solid var(--accent-sage); padding-bottom:12px;">
                        <i class="fa-regular fa-calendar-check" style="font-size:1.8rem; color:var(--accent-sage);"></i>
                        <h3 style="margin:0; font-size:1.4rem;">열두 달 그림책 토론 커리큘럼 - ${selectedMonth}월</h3>
                    </div>
                    <p style="font-size:0.95rem; color:var(--text-secondary); margin-bottom:20px;">
                        ${selectedMonth}월 추천 도서 및 토론 주제: <strong>${data.theme}</strong>
                    </p>
                    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
                        ${booksHTML}
                    </div>
                </div>
            `;
            output.classList.remove("hidden");
            output.scrollIntoView({ behavior: 'smooth' });
        });
    }

    const renderGuideSection = (data, colorTheme, accentClass) => {
        let booksHTML = "";
        data.books.forEach(b => {
            const mainBook = books.find(mb => mb.title === b.title);
            const buttonHTML = mainBook 
                ? `<button class="btn btn-secondary" onclick="openModal('book', ${books.indexOf(mainBook)})" style="padding:6px 12px; font-size:0.8rem; width:100%; text-align:center;"><i class="fa-solid fa-circle-info"></i> 책 상세 및 수업 팁</button>`
                : `<span style="font-size:0.8rem; color:var(--text-secondary); display:block; padding:6px 0; font-style:italic;">* 상세 안내는 교육과정 가이드북 참조</span>`;

            booksHTML += `
                <div style="background-color: var(--bg-primary); border: 1px solid var(--border-color); border-radius:16px; padding:20px; display:flex; flex-direction:column; gap:12px; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                        <h4 style="font-size:1.15rem; color:var(--text-primary); margin:0; font-family:var(--font-serif); font-weight:700;">${b.title}</h4>
                        <span class="tech-tag" style="background-color:${colorTheme}; color:white; border:none; padding:4px 8px; font-size:0.75rem; border-radius:8px; flex-shrink:0;">${b.author}</span>
                    </div>
                    <p style="font-size:0.82rem; color:var(--accent-coral); font-weight:600; margin:0;"><i class="fa-solid fa-tags"></i> ${b.topic}</p>
                    <p style="font-size:0.86rem; color:var(--text-secondary); line-height:1.5; margin:0;">${b.desc}</p>
                    <div style="margin-top:auto; padding-top:12px; border-top:1px dashed var(--border-color);">
                        ${buttonHTML}
                    </div>
                </div>
            `;
        });

        return `
            <div style="background-color:${accentClass}; padding:18px; border-radius:12px; border-left:4px solid ${colorTheme}; font-size:0.9rem; color:var(--text-primary); line-height:1.6; margin-bottom:20px;">
                <i class="fa-solid fa-lightbulb" style="color:${colorTheme}; margin-right:6px;"></i> ${data.tip}
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
                ${booksHTML}
            </div>
        `;
    };
}

function setupTechFilters() {
    const searchInput = document.getElementById("tech-search-input");
    const clearBtn = document.getElementById("clear-tech-search");
    const filterButtons = document.querySelectorAll(".tech-filter-btn");
    const grid = document.getElementById("techniques-grid");

    if (!searchInput || !grid) return;

    let currentFilter = "all";

    function filterTechniques() {
        const query = searchInput.value.toLowerCase().trim();
        const cards = grid.querySelectorAll(".technique-card");
        
        // Show/hide clear button
        if (clearBtn) {
            clearBtn.style.display = query.length > 0 ? "flex" : "none";
        }

        cards.forEach(card => {
            const name = card.getAttribute("data-name") ? card.getAttribute("data-name").toLowerCase() : "";
            const concept = card.getAttribute("data-concept") ? card.getAttribute("data-concept").toLowerCase() : "";
            const difficulty = card.getAttribute("data-difficulty") || "";
            const tagsAttr = card.getAttribute("data-tags") || "";
            const tags = tagsAttr.split(",");

            // Check if matches query
            const matchesQuery = name.includes(query) || concept.includes(query);

            // Check if matches filter category
            let matchesFilter = false;
            if (currentFilter === "all") {
                matchesFilter = true;
            } else if (["초급", "중급", "고급"].includes(currentFilter)) {
                matchesFilter = (difficulty === currentFilter);
            } else if (currentFilter === "역할극") {
                // 역할극/감상인 경우 태그 검사
                matchesFilter = tags.includes("역할극") || tags.includes("감상") || tags.includes("자기성찰");
            } else {
                matchesFilter = tags.includes(currentFilter);
            }

            if (matchesQuery && matchesFilter) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    }

    // Input event for search
    searchInput.addEventListener("input", filterTechniques);

    // Clear search button event
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            searchInput.value = "";
            filterTechniques();
            searchInput.focus();
        });
    }

    // Filter tabs click events
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            filterTechniques();
        });
    });
}

function setupMainSearch() {
    const mainSearchInput = document.getElementById("search-input");
    const clearMainSearchBtn = document.getElementById("clear-search");
    const searchTabBtns = document.querySelectorAll(".search-tab-btn");
    const tagFilterBtns = document.querySelectorAll("#tag-filters .tag-btn");
    const resultsPanel = document.getElementById("results-panel");

    if (!mainSearchInput || !resultsPanel) return;

    let currentType = "all"; // 'all', 'book', 'tech'
    let currentTag = "all";  // 'all', '비경쟁', '논리강화', etc.

    function runSearch() {
        const query = mainSearchInput.value.toLowerCase().trim();
        
        // Show/hide clear button
        if (clearMainSearchBtn) {
            clearMainSearchBtn.style.display = query.length > 0 ? "flex" : "none";
        }

        // If no query and no tag filter is selected, show empty state
        if (query === "" && currentTag === "all") {
            resultsPanel.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-lightbulb"></i>
                    <p>위 검색창에 그림책이나 토론 기법을 입력하시면 맞춤형 연계 추천 결과가 여기에 나타납니다.</p>
                </div>
            `;
            return;
        }

        let resultsHTML = "";
        let totalCount = 0;

        // 1. Search Books
        let matchingBooks = [];
        if (currentType === "all" || currentType === "book") {
            matchingBooks = books.filter(b => {
                // Tag check
                if (currentTag !== "all") {
                    const hasTag = b.tags && b.tags.some(tag => tag.replace("#", "") === currentTag);
                    if (!hasTag) return false;
                }
                // Query check
                if (query === "") return true;
                
                const titleMatch = b.title && b.title.toLowerCase().includes(query);
                const authorMatch = b.author && b.author.toLowerCase().includes(query);
                const summaryMatch = b.summary && b.summary.toLowerCase().includes(query);
                const techMatch = b.technique && b.technique.toLowerCase().includes(query);
                const tagsMatch = b.tags && b.tags.some(tag => tag.toLowerCase().includes(query));
                const topicsMatch = b.debateTopics && b.debateTopics.some(topic => topic.toLowerCase().includes(query));
                
                return titleMatch || authorMatch || summaryMatch || techMatch || tagsMatch || topicsMatch;
            });
        }

        // 2. Search Techniques
        let matchingTechs = [];
        if (currentType === "all" || currentType === "tech") {
            // Find all books that match the query
            const matchedBooks = books.filter(b => {
                const titleMatch = b.title && b.title.toLowerCase().includes(query);
                const authorMatch = b.author && b.author.toLowerCase().includes(query);
                const summaryMatch = b.summary && b.summary.toLowerCase().includes(query);
                const tagsMatch = b.tags && b.tags.some(tag => tag.toLowerCase().includes(query));
                return titleMatch || authorMatch || summaryMatch || tagsMatch;
            });

            // Extract the tags of these matched books
            const bookTags = [];
            matchedBooks.forEach(b => {
                if (b.tags) {
                    b.tags.forEach(tag => {
                        const cleanTag = tag.replace("#", "").trim();
                        if (cleanTag && !bookTags.includes(cleanTag)) {
                            bookTags.push(cleanTag);
                        }
                    });
                }
            });

            // Temporary list of techniques matching text to collect their tags
            const textMatchedTechs = techniques.filter(t => {
                if (query === "") return false;
                const nameMatch = t.name && t.name.toLowerCase().includes(query);
                const conceptMatch = t.concept && t.concept.toLowerCase().includes(query);
                return nameMatch || conceptMatch;
            });

            // Collect reference tags to find related techniques
            const referenceTags = [];
            bookTags.forEach(tag => {
                if (!referenceTags.includes(tag)) referenceTags.push(tag);
            });

            techniques.forEach(t => {
                const matchedByBook = matchedBooks.some(b => b.technique && b.technique.includes(t.name.split(" ")[0]));
                const matchedByText = textMatchedTechs.includes(t);
                if ((matchedByBook || matchedByText) && t.tags) {
                    t.tags.forEach(tag => {
                        if (!referenceTags.includes(tag)) referenceTags.push(tag);
                    });
                }
            });

            // Score all techniques based on matching priority
            const techScores = techniques.map(t => {
                let score = 0;
                let isDirectBookMatch = false;
                let isTextMatch = false;
                let isRelatedMatch = false;

                // 1. Direct Book Match (Highest priority)
                const matchedByBook = matchedBooks.some(b => b.technique && b.technique.includes(t.name.split(" ")[0]));
                if (matchedByBook) {
                    score += 1000;
                    isDirectBookMatch = true;
                }

                // 2. Text Match (Medium-high priority)
                if (query !== "") {
                    const nameMatch = t.name && t.name.toLowerCase().includes(query);
                    const conceptMatch = t.concept && t.concept.toLowerCase().includes(query);
                    const effectMatch = t.effect && t.effect.toLowerCase().includes(query);
                    const stepsMatch = t.steps && t.steps.some(step => 
                        (step.title && step.title.toLowerCase().includes(query)) || 
                        (step.desc && step.desc.toLowerCase().includes(query))
                    );
                    const tipsMatch = t.tips && t.tips.some(tip => tip.toLowerCase().includes(query));
                    const tagsMatch = t.tags && t.tags.some(tag => tag.toLowerCase().includes(query));

                    if (nameMatch || conceptMatch || effectMatch || stepsMatch || tipsMatch || tagsMatch) {
                        score += 100;
                        isTextMatch = true;
                    }
                }

                // 3. Related Match (Shared tags with reference tags)
                if (!isDirectBookMatch && referenceTags.length > 0 && t.tags) {
                    const sharedTagsCount = t.tags.filter(tag => referenceTags.includes(tag)).length;
                    if (sharedTagsCount > 0) {
                        score += 10 * sharedTagsCount;
                        isRelatedMatch = true;
                    }
                }

                return { tech: t, score, isDirectBookMatch, isTextMatch, isRelatedMatch };
            });

            // Filter out techniques that have 0 score (if query is not empty)
            let filteredTechScores = techScores;
            if (query !== "") {
                filteredTechScores = techScores.filter(item => item.score > 0);
            }

            // Apply active category tag filter if any
            if (currentTag !== "all") {
                filteredTechScores = filteredTechScores.filter(item => {
                    const t = item.tech;
                    return t.tags && t.tags.some(tag => tag.replace("#", "") === currentTag);
                });
            }

            // Sort by score descending, then by original index
            filteredTechScores.sort((a, b) => {
                if (b.score !== a.score) {
                    return b.score - a.score;
                }
                return techniques.indexOf(a.tech) - techniques.indexOf(b.tech);
            });

            matchingTechs = filteredTechScores.map(item => item.tech);
        }

        // 3. Search Theories (Only if type is 'all' and tag is 'all')
        let matchingTheories = [];
        if (currentType === "all" && currentTag === "all" && typeof debateTheory !== 'undefined') {
            matchingTheories = debateTheory.sections.filter(sec => {
                if (query === "") return false; // Don't show theories when there is no query (only show on matches)
                
                const titleMatch = sec.title && sec.title.toLowerCase().includes(query);
                const contentMatch = sec.content && sec.content.toLowerCase().includes(query);
                const pointsMatch = sec.keyPoints && sec.keyPoints.some(kp => 
                    (kp.label && kp.label.toLowerCase().includes(query)) || 
                    (kp.desc && kp.desc.toLowerCase().includes(query))
                );

                return titleMatch || contentMatch || pointsMatch;
            });
        }

        // 4. Search Archive (Only if type is 'all' and tag is 'all')
        let matchingArchive = [];
        if (currentType === "all" && currentTag === "all" && typeof worksheets !== 'undefined') {
            matchingArchive = worksheets.filter(ws => {
                if (query === "") return false; // Don't show archive when there is no query

                const titleMatch = ws.title && ws.title.toLowerCase().includes(query);
                const descMatch = ws.desc && ws.desc.toLowerCase().includes(query);

                return titleMatch || descMatch;
            });
        }

        totalCount = matchingBooks.length + matchingTechs.length + matchingTheories.length + matchingArchive.length;

        if (totalCount === 0) {
            resultsPanel.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-circle-question" style="font-size: 3rem; color: var(--accent-coral); margin-bottom: 15px;"></i>
                    <p>입력하신 검색어에 해당하는 결과가 없습니다.</p>
                    <span style="font-size: 0.9rem; color: var(--text-secondary);">다른 키워드로 다시 검색해 보세요.</span>
                </div>
            `;
            return;
        }

        let containerHTML = `<div class="search-results-container" style="display:flex; flex-direction:column; gap:40px; text-align:left; width:100%;">`;

        // Render Books
        if (matchingBooks.length > 0) {
            let booksHTML = "";
            matchingBooks.forEach(book => {
                const originalIndex = books.indexOf(book);
                booksHTML += `
                    <div class="book-card" onclick="openModal('book', ${originalIndex})">
                        <div class="book-design">
                            <div class="book-design-inner" style="background: ${book.gradient || 'var(--accent-coral)'};" id="search-book-cover-${originalIndex}">
                                <span class="book-design-title">${book.title}</span>
                                <i class="fa-solid ${book.icon || 'fa-book'} book-design-icon"></i>
                            </div>
                        </div>
                        <div class="book-info">
                            <h4>${book.title}</h4>
                            <p>${book.author}</p>
                            <div style="margin-top:8px;">
                                ${(book.tags || []).map(t => `<span class="tech-tag">${t}</span>`).join("")}
                            </div>
                        </div>
                    </div>
                `;
            });

            containerHTML += `
                <div class="search-result-group">
                    <h3 style="font-size:1.3rem; margin-bottom:20px; border-bottom:2px solid var(--accent-coral); padding-bottom:8px; color:var(--text-primary);">
                        <i class="fa-solid fa-book" style="margin-right:8px; color:var(--accent-coral);"></i>그림책 서재 결과 (${matchingBooks.length}건)
                    </h3>
                    <div class="books-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
                        ${booksHTML}
                    </div>
                </div>
            `;
        }

        // Render Techniques
        if (matchingTechs.length > 0) {
            let techsHTML = "";
            matchingTechs.forEach(tech => {
                let booksText = "준비중";
                const matchedBooks = books.filter(b => b.technique && b.technique.includes(tech.name.split(" ")[0]));
                if (matchedBooks.length > 0) {
                    booksText = matchedBooks.map(b => b.title).join(", ");
                }

                let difficulty = "초급";
                let difficultyClass = "badge-difficulty-low";
                let diffIcon = "fa-circle";
                const advancedTechs = ["lincoln", "leadership", "panel"];
                const intermediateTechs = ["procon", "socratic", "panorama", "digital", "reason"];
                if (advancedTechs.includes(tech.id)) {
                    difficulty = "고급";
                    difficultyClass = "badge-difficulty-high";
                    diffIcon = "fa-circle-dot";
                } else if (intermediateTechs.includes(tech.id) || (tech.tags && tech.tags.includes("논리강화"))) {
                    difficulty = "중급";
                    difficultyClass = "badge-difficulty-mid";
                    diffIcon = "fa-circle-half-stroke";
                }
                let durationText = tech.time ? tech.time.split(" ")[0] : "40분";

                techsHTML += `
                    <div class="technique-card" onclick="openModal('tech', '${tech.id}')">
                        <div class="tech-header">
                            <div class="tech-icon-wrapper">
                                <i class="fa-solid ${tech.icon}"></i>
                            </div>
                        </div>
                        <h3 style="margin-top:14px; font-size:1.15rem; color:var(--text-primary); font-family:var(--font-sans); font-weight:700;">${tech.name}</h3>
                        <div class="tech-tags" style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">
                            ${(tech.tags || []).map(tag => `<span class="tech-tag">${tag}</span>`).join("")}
                        </div>
                        <p class="tech-desc">${tech.concept}</p>
                        <div class="tech-footer" style="margin-top:auto; padding-top:14px; border-top:1px dashed var(--border-color); display:flex; justify-content:space-between; align-items:center;">
                            <span class="tech-matching-book" style="font-size:0.8rem; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;">
                                <i class="fa-solid fa-book" style="margin-right: 4px; color:var(--accent-coral);"></i> ${booksText}
                            </span>
                            <span class="tech-more-btn" style="font-size:0.85rem; font-weight:700; color:var(--accent-coral); white-space:nowrap;">
                                더보기 <i class="fa-solid fa-arrow-right"></i>
                            </span>
                        </div>
                    </div>
                `;
            });

            containerHTML += `
                <div class="search-result-group">
                    <h3 style="font-size:1.3rem; margin-bottom:20px; border-bottom:2px solid var(--accent-sage); padding-bottom:8px; color:var(--text-primary);">
                        <i class="fa-solid fa-comments" style="margin-right:8px; color:var(--accent-sage);"></i>토론 기법 결과 (${matchingTechs.length}건)
                    </h3>
                    <div class="techniques-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
                        ${techsHTML}
                    </div>
                </div>
            `;
        }

        // Render Theories
        if (matchingTheories.length > 0) {
            let theoriesHTML = "";
            matchingTheories.forEach(sec => {
                theoriesHTML += `
                    <div class="theory-card">
                        <div class="theory-icon-wrapper">
                            <i class="fa-solid ${sec.icon}"></i>
                        </div>
                        <h3>${sec.title}</h3>
                        <p class="theory-content">${sec.content}</p>
                        ${sec.keyPoints ? `
                            <ul class="theory-points">
                                ${sec.keyPoints.map(kp => `<li><strong>${kp.label}:</strong> ${kp.desc}</li>`).join("")}
                            </ul>
                        ` : ''}
                    </div>
                `;
            });

            containerHTML += `
                <div class="search-result-group">
                    <h3 style="font-size:1.3rem; margin-bottom:20px; border-bottom:2px solid var(--accent-navy); padding-bottom:8px; color:var(--text-primary);">
                        <i class="fa-solid fa-graduation-cap" style="margin-right:8px; color:var(--accent-navy);"></i>토론 이론 결과 (${matchingTheories.length}건)
                    </h3>
                    <div class="theory-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
                        ${theoriesHTML}
                    </div>
                </div>
            `;
        }

        // Render Archive
        if (matchingArchive.length > 0) {
            let archiveHTML = "";
            matchingArchive.forEach(ws => {
                let btnClass = "btn-primary";
                let iconHtml = `<i class="fa-solid ${ws.icon}"></i>`;
                if(ws.icon && ws.icon.includes('file-pdf')) {
                    btnClass = "btn-secondary";
                    iconHtml = `<i class="fa-regular fa-file-pdf" style="color: #E01918;"></i>`;
                } else if(ws.icon && ws.icon.includes('file-powerpoint')) {
                    iconHtml = `<i class="fa-regular fa-file-powerpoint" style="color: #D24726;"></i>`;
                } else if(ws.icon && ws.icon.includes('file-word')) {
                    iconHtml = `<i class="fa-regular fa-file-word" style="color: #2B579A;"></i>`;
                }

                archiveHTML += `
                    <div class="archive-card">
                        <div style="font-size: 2.5rem; margin-bottom: 15px;">
                            ${iconHtml}
                        </div>
                        <h4 style="margin-bottom: 10px; font-size: 1.1rem; color: var(--text-primary);">${ws.title}</h4>
                        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5;">${ws.desc}</p>
                        <a href="${ws.link}" class="btn ${btnClass}" style="width: 100%; text-align: center;"><i class="fa-solid fa-download"></i> 다운로드</a>
                    </div>
                `;
            });

            containerHTML += `
                <div class="search-result-group">
                    <h3 style="font-size:1.3rem; margin-bottom:20px; border-bottom:2px solid #D24726; padding-bottom:8px; color:var(--text-primary);">
                        <i class="fa-solid fa-folder-open" style="margin-right:8px; color:#D24726;"></i>수업 자료실 결과 (${matchingArchive.length}건)
                    </h3>
                    <div class="archive-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
                        ${archiveHTML}
                    </div>
                </div>
            `;
        }

        containerHTML += `</div>`;
        resultsPanel.innerHTML = containerHTML;

        // Fetch covers asynchronously
        if (matchingBooks.length > 0) {
            matchingBooks.forEach(book => {
                const originalIndex = books.indexOf(book);
                const el = document.getElementById(`search-book-cover-${originalIndex}`);
                if (el) {
                    fetchRealCover(book.title, el);
                }
            });
        }
    }

    // Input listener for live search
    mainSearchInput.addEventListener("input", runSearch);

    // Clear search button
    if (clearMainSearchBtn) {
        clearMainSearchBtn.addEventListener("click", () => {
            mainSearchInput.value = "";
            runSearch();
            mainSearchInput.focus();
        });
    }

    // Tab buttons
    searchTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            searchTabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentType = btn.dataset.type;
            runSearch();
        });
    });

    // Tag filter buttons
    tagFilterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tagFilterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentTag = btn.dataset.filter;
            runSearch();
        });
    });
}

