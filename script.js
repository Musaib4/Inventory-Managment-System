const sidebar =document.getElementById('sidebar')
const sidebtn = document.getElementById('btn')
const mainContent = document.getElementById('main')

sidebtn.addEventListener('click',()=>{
  sidebar.classList.toggle('hidden');
  mainContent.classList.toggle('side')
})




document.addEventListener('DOMContentLoaded', () => {
  // master data (original) and displayedData (what we render)
  const masterData = [
    { id: '#TD74844', dest: 'USA', destFlag: 'flags/usa.png', customer: 'Esther Howard', custAvatar: 'avatars/esther.jpg', delivery: '5-7 days', carrier: 'Kathryn Murphy', carrierAvatar: 'avatars/c1.jpg', cost: 12.5, status: 'On Delivery'},
    { id: '#TD74845', dest: 'Canada', destFlag: 'flags/canada.png', customer: 'Guy Hawkins', custAvatar: 'avatars/guy.jpg', delivery: '7-10 days', carrier: 'Courtney Henry', carrierAvatar: 'avatars/c2.jpg', cost: 20.0, status: 'Shipped'},
    { id: '#TD74846', dest: 'India', destFlag: 'flags/india.png', customer: 'Wade Warren', custAvatar: 'avatars/wade.jpg', delivery: '2-3 days', carrier: 'Arlene McCoy', carrierAvatar: 'avatars/c3.jpg', cost: 15.0, status: 'Pending'},
    { id: '#TD74847', dest: 'UK', destFlag: 'flags/uk.png', customer: 'Leslie Alexander', custAvatar: 'avatars/leslie.jpg', delivery: '3 days', carrier: 'Theresa Webb', carrierAvatar: 'avatars/c4.jpg', cost: 10.0, status: 'Shipped'},
  ];

  let displayedData = [...masterData];

  const tableBody = document.getElementById('tableBody');
  const searchInput = document.getElementById('tableSearch'); // ensure this exists in your HTML

  function badgeClass(status) {
    if (status === 'Shipped') return 'text-green-600 bg-green-50';
    if (status === 'Pending') return 'text-yellow-600 bg-yellow-50';
    if (status === 'On Delivery') return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  }

  function rowHtml(item) {
    return `
    <div class="grid grid-cols-7 items-center gap-4 px-4 py-4">
      <div class="text-sm font-medium text-gray-800">${item.id}</div>
      <div class="flex items-center gap-2">
        <img src="${item.destFlag}" alt="${item.dest}" class="w-5 h-5 rounded-sm" />
        <span class="text-sm text-gray-700">${item.dest}</span>
      </div>
      <div class="flex items-center gap-3">
        <img src="${item.custAvatar}" alt="${item.customer}" class="w-8 h-8 rounded-full object-cover" />
        <span class="text-sm text-gray-800">${item.customer}</span>
      </div>
      <div class="text-sm text-gray-600">${item.delivery}</div>
      <div class="flex items-center gap-3">
        <img src="${item.carrierAvatar}" class="w-8 h-8 rounded-full" alt="${item.carrier}" />
        <span class="text-sm text-gray-800">${item.carrier}</span>
      </div>
      <div class="text-sm text-gray-800 font-medium">$${Number(item.cost).toFixed(2)}</div>
      <div>
        <span class="${badgeClass(item.status)} inline-block px-3 py-1 rounded-full text-xs font-semibold">${item.status}</span>
      </div>
    </div>
    `;
  }

  function renderRows(list) {
    tableBody.innerHTML = list.map(rowHtml).join('');
  }

  // initial render
  renderRows(displayedData);

  // arrow state
  let currentSortKey = null;
  let sortAsc = true;

  // helper to extract sortable value
  function valueForSort(item, key) {
    let v = item[key];
    if (key === 'cost') return Number(v) || 0;
    if (key === 'delivery') {
      // extract first number from "5-7 days" or "3 days"
      const m = String(v).match(/\d+/);
      return m ? Number(m[0]) : 0;
    }
    if (typeof v === 'string') return v.toLowerCase();
    return v == null ? '' : v;
  }

  function sortTable(key, toggleDirection = true) {
    if (toggleDirection) {
      if (currentSortKey === key) sortAsc = !sortAsc;
      else sortAsc = true;
    } else {
      if (currentSortKey !== key) sortAsc = true;
    }
    currentSortKey = key;

    displayedData.sort((a, b) => {
      const v1 = valueForSort(a, key);
      const v2 = valueForSort(b, key);

      if (v1 === v2) return 0;
      if (typeof v1 === 'number' && typeof v2 === 'number') return sortAsc ? v1 - v2 : v2 - v1;
      return sortAsc ? (v1 > v2 ? 1 : -1) : (v1 < v2 ? 1 : -1);
    });

    updateArrows();
    renderRows(displayedData);
  }

  // attach headers (they exist because DOMContentLoaded)
  document.querySelectorAll('[data-key]').forEach(header => {
    header.addEventListener('click', () => {
      const key = header.getAttribute('data-key');
      sortTable(key, true);
    });
  });

  function updateArrows() {
    document.querySelectorAll('[data-key]').forEach(header => {
      const arrow = header.querySelector('.sort-arrow');
      const key = header.getAttribute('data-key');
      if (!arrow) return;
      if (key === currentSortKey) {
        arrow.textContent = sortAsc ? '▲' : '▼';
        arrow.classList.remove('text-gray-400');
        arrow.classList.add('text-gray-700');
      } else {
        arrow.textContent = '↕';
        arrow.classList.remove('text-gray-700');
        arrow.classList.add('text-gray-400');
      }
    });
  }

  // call once so arrows show neutral state
  updateArrows();

  // simple debounce
  function debounce(fn, ms = 150){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); } }

  // search: filter masterData -> displayedData (so sort/search interplay works)
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      const q = e.target.value.toLowerCase().trim();
      displayedData = masterData.filter(d =>
        d.id.toLowerCase().includes(q) ||
        d.dest.toLowerCase().includes(q) ||
        d.customer.toLowerCase().includes(q)
      );
      // reapply current sorting if any
      if (currentSortKey) sortTable(currentSortKey, false);
      else renderRows(displayedData);
    }));
  }

  // expose for debugging
  window._table = { masterData, displayedData, sortTable };
});