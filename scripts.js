// User Management
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Initialize Data Stores
localStorage.setItem('users', localStorage.getItem('users') || '[]');
localStorage.setItem('crops', localStorage.getItem('crops') || '[]');

// ================== REGISTRATION & LOGIN ================== //
document.getElementById('registerForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const user = {
    id: Date.now(),
    name: document.getElementById('regName').value,
    email: document.getElementById('regEmail').value,
    phone: document.getElementById('regPhone').value,
    location: document.getElementById('regLocation').value,
    type: 'urban'
  };

  const users = JSON.parse(localStorage.getItem('users'));
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  alert('Registration successful!');
  window.location.href = 'dashboard.html';
});

document.getElementById('loginForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const users = JSON.parse(localStorage.getItem('users'));
  const user = users.find(u => u.email === email);

  if(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = 'dashboard.html';
  } else {
    alert('User not found!');
  }
});

// ================== IMAGE HANDLING ================== //
document.getElementById('cropImage')?.addEventListener('change', function(e) {
  const reader = new FileReader();
  const preview = document.getElementById('imagePreview');
  
  reader.onload = function() {
    preview.src = reader.result;
    preview.style.display = 'block';
  }
  
  if(this.files[0]) reader.readAsDataURL(this.files[0]);
});

// ================== CROP MANAGEMENT ================== //
document.getElementById('cropForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const reader = new FileReader();
  const imageFile = document.getElementById('cropImage')?.files[0];

  const cropData = {
    id: Date.now(),
    farmerId: currentUser?.id,
    name: document.getElementById('cropName').value,
    price: document.getElementById('cropPrice').value,
    quantity: document.getElementById('cropQuantity').value,
    phone: document.getElementById('cropPhone').value,
    location: currentUser?.location,
    type: 'urban',
    date: new Date().toLocaleDateString()
  };

  const handleSubmission = (imageData = null) => {
    const crops = JSON.parse(localStorage.getItem('crops'));
    crops.push({...cropData, image: imageData});
    localStorage.setItem('crops', JSON.stringify(crops));
    alert('Crop listed successfully!');
    loadUserCrops();
    document.getElementById('cropForm')?.reset();
    document.getElementById('imagePreview').style.display = 'none';
  };

  if(imageFile) {
    reader.onloadend = () => handleSubmission(reader.result);
    reader.readAsDataURL(imageFile);
  } else {
    handleSubmission();
  }
});

// ================== LISTINGS MANAGEMENT ================== //
function loadUserCrops() {
  if(!currentUser) return;
  
  const crops = JSON.parse(localStorage.getItem('crops'));
  const userCrops = crops.filter(c => c.farmerId === currentUser.id);
  
  const listingsDiv = document.getElementById('myListings');
  if(listingsDiv) {
    listingsDiv.innerHTML = userCrops.map(crop => `
      <div class="crop-card">
        ${crop.image ? `<img src="${crop.image}" alt="${crop.name}" class="crop-image">` : ''}
        <h3>${crop.name}</h3>
        <p>Price: ₦${crop.price}/kg</p>
        <p>Quantity: ${crop.quantity}kg</p>
        <p>Location: ${crop.location}</p>
        <p>Contact: ${crop.phone}</p>
      </div>
    `).join('');
  }
}

function loadAllCrops() {
  const crops = JSON.parse(localStorage.getItem('crops'));
  const grid = document.getElementById('cropGrid');
  
  if(grid) {
    grid.innerHTML = crops.map(crop => `
      <div class="crop-card">
        ${crop.image ? `<img src="${crop.image}" alt="${crop.name}" class="crop-image">` : ''}
        <h3>${crop.name}</h3>
        <p>Price: ₦${crop.price}/kg</p>
        <p>Quantity: ${crop.quantity}kg</p>
        <p>Location: ${crop.location}</p>
        <p>Contact: ${crop.phone}</p>
        <p>Seller: ${crop.type === 'urban' ? 'Urban Farmer' : 'Rural Farmer'}</p>
      </div>
    `).join('');
  }
}

// ================== AUTH MANAGEMENT ================== //
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// ================== INITIALIZATION ================== //
if(window.location.pathname.endsWith('dashboard.html')) {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if(!currentUser) window.location.href = 'index.html';
  loadUserCrops();
}

if(window.location.pathname.endsWith('listings.html')) {
  loadAllCrops();
}