const apiBase = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
let issuesData = [];

// Login Functions (index.html)
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(username === 'admin' && password === 'admin123') {
        window.location.href = 'main.html';
    } else {
        alert('Invalid credentials!');
    }
}        

// Issue Tracker Functions (main.html)
// Fetch Issues
async function fetchIssues() {
    try {
        const res = await fetch(apiBase);
        if (!res.ok) throw new Error('Failed to fetch issues');
        const response = await res.json();
        // Handle API response format: { status, message, data: [...] }
        issuesData = response.data || response;
        displayIssues(issuesData);
       }
     catch (error) 
     {
        console.error('Error fetching issues:', error);
        // Use mock data as fallback for demo
        issuesData = [
            { id: 1, title: 'Fix login bug', description: 'Users cannot login with special characters', author: 'John Doe', status: 'open', label: 'bug', priority: 'high', createdAt: '2024-01-15' },
            { id: 2, title: 'Add dark mode', description: 'Implement dark theme support', author: 'Jane Smith', status: 'open', label: 'feature', priority: 'medium', createdAt: '2024-01-14' },
            { id: 3, title: 'Update documentation', description: 'Add API documentation', author: 'Mike Johnson', status: 'closed', label: 'documentation', priority: 'low', createdAt: '2024-01-10' },
            { id: 4, title: 'Performance optimization', description: 'Improve page load time', author: 'Sarah Wilson', status: 'open', label: 'enhancement', priority: 'high', createdAt: '2024-01-12' }
        ];
        displayIssues(issuesData);
     }
}

// Display Issues in grid
function displayIssues(data)
 {
    const grid = document.getElementById('issues-grid');
    grid.innerHTML = '';
    document.getElementById('issue-count').innerText = `${data.length} Issues`;

    data.forEach(issue => {
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded shadow cursor-pointer border-t-4 ' + 
            (issue.status === 'open' ? 'border-green-500' : 'border-purple-700');
        
        // Handle both API formats: labels (array) or label (string)
        const labelText = Array.isArray(issue.labels) ? issue.labels[0] : issue.label;
        card.innerHTML = `
            <p class="font-bold">${issue.title}</p>
            <p class="text-gray-500 text-sm truncate">${issue.description}</p>
            <p class="text-xs mt-1">By ${issue.author} | ${new Date(issue.createdAt).toLocaleDateString()}</p>
            <p class="text-xs mt-1">
                <span class="bg-red-200 text-red-700 px-1 rounded text-xs">${labelText || 'No label'}</span>
            </p>
        `;
        card.onclick = () => openModal(issue);
        grid.appendChild(card);
    });
}

// Filter Tabs
function filterIssues(status)
 {
    document.getElementById('tab-all').className = 'bg-gray-200 text-gray-700 px-4 py-2 rounded';
    document.getElementById('tab-open').className = 'bg-gray-200 text-gray-700 px-4 py-2 rounded';
    document.getElementById('tab-closed').className = 'bg-gray-200 text-gray-700 px-4 py-2 rounded';

    if(status === 'all') document.getElementById('tab-all').className = 'bg-purple-700 text-white px-4 py-2 rounded';
    if(status === 'open') document.getElementById('tab-open').className = 'bg-purple-700 text-white px-4 py-2 rounded';
    if(status === 'closed') document.getElementById('tab-closed').className = 'bg-purple-700 text-white px-4 py-2 rounded';

    const filtered = status === 'all' ? issuesData : issuesData.filter(i => i.status === status);
    displayIssues(filtered);
}

// Modal Functions
function openModal(issue)
 {
    const modal = document.getElementById('issue-modal');
    modal.classList.remove('hidden');
    // Handle both API formats: labels (array) or label (string)
    const labelText = Array.isArray(issue.labels) ? issue.labels.join(', ') : issue.label;
    document.getElementById('modal-content').innerHTML = `
        <h2 class="font-bold text-lg mb-2">${issue.title}</h2>
        <p class="text-gray-500 mb-2">${issue.description}</p>
        <p>Author: ${issue.author}</p>
        <p>Status: ${issue.status}</p>
        <p>Priority: ${issue.priority}</p>
        <p>Label: ${labelText || 'No label'}</p>
        <p>Created At: ${new Date(issue.createdAt).toLocaleDateString()}</p>
    `;
}

function closeModal()
 {
    document.getElementById('issue-modal').classList.add('hidden');
 }

// Close modal on outside click
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('issue-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});

// Search
async function searchIssue() {
    try {
        const query = document.getElementById('search').value;
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`);
        if (!res.ok) throw new Error('Search failed');
        const response = await res.json();
        const data = response.data || response;
        displayIssues(data);
    } catch (error) {
        console.error('Error searching issues:', error);
        alert('Failed to search issues. Please try again.');
    }
}

// Search on Enter key
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchIssue();
            }
        });
    }
});

// Initial load - Only run if issues-grid exists (main.html)
if (document.getElementById('issues-grid')) {
    fetchIssues();
}

