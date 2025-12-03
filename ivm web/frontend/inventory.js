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

// All Orders

let current_page = 1;
let limitPerPage = 2;


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


// Latest  Orders





const latestOrderData = async () => {
  const response = await fetch(`${baseUrl}/api/order/date?latest=&page=${current_page}&limit=${limitPerPage}`);
  const data = await response.json();
  return data;
};


document.addEventListener("DOMContentLoaded", async () => {
  const data = await latestOrderData();
  console.log("Current page used for API call:", current_page);

  const latestTableBody = document.getElementById("latestTableBody");
  const nextBtn = document.getElementById('nextBtn');
  const previousBtn = document.getElementById('previousBtn');
  const totalPagination = document.getElementById('totalPagination');
  const page1El = document.getElementById('page1');
  const page2El = document.getElementById('page2');
  const page3El = document.getElementById('page3');
  const previousPage1 = document.getElementById('previousPage1');
  const previousPage2 = document.getElementById('previousPage2');
  let max_pages = 0;

  function limit(){
  const limitBtn = document.getElementById("limitBtn");
  const limitMenu = document.getElementById("limitMenu");
  const limitValue = document.getElementById("limitValue");

    // Toggle dropdown
    limitBtn.addEventListener("click", () => {
        limitMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
        if (!limitBtn.contains(e.target) && !limitMenu.contains(e.target)) {
            limitMenu.classList.add("hidden");
        }
    });

    document.querySelectorAll("#limitMenu button").forEach(btn => {
        btn.addEventListener("click", async () => {
            limitPerPage = Number(btn.dataset.limit);
            limitValue.innerText = limitPerPage;
            limitMenu.classList.add("hidden");

            // Reload your data with new limit
            current_page = 1;      // reset to first page
            await load();          // your existing load() function
        });
    });
  }

  limit()

  function updatePaginationDisplay(totalRecords, limitPerPage) {
    max_pages = Math.ceil(totalRecords / limitPerPage);
    if (totalPagination) totalPagination.innerText = `${current_page} / ${max_pages}`;


    const setPageActive = (el, isActive) => {
        if (!el) return;
        el.classList.toggle('text-blue-500', isActive);
        el.classList.toggle('bg-blue-100/60', isActive);
        el.classList.toggle('text-gray-500', !isActive);
        el.classList.toggle('hover:bg-gray-100', !isActive);
    }

    // Reset/clear active classes
    [page1El, page2El, page3El,previousPage1,previousPage2].forEach(el => {
      setPageActive(el, false);
    });

    if (page1El) {
        const pageNum = current_page;
        page1El.innerText = pageNum;
        page1El.dataset.page = pageNum; // 👈 CRITICAL: Set the data attribute
        setPageActive(page1El, pageNum === current_page);
    }
    
    if (page2El) {
      const pageNum = current_page + 1;
      const isVisible = pageNum <= max_pages;
      
      page2El.innerText = isVisible ? pageNum : '';
      page2El.dataset.page = pageNum; // 👈 CRITICAL: Set the data attribute
      page2El.style.display = isVisible ? 'inline' : 'none';
      setPageActive(page2El, pageNum === current_page);
    }
    if (page3El) {
      const pageNum = current_page + 2;
      const isVisible = pageNum <= max_pages;
      
      page3El.innerText = isVisible ? pageNum : '';
      page3El.dataset.page = pageNum; // 👈 CRITICAL: Set the data attribute
      page3El.style.display = isVisible ? 'inline' : 'none';
      setPageActive(page3El, pageNum === current_page);
    }
    if (previousPage1) {
      const pageNum = current_page - 1;
      const isVisible = pageNum >= 1 && pageNum <= max_pages;
      previousPage1.innerText = isVisible ? pageNum : '';
      previousPage1.dataset.page = String(pageNum);
      previousPage1.style.display = isVisible ? 'inline' : 'none';
      setPageActive(previousPage1, pageNum === current_page);
    }
    if (previousPage2) {
      const pageNum = current_page - 2;
      const isVisible = pageNum >= 1 && pageNum <= max_pages;
      previousPage2.innerText = isVisible ? pageNum : '';
      previousPage2.dataset.page = String(pageNum);
      previousPage2.style.display = isVisible ? 'inline' : 'none';
      setPageActive(previousPage2, pageNum === current_page);
    }

    // Control button states
    previousBtn.disabled = current_page === 1;
    nextBtn.disabled = current_page >= max_pages;
  }

  async function handlePageClick(element) {
    // Get the page number from the reliable data attribute
    const pageNum = element.dataset.page; 
    
    const pageNumber = parseInt(pageNum);
    
    // Check if the link is a valid, visible page number
    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > max_pages) {
        console.warn('Invalid page number clicked:', pageNum);
        return;
    }
    
    current_page = pageNumber;
    await load();
  }

  const displayedData = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];      // SAFE COPY
  // console.log("displayedData",displayedData);

  async function load() {
    const data = await latestOrderData();
    console.log("Current page used for API call:", current_page);
    const displayedData = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];
        const totalRecords = data.total || 0;
        const limitPerPage = data.limit || 2;
        updatePaginationDisplay(totalRecords, limitPerPage);

    latestTableBody.innerHTML = displayedData.map(rowHtml).join('');
  }

  // const searchInput = document.getElementById("searchInput");
  

  nextBtn.addEventListener('click',async ()=>{
    if (!nextBtn.disabled) {
      current_page += 1;
      await load();
    }
})

  previousBtn.addEventListener('click', async()=>{
    if (current_page > 1) {
      current_page -= 1;
    }
  await load()
  })

  if (page1El) {
    page1El.addEventListener('click', () => handlePageClick(page1El));
  }
  if (page2El) {
    page2El.addEventListener('click', () => handlePageClick(page2El));
  }
  if (page3El) {
    page3El.addEventListener('click', () => handlePageClick(page3El));
  }
    if (previousPage1) previousPage1.addEventListener('click', () => handlePageClick(previousPage1));
    if (previousPage2) previousPage2.addEventListener('click', () => handlePageClick(previousPage2));


  await load();


  // totalPagination.innerText = data.total


  if (!latestTableBody) {
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
    latestTableBody.innerHTML = list.map(rowHtml).join('');
  }

  renderRows(displayedData);
});

// const total_records_tr = document.querySelectorAll('#latestTableBody tr')
// const records_per_page = 10;
// const page_number = 1;
// const total_records = total_records_tr.length;
// const total_page = Math.ceil(total_records/records_per_page);

// function displayRecords(){
//   let start_index = (page_number-1) *records_per_page;
//   let end_index = start_index + (records_per_page -1);
//   let statement = '';
//   for(let i = start_index; i<=end_index; i++){
//     statement += `<tr>${total_records_tr[i].innerHTML}</tr>`
//   }

//   recordsDisplay.innerHTML = statement;
//   console.log(statement)

// }
// displayRecords()