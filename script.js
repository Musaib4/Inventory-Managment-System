const sidebar =document.getElementById('sidebar')
const sidebtn = document.getElementById('btn')
const mainContent = document.getElementById('main')
const openbtn = document.getElementById('btn1')

sidebtn.addEventListener('click',()=>{
  sidebar.classList.toggle('hidden');
  mainContent.classList.toggle('side')
  openbtn.classList.toggle('hidden')
})

openbtn.addEventListener('click',()=>{
  sidebar.classList.toggle('hidden');
  mainContent.classList.toggle('side')
  openbtn.classList.toggle('hidden')
})



// table of products



const masterData = async () => {
  const response = await fetch('http://localhost:3000/masterdata');
  const data = await response.json();
  return data;
};

document.addEventListener("DOMContentLoaded", async () => {
  const data = await masterData();      // WAIT HERE
  const displayedData = [...data];      // SAFE COPY
  console.log(displayedData);

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
  rowHtml(displayedData)

  function renderRows(list) {
    tableBody.innerHTML = list.map(rowHtml).join('');
  }

  renderRows(displayedData);


});




