// form /////////

// (function () {
//   const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
//   const allowedTypes = ['image/jpeg','image/png','image/webp','image/gif'];

//   const dropArea = document.getElementById('dropArea');
//   const fileInput = document.getElementById('productImageInput');
//   const fileStatus = document.getElementById('fileStatus');
//   const fileError = document.getElementById('fileError');
//   const form = document.getElementById('inventoryForm');

//   let selectedFile = null;

//   function humanFileSize(bytes) {
//     if (bytes < 1024) return bytes + ' B';
//     if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
//     return (bytes/(1024*1024)).toFixed(2) + ' MB';
//   }

//   function clearFile() {
//     selectedFile = null;
//     fileInput.value = '';
//     fileStatus.textContent = '';
//     fileError.classList.add('hidden');
//   }

//   function showError(msg) {
//     fileError.textContent = msg;
//     fileError.classList.remove('hidden');
//     fileStatus.textContent = '';
//   }

//   function validateFile(file) {
//     if (!file) return 'No file';
//     if (!allowedTypes.includes(file.type)) return 'Allowed: JPG, PNG, WebP, GIF';
//     if (file.size > MAX_BYTES) return `Max size ${humanFileSize(MAX_BYTES)}`;
//     return null;
//   }

//   // common handlers to add/remove visual focus
//   ['dragenter','dragover'].forEach(e => {
//     dropArea.addEventListener(e, (ev) => {
//       ev.preventDefault(); ev.stopPropagation();
//       dropArea.classList.add('ring-2','ring-blue-300','bg-blue-50');
//     });
//   });
//   ['dragleave','dragend','drop'].forEach(e => {
//     dropArea.addEventListener(e, (ev) => {
//       ev.preventDefault(); ev.stopPropagation();
//       dropArea.classList.remove('ring-2','ring-blue-300','bg-blue-50');
//     });
//   });

//   // drop event
//   dropArea.addEventListener('drop', (e) => {
//     const dt = e.dataTransfer;
//     if (!dt || !dt.files || dt.files.length === 0) return;
//     const f = dt.files[0];
//     const err = validateFile(f);
//     if (err) { showError(err); return; }
//     // accept
//     selectedFile = f;
//     // set file input's files so form serialization includes it
//     try {
//       const dataTransfer = new DataTransfer();
//       dataTransfer.items.add(f);
//       fileInput.files = dataTransfer.files;
//     } catch (e) {
//       // not supported in some older browsers — form submission handled using selectedFile
//     }
//     fileStatus.textContent = `${f.name} • ${humanFileSize(f.size)}`;
//     fileError.classList.add('hidden');
//   });

//   // click / browse fallback
//   fileInput.addEventListener('change', (e) => {
//     const f = e.target.files && e.target.files[0];
//     if (!f) { clearFile(); return; }
//     const err = validateFile(f);
//     if (err) { showError(err); fileInput.value = ''; return; }
//     selectedFile = f;
//     fileStatus.textContent = `${f.name} • ${humanFileSize(f.size)}`;
//     fileError.classList.add('hidden');
//   });

//   // keyboard accessibility: Enter/Space opens picker
//   dropArea.addEventListener('keydown', (e) => {
//     if (e.key === 'Enter' || e.key === ' ') {
//       e.preventDefault();
//       fileInput.focus();
//       fileInput.click();
//     }
//   });

//   // optional: show remove on double-click (simple)
//   dropArea.addEventListener('dblclick', () => {
//     clearFile();
//   });

//   // form submit: build FormData (includes file)
//   form.addEventListener('submit', async (ev) => {
//     ev.preventDefault();

//     // basic validation example (trackingId required)
//     const tracking = form.trackingId?.value?.trim();
//     if (!tracking) { alert('Please fill Tracking ID'); return; }

//     // rebuild FormData from form to include file input (if browser supports)
//     const formData = new FormData(form);

//     // if fileInput.files is empty but selectedFile exists (DataTransfer not supported),
//     // manually append selectedFile
//     if ((!fileInput.files || fileInput.files.length === 0) && selectedFile) {
//       formData.append('productImage', selectedFile, selectedFile.name);
//     }

//     // send as multipart/form-data — server should accept this (e.g. multer)
//     try {
//       const res = await fetch('/api/inventory', {
//         method: 'POST',
//         body: formData // do not set Content-Type; browser sets boundary
//       });
//       if (!res.ok) throw new Error('Save failed: ' + res.status);
//       const json = await res.json();
//       alert('Saved: ' + (json.trackingId || json.id || 'OK'));
//       form.reset();
//       clearFile();
//     } catch (err) {
//       alert('Failed to save: ' + err.message);
//     }
//   });

// })();

let newDetail = document.getElementById('newDetail')
let inventoryForm = document.getElementById('inventoryForm')
let inventoryButton =document.getElementById('inventoryButton')

inventoryButton.addEventListener('click',()=>{
    newDetail.classList.toggle('hidden')
    inventoryForm.classList.toggle('hidden')
})


const baseUrl = "http://localhost:3000"; // put in env for production

// adds the data via form 

inventoryForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    id: document.getElementById('trackingId').value,
    dest: document.getElementById('destination').value,
    customer: document.getElementById('customer').value,
    delivery: document.getElementById('deliveryTime').value,
    carrier: document.getElementById('carrier').value,
    cost: document.getElementById('cost').value,
    status: document.getElementById('status').value
  };

  try {
    const res = await fetch(`${baseUrl}/api/order/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    console.log('Created:', data);
    alert('Order created');
  } catch (err) {
    console.error(err);
    alert('Error: ' + err.message);
  }
});

// latest Products

const orderData = async () => {
  const response = await fetch(`${baseUrl}/api/order`);
  const data = await response.json();
  return data;
};

document.addEventListener("DOMContentLoaded", async () => {
  const data = await orderData();      // WAIT HERE
  console.log("RAW API response:", data);

  const displayedData = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];      // SAFE COPY
  console.log(displayedData);
  const tableBody = document.getElementById("tableBody");
  // const searchInput = document.getElementById("searchInput");

  if (!tableBody) {
    console.error("tableBody element not found (id='tableBody').");
    return;
  }
  // if (!searchInput) {
  //   console.error("searchInput element not found (id='searchInput').");
  //   return;
  // }

  function badgeClass(status) {
    if (status === 'Shipped') return 'text-green-600 bg-green-50';
    if (status === 'Pending') return 'text-yellow-600 bg-yellow-50';
    if (status === 'On Delivery') return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  }

  function rowHtml(item) {
    return `
    <tr class="block sm:table-row">
    <!-- Tracking ID -->
    <td class="block sm:table-cell px-4 py-4 align-top">
      <div class="flex items-center justify-between sm:block">
        <div>
          <div class="text-sm text-gray-600 dark:text-gray-400">${item.id}</div>
        </div>
        <div class="sm:hidden text-xs text-gray-500 mt-2">Tracking ID</div>
      </div>
    </td>

    <!-- Destination -->
    <td class="block sm:table-cell px-6 py-4 align-top">
      <div class="flex items-center justify-between sm:block">
        <div class="inline-block px-3 py-1 text-sm rounded-full bg-emerald-100/60 text-emerald-700 dark:bg-gray-800">${item.dest}</div>
        <div class="sm:hidden text-xs text-gray-500 mt-2">Destination</div>
      </div>
    </td>

    <!-- Customer (title + subtitle on small screens stacked) -->
    <td class="block sm:table-cell px-4 py-4 align-top">
      <div class="flex items-start justify-between sm:block">
        <div>
          <div class="text-sm font-medium text-gray-800 dark:text-gray-200">${item.customer}</div>
        <div class="sm:hidden text-xs text-gray-500 mt-2">Customer</div>
      </div>
    </td>

    <!-- Delivery -->
    <td class="block sm:table-cell px-4 py-4 align-top">
      <div class="text-sm text-gray-600 dark:text-gray-400">${item.delivery}</div>
    </td>

    <!-- Carrier -->
    <td class="block sm:table-cell px-4 py-4 align-top">
      <div class="flex items-center gap-2">
        <div class="flex -space-x-1 items-center">
          <!-- optional avatars; if you have images, replace the circles -->
          <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs border-2 border-white">${item.carrier}</div>
        </div>
      </div>
    </td>

    <!-- Cost -->
    <td class="hidden sm:table-cell px-4 py-4 align-top whitespace-nowrap">
      <div class="text-sm text-gray-900 dark:text-white">${item.cost}</div>
    </td>

    <!-- Status -->
    <td class="block sm:table-cell px-4 py-4 align-top">
      <div>
        <span class="inline-block px-3 py-1 text-sm rounded-full ">${item.status}</span>
      </div>
    </td>

    <!-- Date -->
    <td class="block sm:table-cell px-4 py-4 align-top">
      <div class="text-sm text-gray-600 dark:text-gray-400">${item.createdAt}</div>
    </td>

    <!-- Actions -->
    <td class="block sm:table-cell px-4 py-4 align-top text-right">
      <button aria-label="More actions" class="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"/>
        </svg>
      </button>
    </td>
  </tr>
    `;
  }
  rowHtml(displayedData)

  function renderRows(list) {
    tableBody.innerHTML = list.map(rowHtml).join('');
  }

  renderRows(displayedData);



});
// all products