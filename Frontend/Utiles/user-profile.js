
const previousURL = document.referrer;

function getUserId() {

  const userDataStr = localStorage.getItem('user_data');
   const userData = JSON.parse(userDataStr || '{}');
   userId = userData.id;
if (userId) {

  return userId;
}
}

document.addEventListener('DOMContentLoaded', async function () {
const userIdParam = new URLSearchParams(window.location.search).get('userId');
const adminView = document.getElementById('adminView');
const editableView = document.getElementById('editableView');


if (userIdParam) {
  // 🛑 Hide editable (user) view
  editableView?.setAttribute('style', 'display: none;');

  // ✅ Show admin view
  adminView?.removeAttribute('style');

  return; // Stop the rest of user-profile.js
}

// ✅ Self-profile case
editableView?.removeAttribute('style');
adminView?.setAttribute('style', 'display: none;');

// ✅ Rest of your user-profile.js code here...

  const userDataStr = localStorage.getItem('user_data');
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const emailInput = document.getElementById('email');
  const userNameEl = document.getElementById('userName');
  const avatarImg = document.getElementById('uploadedAvatar');
  const fileInput = document.getElementById('upload');
  const removeBtn = document.querySelector('.account-image-reset');
  const defaultAvatar = '../../assets/img/avatars/1.png';

const adminMenuItem = document.getElementById('adminMenuItem');
// Show/hide password toggle for both fields
['password', 'confirmPassword'].forEach(id => {
  const input = document.getElementById(id);
  const icon = input?.closest('.input-group')?.querySelector('.input-group-text i');

  if (input && icon) {
    icon.parentElement.addEventListener('click', function () {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      icon.classList.toggle('ri-eye-off-line');
      icon.classList.toggle('ri-eye-line');
    });
  }
});


const menuMap = {
  'dashboard.html': 'dashboardMenuItem',
  'accounts.html': 'accountMenuItem',
  'projects.html': 'projectMenuItem',
  'requirements.html': 'requirementMenuItem',
  'testcases.html': 'testcaseMenuItem',
  'traceability.html': 'traceabilityMenuItem',
  'admin.html': 'adminMenuItem'
};

// 🧹 Clear previous active class from all menu items
document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));

// ✅ Special case: if you're viewing user-profile with userId param → activate admin menu
if (previousURL.includes('user-profile.html')) {
  document.getElementById('adminMenuItem')?.classList.add('active');
} else {
  // ✅ Otherwise use previousURL matching logic
  for (const page in menuMap) {
    if (previousURL.includes(page)) {
      document.getElementById(menuMap[page])?.classList.add('active');
      break;
    }
  }
}



  // Set user data
  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr);
      if (userData.name) {
        const nameParts = userData.name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        if (firstNameInput) firstNameInput.value = firstName;
        if (lastNameInput) lastNameInput.value = lastName;
      }
      if (userNameEl && userData.name) userNameEl.textContent = userData.name;
      if (emailInput && userData.email) emailInput.value = userData.email;
    } catch (err) {
      console.error('Failed to parse user_data:', err);
    }
  }

  // Profile image upload
  if (fileInput && avatarImg && removeBtn) {
    fileInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      const isValid = file && file.size <= 800 * 1024 && /image\/(jpeg|png|gif|jpg)/.test(file.type);
      if (isValid) {
        const reader = new FileReader();
        reader.onload = e => avatarImg.src = e.target.result;
        reader.readAsDataURL(file);
      } else {
        alert('Invalid file. Please select JPG, PNG, or GIF under 800KB.');
        fileInput.value = '';
      }
    });

    removeBtn.addEventListener('click', function () {
      avatarImg.src = defaultAvatar;
      fileInput.value = '';
    });
  }

  // ✅ Initialize DataTable only after jQuery is loaded

const saveBtn = document.getElementById('save-profile-btn');


if (saveBtn) {
  saveBtn.addEventListener('click', async function (e) {
    e.preventDefault();

    const inputFirstName = document.getElementById('firstName')?.value.trim();
    const inputLastName = document.getElementById('lastName')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value.trim();
    const userId = getUserId();

    // Fallback: Get name from localStorage if inputs are empty
    let firstName = inputFirstName;
    let lastName = inputLastName;

    if (!firstName || !lastName) {
      const userDataStr = localStorage.getItem('user_data');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          const nameParts = userData.name?.split(' ') || [];
          if (!firstName) firstName = nameParts[0] || '';
          if (!lastName) lastName = nameParts.slice(1).join(' ') || '';
        } catch (err) {
          console.error("❌ Failed to parse localStorage user_data:", err);
        }
      }
    }

    // Combine full name
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();

    if (!fullName) {
      alert("❌ Name is required.");
      return;
    }

    const payload = {
      name: fullName,
      email: email , // fallback if needed
      password: password   // fallback if needed
    };

    try {
      const res = await fetch(`/api/v1.0/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`Update failed with status ${res.status}`);

      const updatedUser = await res.json();

      // ✅ Save updated user data to localStorage
      localStorage.setItem('user_data', JSON.stringify(updatedUser));

      alert("✅ User updated successfully.");
    } catch (err) {
      console.error("❌ Error updating user:", err);
      alert("❌ Failed to update user.");
    }

  });
}


const userId =getUserId();
console.log("userIduserIduserId",userId)
if (!userId) {
  console.error('User ID not found.');
  return;
}

const tableEl = document.getElementById('accountsProjectsTable');
if (!tableEl) return;

try {
  const response = await fetch(`/api/v1.0/users/roles/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) throw new Error('Failed to fetch user roles');

  const apiData = await response.json();

  // Assuming `apiData` is an array of objects like:
  // [{ account: 'Acme', project: 'Redesign', role: 'Admin' }, ...]

  $(tableEl).DataTable({
    data: apiData,
   columns: [
       { data: 'account.name' },
       { data: 'project.name' },
       { data: 'roleType' }
     ],
    columnDefs: [
      {
        targets: 0,
        render: (data, type, full) => `
          <div class="d-flex justify-content-start align-items-center user-name">
            <div class="d-flex flex-column">
              <a class="text-heading text-nowrap fw-medium" href="#">${full?.account?.name || ''}</a>
            </div>
          </div>
        `
      },
      {
        targets: 1,
        render: (data, type, full) => `<div class="text-body">${full?.project?.name || ''}</div>`
      },
      {
        targets: 2,
        render: (data, type, full) => `<span>${full?.roleType || ''}</span>`
      }
    ],
    layout: {
      topStart: { rowClass: '', features: [] },
      topEnd: {},
      bottomStart: { rowClass: 'row mx-3 justify-content-between', features: ['info'] },
      bottomEnd: 'paging'
    },
    lengthMenu: [5],
    language: {
      paginate: {
        next: '<i class="icon-base ri ri-arrow-right-s-line scaleX-n1-rtl icon-22px"></i>',
        previous: '<i class="icon-base ri ri-arrow-left-s-line scaleX-n1-rtl icon-22px"></i>',
        first: '<i class="icon-base ri ri-skip-back-mini-line scaleX-n1-rtl icon-22px"></i>',
        last: '<i class="icon-base ri ri-skip-forward-mini-line scaleX-n1-rtl icon-22px"></i>'
      }
    }
  });
} catch (err) {
  console.error('Error loading table data:', err);
}
});
