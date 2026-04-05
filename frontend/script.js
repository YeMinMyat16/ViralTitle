document.addEventListener('DOMContentLoaded', () => {
    const topicInput = document.getElementById('topicInput');
    const generateBtn = document.getElementById('generateBtn');
    const regenerateBtn = document.getElementById('regenerateBtn');
    const errorContainer = document.getElementById('errorContainer');
    const resultsContainer = document.getElementById('resultsContainer');
    const titlesList = document.getElementById('titlesList');

    const API_URL = 'http://localhost:8000/generate-titles';

    // Simple Copy Icon SVG
    const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
    const checkIcon = `<span class="material-symbols-outlined text-[18px] text-green-600">check</span>`;

    async function generateTitles() {
        const topic = topicInput.value.trim();
        
        if (!topic) {
            showError('Please enter a video topic first.');
            return;
        }

        setLoading(true);
        hideError();
        resultsContainer.classList.add('hidden');
        titlesList.innerHTML = '';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ topic })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Failed to generate titles.');
            }

            if (data.titles && Array.isArray(data.titles)) {
                renderTitles(data.titles);
                resultsContainer.classList.remove('hidden');
            } else {
                throw new Error('Invalid response format from server.');
            }

        } catch (error) {
            showError(error.message || 'Error communicating with backend.');
        } finally {
            setLoading(false);
        }
    }

    function renderTitles(titles) {
        titles.forEach((title, index) => {
            const card = document.createElement('div');
            // Clean Tailwind CSS from Stitch layout
            card.className = 'group bg-surface-container-low rounded-xl p-5 hover:bg-surface-container transition-all border border-transparent hover:border-outline-variant/30 flex justify-between items-center gap-4 shadow-sm hover:shadow-md animation-fade-in';
            card.style.animationDelay = `${index * 0.05}s`;

            const textSpan = document.createElement('h4');
            textSpan.className = 'text-lg md:text-xl font-headline font-bold text-on-surface leading-snug';
            textSpan.textContent = title;

            const copyBtn = document.createElement('button');
            copyBtn.className = 'p-3 hover:bg-white rounded-lg transition-colors text-secondary hover:text-primary shrink-0 flex items-center justify-center';
            copyBtn.title = 'Copy this title';
            copyBtn.innerHTML = copyIcon;
            
            copyBtn.onclick = () => copyToClipboard(title, copyBtn);

            card.appendChild(textSpan);
            card.appendChild(copyBtn);
            titlesList.appendChild(card);
        });
    }

    async function copyToClipboard(text, button) {
        try {
            await navigator.clipboard.writeText(text);
            button.innerHTML = checkIcon;
            
            setTimeout(() => {
                button.innerHTML = copyIcon;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    function setLoading(isLoading) {
        if (isLoading) {
            generateBtn.classList.add('loading');
            generateBtn.disabled = true;
            topicInput.disabled = true;
        } else {
            generateBtn.classList.remove('loading');
            generateBtn.disabled = false;
            topicInput.disabled = false;
        }
    }

    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');
    }

    function hideError() {
        errorContainer.classList.add('hidden');
    }

    // Event Listeners
    generateBtn.addEventListener('click', generateTitles);
    
    topicInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateTitles();
        }
    });

    if(regenerateBtn) {
        regenerateBtn.addEventListener('click', generateTitles);
    }
});
