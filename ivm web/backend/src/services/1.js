let AllCurrent_page = 1;
let AllLimitPerPage = 2;


const orderData = async () => {
  const response = await fetch(`${baseUrl}/api/order/date?page=${AllCurrent_page}&limit=${AllLimitPerPage}`);
  const data = await response.json();
  return data;
};

document.addEventListener("DOMContentLoaded", async () => {
  const data = await orderData();      // WAIT HERE
  console.log("RAW API response:", data);

  const tableBody = document.getElementById("tableBody");
  const AllNextBtn = document.getElementById('AllNextBtn');
  const AllPreviousBtn = document.getElementById('AllPreviousBtn');
  const AllTotalPagination = document.getElementById('AllTotalPagination');
  const AllPage1EL = document.getElementById('AllPage1');
  const AllPage2EL = document.getElementById('AllPage2');
  const AllPage3EL = document.getElementById('AllPage3');
  const AllPreviousPage1 = document.getElementById('AllPreviousPage1');
  const AllPreviousPage2 = document.getElementById('AllPreviousPage2');
  let AllMax_Pages = 0;


  function limit(){
  const AllLimitBtn = document.getElementById("AllLimitBtn");
  const AllLimitMenu = document.getElementById("AllLimitMenu");
  const AllLimitValue = document.getElementById("AllLimitValue");

    // Toggle dropdown
    AllLimitBtn.addEventListener("click", () => {
        AllLimitMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
        if (!AllLimitBtn.contains(e.target) && !AllLimitMenu.contains(e.target)) {
            AllLimitMenu.classList.add("hidden");
        }
    });

    document.querySelectorAll("#AllLimitMenu button").forEach(btn => {
        btn.addEventListener("click", async () => {
            AllLimitPerPage = Number(btn.dataset.limit);
            AllLimitValue.innerText = AllLimitPerPage;
            AllLimitMenu.classList.add("hidden");

            // Reload your data with new limit
            AllCurrent_page = 1;      // reset to first page
            await load();          // your existing load() function
        });
    });
  }

  limit()

  function updatePaginationDisplay(totalRecords, AllLimitPerPage) {
    AllMax_Pages = Math.ceil(totalRecords / AllLimitPerPage);
    if (AllTotalPagination) AllTotalPagination.innerText = `${AllCurrent_page} / ${AllMax_Pages}`;


    const setPageActive = (el, isActive) => {
        if (!el) return;
        el.classList.toggle('text-blue-500', isActive);
        el.classList.toggle('bg-blue-100/60', isActive);
        el.classList.toggle('text-gray-500', !isActive);
        el.classList.toggle('hover:bg-gray-100', !isActive);
    }

    // Reset/clear active classes
    [AllPage1EL, AllPage2EL, AllPage3EL,AllPreviousPage1,AllPreviousPage2].forEach(el => {
      setPageActive(el, false);
    });

    if (AllPage1EL) {
        const AllPage_Num = AllCurrent_page;
        AllPage1EL.innerText = AllPage_Num;
        AllPage1EL.dataset.page = AllPage_Num; // 👈 CRITICAL: Set the data attribute
        setPageActive(AllPage1EL, AllPage_Num === AllCurrent_page);
    }
    
    if (AllPage2EL) {
      const AllPage_Num = AllCurrent_page + 1;
      const isVisible = AllPage_Num <= AllMax_Pages;
      
      AllPage2EL.innerText = isVisible ? AllPage_Num : '';
      AllPage2EL.dataset.page = AllPage_Num; // 👈 CRITICAL: Set the data attribute
      AllPage2EL.style.display = isVisible ? 'inline' : 'none';
      setPageActive(AllPage2EL, AllPage_Num === AllCurrent_page);
    }
    if (AllPage3EL) {
      const AllPage_Num = AllCurrent_page + 2;
      const isVisible = AllPage_Num <= AllMax_Pages;
      
      AllPage3EL.innerText = isVisible ? AllPage_Num : '';
      AllPage3EL.dataset.page = AllPage_Num; // 👈 CRITICAL: Set the data attribute
      AllPage3EL.style.display = isVisible ? 'inline' : 'none';
      setPageActive(AllPage3EL, AllPage_Num === AllCurrent_page);
    }
    if (AllPreviousPage1) {
      const AllPage_Num = AllCurrent_page - 1;
      const isVisible = AllPage_Num >= 1 && AllPage_Num <= AllMax_Pages;
      AllPreviousPage1.innerText = isVisible ? AllPage_Num : '';
      AllPreviousPage1.dataset.page = String(AllPage_Num);
      AllPreviousPage1.style.display = isVisible ? 'inline' : 'none';
      setPageActive(AllPreviousPage1, AllPage_Num === AllCurrent_page);
    }
    if (AllPreviousPage2) {
      const AllPage_Num = AllCurrent_page - 2;
      const isVisible = AllPage_Num >= 1 && AllPage_Num <= AllMax_Pages;
      AllPreviousPage2.innerText = isVisible ? AllPage_Num : '';
      AllPreviousPage2.dataset.page = String(AllPage_Num);
      AllPreviousPage2.style.display = isVisible ? 'inline' : 'none';
      setPageActive(AllPreviousPage2, AllPage_Num === AllCurrent_page);
    }

    // Control button states
    AllPreviousBtn.disabled = AllCurrent_page === 1;
    AllNextBtn.disabled = AllCurrent_page >= AllMax_Pages;
  }

  async function handlePageClick(element) {
    // Get the page number from the reliable data attribute
    const AllPage_Num = element.dataset.page; 
    
    const AllPage_Number = parseInt(AllPage_Num);
    
    // Check if the link is a valid, visible page number
    if (isNaN(AllPage_Number) || AllPage_Number < 1 || AllPage_Number > AllMax_Pages) {
        console.warn('Invalid page number clicked:', AllPage_Num);
        return;
    }
    
    AllCurrent_page = AllPage_Number;
    await load();
  }

  const displayedData = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];      // SAFE COPY
  // console.log("displayedData",displayedData);

  async function load() {
    const data = await orderData();
    console.log("Current page used for API call:", AllCurrent_page);
    const displayedData = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];
        const totalRecords = data.total || 0;
        const AllLimitPerPage = data.limit || 2;
        updatePaginationDisplay(totalRecords, AllLimitPerPage);

    tableBody.innerHTML = displayedData.map(rowHtml).join('');
  }

  // const searchInput = document.getElementById("searchInput");
  

  AllNextBtn.addEventListener('click',async ()=>{
    if (!AllNextBtn.disabled) {
      AllCurrent_page += 1;
      await load();
    }
})

  AllPreviousBtn.addEventListener('click', async()=>{
    if (AllCurrent_page > 1) {
      AllCurrent_page -= 1;
    }
  await load()
  })

  if (AllPage1EL) {
    AllPage1EL.addEventListener('click', () => handlePageClick(AllPage1EL));
  }
  if (AllPage2EL) {
    AllPage2EL.addEventListener('click', () => handlePageClick(AllPage2EL));
  }
  if (AllPage3EL) {
    AllPage3EL.addEventListener('click', () => handlePageClick(AllPage3EL));
  }
    if (AllPreviousPage1) AllPreviousPage1.addEventListener('click', () => handlePageClick(AllPreviousPage1));
    if (AllPreviousPage2) AllPreviousPage2.addEventListener('click', () => handlePageClick(AllPreviousPage2));


  await load();

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