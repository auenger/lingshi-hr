// Global State
let allCategories = [];
let currentCategory = null;
let currentJobs = [];
let currentJobData = null; // Store the currently viewed job for the apply modal

// DOM Elements
const jobModal = document.getElementById('jobModal');
const applyModal = document.getElementById('applyModal');
const categoriesContainer = document.getElementById('job-categories');
const jobListContainer = document.getElementById('job-list');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initJobBoard();
});

async function initJobBoard() {
    try {
        const response = await fetch('data/categories.json');
        if (!response.ok) throw new Error('Failed to load categories');
        allCategories = await response.json();

        renderCategories();

        // Load first category by default if available
        if (allCategories.length > 0) {
            selectCategory(allCategories[0].id);
        }
    } catch (error) {
        console.error('Error initializing job board:', error);
        jobListContainer.innerHTML = '<p class="error-msg">加载岗位信息失败，请稍后刷新页面重试。</p>';
    }
}

function renderCategories() {
    categoriesContainer.innerHTML = '';

    allCategories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = cat.name;
        btn.dataset.id = cat.id;
        btn.onclick = () => selectCategory(cat.id);
        categoriesContainer.appendChild(btn);
    });
}

async function selectCategory(catId) {
    // Update Active State
    document.querySelectorAll('.category-btn').forEach(btn => {
        if (btn.dataset.id === catId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    currentCategory = allCategories.find(c => c.id === catId);
    if (!currentCategory) return;

    // Show Loading
    jobListContainer.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i> 正在加载 ${currentCategory.name} 岗位...
        </div>
    `;

    try {
        const response = await fetch(currentCategory.file);
        if (!response.ok) throw new Error(`Failed to load jobs for ${currentCategory.name}`);
        const data = await response.json();
        currentJobs = data.jobs || [];
        renderJobs(currentJobs);
    } catch (error) {
        console.error('Error loading jobs:', error);
        jobListContainer.innerHTML = '<p class="error-msg">加载岗位列表失败。</p>';
    }
}

function renderJobs(jobs) {
    jobListContainer.innerHTML = '';

    if (jobs.length === 0) {
        jobListContainer.innerHTML = `
            <div style="text-align: center; color: #999; padding: 40px; width: 100%;">
                <i class="fas fa-inbox" style="font-size: 40px; margin-bottom: 10px;"></i>
                <p>该分类下暂无热招岗位</p>
            </div>
        `;
        return;
    }

    jobs.forEach(job => {
        const card = document.createElement('div');
        card.className = 'job-card';
        card.onclick = () => openJobModal(job.id);

        let tagsHtml = '';
        if (job.tags && Array.isArray(job.tags)) {
            tagsHtml = job.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        }

        // Default icon mapping
        const locationIcon = '<i class="fas fa-map-marker-alt"></i>';
        const typeIcon = '<i class="fas fa-briefcase"></i>';
        const expIcon = '<i class="fas fa-clock"></i>';

        card.innerHTML = `
            <div class="job-header">
                <h3>${job.title}</h3>
                <div class="tags-container">${tagsHtml}</div>
            </div>
            <div class="job-info">
                <span>${locationIcon} ${job.location || '上海'}</span>
                <span>${typeIcon} ${job.type || '全职'}</span>
                <span>${expIcon} ${job.experience || '经验不限'}</span>
            </div>
            <p class="job-snippet">${job.snippet || ''}</p>
            <button class="btn btn-outline">查看详情 & 投递</button>
        `;

        jobListContainer.appendChild(card);
    });
}

// Modal Control
function openJobModal(jobId) {
    const job = currentJobs.find(j => j.id === jobId);
    if (!job) return;

    currentJobData = job;

    // Populate Modal
    const modalContent = jobModal.querySelector('.modal-content');

    // Header
    const titleEl = modalContent.querySelector('.modal-header h2');
    const tagsEl = modalContent.querySelector('.modal-tags');

    titleEl.textContent = job.title;

    // Tags
    if (job.tags) {
        tagsEl.innerHTML = job.tags.map(tag => `<span>${tag}</span>`).join('');
    } else {
        tagsEl.innerHTML = '';
    }

    // Body
    const bodyEl = modalContent.querySelector('.modal-body');
    bodyEl.innerHTML = ''; // Clear previous

    if (job.detail) {
        // Responsibilities
        if (job.detail.responsibilities && job.detail.responsibilities.length > 0) {
            const section = document.createElement('div');
            section.className = 'jd-section';
            section.innerHTML = `
                <h3>岗位职责</h3>
                <ul>
                    ${job.detail.responsibilities.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
            bodyEl.appendChild(section);
        }

        // Requirements
        if (job.detail.requirements && job.detail.requirements.length > 0) {
            const section = document.createElement('div');
            section.className = 'jd-section';
            section.innerHTML = `
                <h3>任职要求</h3>
                <ul>
                    ${job.detail.requirements.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
            bodyEl.appendChild(section);
        }
    } else {
        bodyEl.innerHTML = '<p>暂无详细描述</p>';
    }

    jobModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeJobModal() {
    jobModal.classList.remove('show');
    document.body.style.overflow = '';
}

function openApplyForm() {
    if (!currentJobData) return;

    // Set the hidden input for job title/context
    const appliedInput = document.getElementById('applied_job_input');
    const subjectInput = document.querySelector('input[name="_subject"]');
    const formTitle = applyModal.querySelector('h3');

    if (appliedInput) appliedInput.value = currentJobData.title + ` (ID: ${currentJobData.id})`;
    if (subjectInput) subjectInput.value = `${currentJobData.title} - 简历投递 (lingshi-hr)`;
    if (formTitle) formTitle.textContent = `投递简历 - ${currentJobData.title}`;

    jobModal.classList.remove('show');
    applyModal.classList.add('show');
}

function closeApplyModal() {
    applyModal.classList.remove('show');
    document.body.style.overflow = '';
}

function backToJobModal() {
    applyModal.classList.remove('show');
    jobModal.classList.add('show');
}

// Close modal if clicked outside
window.onclick = function (event) {
    if (event.target == jobModal) {
        closeJobModal();
    }
    if (event.target == applyModal) {
        closeApplyModal();
    }
}

// File Upload Visual Feedback & Size Validation
const fileInput = document.getElementById('resume');
const fileVisual = document.querySelector('.file-upload-visual');

if (fileInput) {
    fileInput.addEventListener('change', function (e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            // 3MB limit (3 * 1024 * 1024 bytes)
            if (file.size > 3 * 1024 * 1024) {
                showToast("文件大小超过 3MB，请压缩后重新上传", "warning");
                this.value = ''; // Clear input
                fileVisual.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> 点击上传简历';
                return;
            }
            fileVisual.innerHTML = `<i class="fas fa-check-circle" style="color: green;"></i> 已选择: ${file.name}`;
        }
    });
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById("toast-notification");
    toast.innerText = message;
    toast.className = "show " + type;
    setTimeout(function () {
        toast.className = toast.className.replace("show", "");
    }, 4000);
}

// Handle Form Submission with FormSubmit
function handleApply(event) {
    event.preventDefault();

    // Check for duplicate submission (Simple protection: 1 min cooldown)
    const lastSubmitTime = localStorage.getItem('lastSubmitTime');
    if (lastSubmitTime && (Date.now() - lastSubmitTime < 60000)) {
        showToast("您刚刚投递过，请勿重复提交，请稍后再试。", "warning");
        return;
    }

    const form = event.target;
    const fileInput = form.querySelector('input[type="file"]');

    // Safety check for file size (in case they bypassed the change event)
    if (fileInput.files.length > 0 && fileInput.files[0].size > 3 * 1024 * 1024) {
        showToast("文件大小超过 3MB，请压缩后重新上传", "warning");
        return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerText;

    // UI Loading State
    btn.innerText = '正在上传投递...';
    btn.disabled = true;

    const formData = new FormData(form);

    // FormSubmit Standard Endpoint
    fetch("https://formsubmit.co/xkben@lingshi.com", {
        method: "POST",
        body: formData
    })
        .then(response => {
            if (response.ok) {
                return true;
            } else {
                throw new Error("Server returned " + response.status);
            }
        })
        .then(success => {
            showToast("投递成功！我们会尽快联系您。", "success");
            // Record submission time
            localStorage.setItem('lastSubmitTime', Date.now());

            closeApplyModal();
            form.reset();
            fileVisual.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> 点击上传简历';
        })
        .catch(error => {
            console.error('Error:', error);
            showToast("网络连接错误，请直接发送邮件至 xkben@lingshi.com", "error");
        })
        .finally(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        });
}
