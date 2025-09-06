     // Global Variables
        let isLoginMode = true;
        let currentUser = null;
        let allItems = [];
        let userItems = [];

        // Sample Data - In a real app, this would come from a backend
        const sampleItems = [
            {
                id: 1,
                name: "iPhone 12 Pro",
                description: "Black iPhone 12 Pro with a blue case. Has a small scratch on the back.",
                location: "Main Library, 2nd Floor",
                date: "2024-01-15",
                category: "electronics",
                status: "lost",
                userEmail: "student1@college.edu",
                image: null
            },
            {
                id: 2,
                name: "Brown Leather Wallet",
                description: "Brown leather wallet with student ID and some cash. Contains driver's license.",
                location: "Student Center Cafeteria",
                date: "2024-01-14",
                category: "personal",
                status: "found",
                userEmail: "student2@college.edu",
                image: null
            },
            {
                id: 3,
                name: "Red Backpack",
                description: "Red Jansport backpack with laptop compartment. Contains textbooks.",
                location: "Engineering Building",
                date: "2024-01-13",
                category: "personal",
                status: "lost",
                userEmail: "user@college.edu",
                image: null
            },
            {
                id: 4,
                name: "Apple AirPods",
                description: "White Apple AirPods in charging case. Left earbud has a small mark.",
                location: "Gymnasium",
                date: "2024-01-12",
                category: "electronics",
                status: "found",
                userEmail: "student3@college.edu",
                image: null
            },
            {
                id: 5,
                name: "Blue Hoodie",
                description: "Navy blue university hoodie, size M. Has university logo on front.",
                location: "Dormitory A",
                date: "2024-01-11",
                category: "clothing",
                status: "lost",
                userEmail: "user@college.edu",
                image: null
            }
        ];

        // Initialize App
        document.addEventListener('DOMContentLoaded', function() {
            allItems = [...sampleItems];
            updateDashboardStats();
            loadRecentItems();
            loadSearchItems();
            loadMyItems();
            
            // Set today's date as default for form inputs
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('lostDate').value = today;
            document.getElementById('foundDate').value = today;
        });

        // Authentication Functions
        function toggleAuthMode() {
            isLoginMode = !isLoginMode;
            const authTitle = document.getElementById('authTitle');
            const authButton = document.getElementById('authButton');
            const authSwitchText = document.getElementById('authSwitchText');
            const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');

            if (isLoginMode) {
                authTitle.textContent = 'Login to Lost & Found';
                authButton.textContent = 'Login';
                authSwitchText.innerHTML = 'Don\'t have an account? <a onclick="toggleAuthMode()">Register here</a>';
                confirmPasswordGroup.style.display = 'none';
            } else {
                authTitle.textContent = 'Register for Lost & Found';
                authButton.textContent = 'Register';
                authSwitchText.innerHTML = 'Already have an account? <a onclick="toggleAuthMode()">Login here</a>';
                confirmPasswordGroup.style.display = 'block';
            }
        }

        function handleAuth(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Basic validation
            if (!isLoginMode && password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            // Simulate authentication (in real app, this would be an API call)
            if (isLoginMode) {
                // Login logic
                currentUser = { email: email };
                document.getElementById('userEmail').textContent = email;
                showDashboard();
            } else {
                // Registration logic
                alert('Registration successful! Please login.');
                toggleAuthMode();
            }
        }

        function logout() {
            currentUser = null;
            document.getElementById('navbar').style.display = 'none';
            showPage('auth');
            document.getElementById('authForm').reset();
        }

        function showDashboard() {
            document.getElementById('navbar').style.display = 'block';
            showPage('dashboard');
            updateDashboardStats();
            loadRecentItems();
            loadMyItems();
        }

        // Navigation Functions
        function showPage(pageName) {
            // Hide all pages
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => page.classList.remove('active'));

            // Show selected page
            let pageId;
            switch(pageName) {
                case 'auth':
                    pageId = 'authPage';
                    break;
                case 'dashboard':
                    pageId = 'dashboardPage';
                    break;
                case 'reportLost':
                    pageId = 'reportLostPage';
                    break;
                case 'reportFound':
                    pageId = 'reportFoundPage';
                    break;
                case 'searchItems':
                    pageId = 'searchItemsPage';
                    loadSearchItems();
                    break;
                case 'myItems':
                    pageId = 'myItemsPage';
                    loadMyItems();
                    break;
                default:
                    pageId = 'dashboardPage';
            }

            document.getElementById(pageId).classList.add('active');

            // Update navigation active state
            const navLinks = document.querySelectorAll('.nav-links a');
            navLinks.forEach(link => link.classList.remove('active'));
            event?.target?.classList.add('active');
        }

        function toggleMobileMenu() {
            const navLinks = document.getElementById('navLinks');
            navLinks.classList.toggle('active');
        }

        // Dashboard Functions
        function updateDashboardStats() {
            const totalItems = allItems.length;
            const lostItems = allItems.filter(item => item.status === 'lost').length;
            const foundItems = allItems.filter(item => item.status === 'found').length;
            const myItems = allItems.filter(item => item.userEmail === currentUser?.email).length;

            document.getElementById('totalItems').textContent = totalItems;
            document.getElementById('lostItems').textContent = lostItems;
            document.getElementById('foundItems').textContent = foundItems;
            document.getElementById('myItemsCount').textContent = myItems;
        }

        function loadRecentItems() {
            const recentItems = allItems.slice(-4); // Get last 4 items
            const container = document.getElementById('recentItems');
            container.innerHTML = '';

            recentItems.forEach(item => {
                container.appendChild(createItemCard(item));
            });
        }

        // Item Card Creation
        function createItemCard(item) {
            const card = document.createElement('div');
            card.className = 'item-card';
            
            const statusClass = item.status === 'lost' ? 'status-lost' : 'status-found';
            const statusText = item.status === 'lost' ? 'LOST' : 'FOUND';
            const icon = getItemIcon(item.category);
            
            card.innerHTML = `
                <div class="item-image">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">` : icon}
                </div>
                <div class="item-content">
                    <div class="item-title">${item.name}</div>
                    <span class="item-status ${statusClass}">${statusText}</span>
                    <div class="item-details">
                        <p><strong>Location:</strong> ${item.location}</p>
                        <p><strong>Date:</strong> ${formatDate(item.date)}</p>
                        <p><strong>Description:</strong> ${item.description.substring(0, 100)}...</p>
                        <p><strong>Contact:</strong> ${item.userEmail}</p>
                    </div>
                </div>
            `;
            
            return card;
        }

        function getItemIcon(category) {
            const icons = {
                electronics: '📱',
                personal: '🎒',
                books: '📚',
                clothing: '👕',
                other: '📦'
            };
            return icons[category] || icons.other;
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        }

        // Form Submission Functions
        function submitLostItem(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const newItem = {
                id: allItems.length + 1,
                name: formData.get('itemName'),
                description: formData.get('description'),
                location: formData.get('location'),
                date: formData.get('dateLost'),
                category: formData.get('category'),
                status: 'lost',
                userEmail: currentUser.email,
                image: null // In real app, would handle file upload
            };

            // Add to items array
            allItems.unshift(newItem); // Add to beginning
            
            // Show success message
            alert('Lost item reported successfully!');
            
            // Reset form and redirect
            event.target.reset();
            showPage('dashboard');
            updateDashboardStats();
            loadRecentItems();
        }

        function submitFoundItem(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const newItem = {
                id: allItems.length + 1,
                name: formData.get('itemName'),
                description: formData.get('description'),
                location: formData.get('location'),
                date: formData.get('dateFound'),
                category: formData.get('category'),
                status: 'found',
                userEmail: currentUser.email,
                image: null // In real app, would handle file upload
            };

            // Add to items array
            allItems.unshift(newItem); // Add to beginning
            
            // Show success message
            alert('Found item reported successfully!');
            
            // Reset form and redirect
            event.target.reset();
            showPage('dashboard');
            updateDashboardStats();
            loadRecentItems();
        }

        // Search and Filter Functions
        function loadSearchItems() {
            const container = document.getElementById('searchResults');
            container.innerHTML = '';
            
            if (allItems.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">No items found.</p>';
                return;
            }

            allItems.forEach(item => {
                container.appendChild(createItemCard(item));
            });
        }

        function searchItems() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const categoryFilter = document.getElementById('categoryFilter').value;
            const statusFilter = document.getElementById('statusFilter').value;
            const locationFilter = document.getElementById('locationFilter').value.toLowerCase();

            let filteredItems = allItems.filter(item => {
                const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                                    item.description.toLowerCase().includes(searchTerm);
                const matchesCategory = !categoryFilter || item.category === categoryFilter;
                const matchesStatus = !statusFilter || item.status === statusFilter;
                const matchesLocation = !locationFilter || item.location.toLowerCase().includes(locationFilter);

                return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
            });

            displaySearchResults(filteredItems);
        }

        function filterItems() {
            searchItems(); // Use the same logic as search
        }

        function displaySearchResults(items) {
            const container = document.getElementById('searchResults');
            container.innerHTML = '';

            if (items.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">No items match your search criteria.</p>';
                return;
            }

            items.forEach(item => {
                container.appendChild(createItemCard(item));
            });
        }

        // My Items Functions
        function loadMyItems() {
            if (!currentUser) return;
            
            const myItems = allItems.filter(item => item.userEmail === currentUser.email);
            const container = document.getElementById('myItemsList');
            container.innerHTML = '';

            if (myItems.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">You haven\'t posted any items yet.</p>';
                return;
            }

            myItems.forEach(item => {
                const card = createItemCard(item);
                
                // Add delete button for user's own items
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.className = 'btn';
                deleteBtn.style.marginTop = '1rem';
                deleteBtn.style.background = '#d32f2f';
                deleteBtn.onclick = () => deleteItem(item.id);
                
                card.querySelector('.item-content').appendChild(deleteBtn);
                container.appendChild(card);
            });
        }

        function deleteItem(itemId) {
            if (confirm('Are you sure you want to delete this item?')) {
                allItems = allItems.filter(item => item.id !== itemId);
                updateDashboardStats();
                loadMyItems();
                loadRecentItems();
                alert('Item deleted successfully!');
            }
        }

        // File Upload Handlers
        document.getElementById('lostImage').addEventListener('change', function(e) {
            const label = document.querySelector('label[for="lostImage"]');
            if (e.target.files.length > 0) {
                label.textContent = `📷 ${e.target.files[0].name}`;
                label.style.background = '#e8f5e8';
                label.style.borderColor = '#2e7d32';
            } else {
                label.textContent = '📷 Click to upload image or drag and drop';
                label.style.background = '#f5f5f5';
                label.style.borderColor = '#ccc';
            }
        });

        document.getElementById('foundImage').addEventListener('change', function(e) {
            const label = document.querySelector('label[for="foundImage"]');
            if (e.target.files.length > 0) {
                label.textContent = `📷 ${e.target.files[0].name}`;
                label.style.background = '#e8f5e8';
                label.style.borderColor = '#2e7d32';
            } else {
                label.textContent = '📷 Click to upload image or drag and drop';
                label.style.background = '#f5f5f5';
                label.style.borderColor = '#ccc';
            }
        });

        // Search on Enter key
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchItems();
            }
        });

        // Auto-hide mobile menu when clicking on links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                const navLinks = document.getElementById('navLinks');
                navLinks.classList.remove('active');
            });
        });

        // Add some animation effects
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        });

        // Simulate loading states for better UX
        function showLoading(containerId) {
            const container = document.getElementById(containerId);
            container.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Loading items...</p>
                </div>
            `;
        }

        // Add smooth transitions for page changes
        function smoothPageTransition(callback) {
            document.body.style.opacity = '0.7';
            setTimeout(() => {
                callback();
                document.body.style.opacity = '1';
            }, 200);
        }

        // Initialize tooltips and other interactive elements
        function initializeInteractiveElements() {
            // Add hover effects to cards
            document.addEventListener('mouseover', function(e) {
                if (e.target.closest('.item-card')) {
                    e.target.closest('.item-card').style.transform = 'translateY(-5px)';
                }
            });

            document.addEventListener('mouseout', function(e) {
                if (e.target.closest('.item-card')) {
                    e.target.closest('.item-card').style.transform = 'translateY(0)';
                }
            });
        }

        // Call initialization functions
        initializeInteractiveElements();

        // Add keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        if (currentUser) showPage('dashboard');
                        break;
                    case '2':
                        e.preventDefault();
                        if (currentUser) showPage('reportLost');
                        break;
                    case '3':
                        e.preventDefault();
                        if (currentUser) showPage('reportFound');
                        break;
                    case '4':
                        e.preventDefault();
                        if (currentUser) showPage('searchItems');
                        break;
                    case '5':
                        e.preventDefault();
                        if (currentUser) showPage('myItems');
                        break;
                }
            }
        });

        // Add notification system (simple alerts for now)
        function showNotification(message, type = 'success') {
            // In a real app, you'd create a proper notification system
            // For now, we'll use browser alerts
            alert(message);
        }

        // Form validation helpers
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        function validateForm(formElement) {
            const inputs = formElement.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#d32f2f';
                    isValid = false;
                } else {
                    input.style.borderColor = '#e0e0e0';
                }
            });

            return isValid;
        }

        // Add real-time search
        let searchTimeout;
        document.getElementById('searchInput').addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchItems();
            }, 300);
        });

        console.log('Lost & Found Portal initialized successfully!');
        console.log('Available keyboard shortcuts:');
        console.log('Ctrl/Cmd + 1: Dashboard');
        console.log('Ctrl/Cmd + 2: Report Lost Item');
        console.log('Ctrl/Cmd + 3: Report Found Item');
        console.log('Ctrl/Cmd + 4: Search Items');
        console.log('Ctrl/Cmd + 5: My Items');
