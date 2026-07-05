// ========== ÉTAT ==========
let state = {
    education: [],
    distinctions: [],
    languages: []
};

// ========== DOM REFS ==========
const DOM = {
    fullName: document.getElementById('fullName'),
    nationality: document.getElementById('nationality'),
    birthDate: document.getElementById('birthDate'),
    address: document.getElementById('address'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    links: document.getElementById('links'),
    objectiveText: document.getElementById('objectiveText'),
    contests: document.getElementById('contests'),
    specializations: document.getElementById('specializations'),
    techSkills: document.getElementById('techSkills'),
    interestsList: document.getElementById('interestsList'),
    qualitiesList: document.getElementById('qualitiesList'),
    educationContainer: document.getElementById('educationContainer'),
    distinctionsContainer: document.getElementById('distinctionsContainer'),
    languagesContainer: document.getElementById('languagesContainer'),
    preview: document.getElementById('cvPreview'),
    btnGenerate: document.getElementById('btnGeneratePreview'),
    btnExport: document.getElementById('btnExportPDF'),
    btnPrint: document.getElementById('btnPrint')
};

// ========== ACCORDÉONS ==========
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function() {
        const target = document.getElementById(this.dataset.target);
        if (!target) return;
        
        const isOpen = target.classList.contains('open');
        this.classList.toggle('active');
        target.classList.toggle('open');
        
        // Fermer les autres du même niveau (optionnel)
        // Pour une expérience plus propre, on peut tout fermer sauf celui-ci
    });
});

// ========== FORMATION ==========
document.getElementById('addEducation').addEventListener('click', () => {
    const id = Date.now();
    state.education.push({ id, title: '', institution: '', year: '' });
    renderEducation();
});

function renderEducation() {
    DOM.educationContainer.innerHTML = state.education.map(edu => `
        <div class="education-item" data-id="${edu.id}">
            <button class="remove-item" onclick="removeEducation(${edu.id})">✕</button>
            <input type="text" placeholder="Diplôme / Formation (ex: CPGE MP)" value="${edu.title}" onchange="updateEducation(${edu.id}, 'title', this.value)" />
            <input type="text" placeholder="Établissement" value="${edu.institution}" onchange="updateEducation(${edu.id}, 'institution', this.value)" />
            <input type="text" placeholder="Année (ex: 2025-2026)" value="${edu.year}" onchange="updateEducation(${edu.id}, 'year', this.value)" />
        </div>
    `).join('');
}

window.removeEducation = function(id) {
    state.education = state.education.filter(e => e.id !== id);
    renderEducation();
};

window.updateEducation = function(id, field, value) {
    const item = state.education.find(e => e.id === id);
    if (item) item[field] = value;
};

// ========== DISTINCTIONS ==========
document.getElementById('addDistinction').addEventListener('click', () => {
    const id = Date.now();
    state.distinctions.push({ id, title: '', year: '' });
    renderDistinctions();
});

function renderDistinctions() {
    DOM.distinctionsContainer.innerHTML = state.distinctions.map(d => `
        <div class="distinction-item" data-id="${d.id}">
            <button class="remove-item" onclick="removeDistinction(${d.id})">✕</button>
            <input type="text" placeholder="Distinction / Certificat" value="${d.title}" onchange="updateDistinction(${d.id}, 'title', this.value)" />
            <input type="text" placeholder="Année" value="${d.year}" onchange="updateDistinction(${d.id}, 'year', this.value)" />
        </div>
    `).join('');
}

window.removeDistinction = function(id) {
    state.distinctions = state.distinctions.filter(d => d.id !== id);
    renderDistinctions();
};

window.updateDistinction = function(id, field, value) {
    const item = state.distinctions.find(d => d.id === id);
    if (item) item[field] = value;
};

// ========== LANGUES ==========
document.getElementById('addLanguage').addEventListener('click', () => {
    const id = Date.now();
    state.languages.push({ id, name: '', level: '' });
    renderLanguages();
});

function renderLanguages() {
    DOM.languagesContainer.innerHTML = state.languages.map(l => `
        <div class="language-item" data-id="${l.id}">
            <button class="remove-item" onclick="removeLanguage(${l.id})">✕</button>
            <input type="text" placeholder="Langue (ex: Arabe)" value="${l.name}" onchange="updateLanguage(${l.id}, 'name', this.value)" />
            <input type="text" placeholder="Niveau (ex: langue maternelle)" value="${l.level}" onchange="updateLanguage(${l.id}, 'level', this.value)" />
        </div>
    `).join('');
}

window.removeLanguage = function(id) {
    state.languages = state.languages.filter(l => l.id !== id);
    renderLanguages();
};

window.updateLanguage = function(id, field, value) {
    const item = state.languages.find(l => l.id === id);
    if (item) item[field] = value;
};

// ========== GÉNÉRER L'APERÇU ==========
DOM.btnGenerate.addEventListener('click', generatePreview);

function generatePreview() {
    const data = getFormData();
    
    let html = `
        <style>
            .cv-academic {
                font-family: 'Inter', -apple-system, sans-serif;
                max-width: 100%;
                color: #1a1a2e;
            }
            .cv-academic .header {
                text-align: center;
                padding-bottom: 16px;
                border-bottom: 2px solid #1a56db;
                margin-bottom: 16px;
            }
            .cv-academic .header h1 {
                font-size: 24px;
                font-weight: 700;
                color: #1a1a2e;
                margin-bottom: 2px;
            }
            .cv-academic .header .subtitle {
                font-size: 14px;
                color: #1a56db;
                font-weight: 500;
            }
            .cv-academic .header .contact {
                font-size: 12px;
                color: #4b5563;
                margin-top: 6px;
                display: flex;
                justify-content: center;
                gap: 16px;
                flex-wrap: wrap;
            }
            .cv-academic .section {
                margin-bottom: 14px;
            }
            .cv-academic .section-title {
                font-weight: 700;
                font-size: 14px;
                color: #1a56db;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 3px;
                margin-bottom: 8px;
            }
            .cv-academic .section-content {
                font-size: 13px;
                color: #1e293b;
                line-height: 1.5;
            }
            .cv-academic .section-content p {
                margin-bottom: 4px;
            }
            .cv-academic .grid-2 {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px 24px;
            }
            .cv-academic .tag {
                display: inline-block;
                background: #dbeafe;
                color: #1e40af;
                padding: 1px 10px;
                border-radius: 12px;
                font-size: 12px;
                margin: 2px 4px 2px 0;
            }
            .cv-academic .badge {
                display: inline-block;
                background: #fef3c7;
                color: #92400e;
                padding: 1px 10px;
                border-radius: 12px;
                font-size: 11px;
                margin-left: 6px;
            }
            .cv-academic .item {
                margin-bottom: 8px;
            }
            .cv-academic .item .title {
                font-weight: 600;
                font-size: 13px;
            }
            .cv-academic .item .sub {
                font-size: 12px;
                color: #4b5563;
            }
            .cv-academic .item .desc {
                font-size: 12px;
                color: #4b5563;
                margin-top: 2px;
            }
            .cv-academic .watermark {
                text-align: center;
                font-size: 10px;
                color: #94a3b8;
                margin-top: 16px;
                padding-top: 10px;
                border-top: 1px solid #e2e8f0;
            }
            @media print {
                .cv-academic .header h1 { font-size: 20px; }
                .cv-academic { font-size: 11px; }
            }
        </style>
        <div class="cv-academic">
            <div class="header">
                <h1>${data.fullName || 'Nom Prénom'}</h1>
                <div class="subtitle">${data.specializations || 'Étudiant en CPGE'}</div>
                <div class="contact">
                    ${data.email ? `<span>📧 ${data.email}</span>` : ''}
                    ${data.phone ? `<span>📞 ${data.phone}</span>` : ''}
                    ${data.address ? `<span>📍 ${data.address}</span>` : ''}
                    ${data.links ? `<span>🔗 ${data.links}</span>` : ''}
                </div>
            </div>
    `;

    // ===== FORMATION =====
    if (data.education.length) {
        html += `<div class="section"><div class="section-title">🎓 Formation</div><div class="section-content">`;
        data.education.forEach(edu => {
            html += `
                <div class="item">
                    <div class="title">${edu.title || 'Formation'}</div>
                    <div class="sub">${edu.institution || ''} ${edu.year ? '· ' + edu.year : ''}</div>
                </div>
            `;
        });
        html += `</div></div>`;
    }

    // ===== OBJECTIF =====
    if (data.objective) {
        html += `<div class="section"><div class="section-title">🎯 Objectif académique</div><div class="section-content">`;
        html += `<p>${data.objective}</p>`;
        if (data.contests) {
            html += `<p style="margin-top:4px;font-weight:500;font-size:12px;">Concours visés : ${data.contests}</p>`;
        }
        html += `</div></div>`;
    }

    // ===== DISTINCTIONS =====
    if (data.distinctions.length) {
        html += `<div class="section"><div class="section-title">🏆 Distinctions et certificats</div><div class="section-content">`;
        data.distinctions.forEach(d => {
            html += `<div class="item"><span class="title">${d.title || 'Distinction'}</span> <span class="badge">${d.year || ''}</span></div>`;
        });
        html += `</div></div>`;
    }

    // ===== COMPÉTENCES =====
    if (data.specializations || data.techSkills) {
        html += `<div class="section"><div class="section-title">💻 Compétences informatiques</div><div class="section-content">`;
        if (data.specializations) {
            html += `<p><strong>Domaines :</strong> ${data.specializations}</p>`;
        }
        if (data.techSkills) {
            const skills = data.techSkills.split(',').map(s => s.trim()).filter(s => s);
            html += `<div>${skills.map(s => `<span class="tag">${s}</span>`).join('')}</div>`;
        }
        html += `</div></div>`;
    }

    // ===== LANGUES =====
    if (data.languages.length) {
        html += `<div class="section"><div class="section-title">🌍 Langues</div><div class="section-content">`;
        data.languages.forEach(l => {
            html += `<div class="item"><span class="title">${l.name || 'Langue'}</span> : ${l.level || ''}</div>`;
        });
        html += `
