// form /////////

(function () {
  const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
  const allowedTypes = ['image/jpeg','image/png','image/webp','image/gif'];

  const dropArea = document.getElementById('dropArea');
  const fileInput = document.getElementById('productImageInput');
  const fileStatus = document.getElementById('fileStatus');
  const fileError = document.getElementById('fileError');
  const form = document.getElementById('inventoryForm');

  let selectedFile = null;

  function humanFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
    return (bytes/(1024*1024)).toFixed(2) + ' MB';
  }

  function clearFile() {
    selectedFile = null;
    fileInput.value = '';
    fileStatus.textContent = '';
    fileError.classList.add('hidden');
  }

  function showError(msg) {
    fileError.textContent = msg;
    fileError.classList.remove('hidden');
    fileStatus.textContent = '';
  }

  function validateFile(file) {
    if (!file) return 'No file';
    if (!allowedTypes.includes(file.type)) return 'Allowed: JPG, PNG, WebP, GIF';
    if (file.size > MAX_BYTES) return `Max size ${humanFileSize(MAX_BYTES)}`;
    return null;
  }

  // common handlers to add/remove visual focus
  ['dragenter','dragover'].forEach(e => {
    dropArea.addEventListener(e, (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      dropArea.classList.add('ring-2','ring-blue-300','bg-blue-50');
    });
  });
  ['dragleave','dragend','drop'].forEach(e => {
    dropArea.addEventListener(e, (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      dropArea.classList.remove('ring-2','ring-blue-300','bg-blue-50');
    });
  });

  // drop event
  dropArea.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    if (!dt || !dt.files || dt.files.length === 0) return;
    const f = dt.files[0];
    const err = validateFile(f);
    if (err) { showError(err); return; }
    // accept
    selectedFile = f;
    // set file input's files so form serialization includes it
    try {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(f);
      fileInput.files = dataTransfer.files;
    } catch (e) {
      // not supported in some older browsers — form submission handled using selectedFile
    }
    fileStatus.textContent = `${f.name} • ${humanFileSize(f.size)}`;
    fileError.classList.add('hidden');
  });

  // click / browse fallback
  fileInput.addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) { clearFile(); return; }
    const err = validateFile(f);
    if (err) { showError(err); fileInput.value = ''; return; }
    selectedFile = f;
    fileStatus.textContent = `${f.name} • ${humanFileSize(f.size)}`;
    fileError.classList.add('hidden');
  });

  // keyboard accessibility: Enter/Space opens picker
  dropArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.focus();
      fileInput.click();
    }
  });

  // optional: show remove on double-click (simple)
  dropArea.addEventListener('dblclick', () => {
    clearFile();
  });

  // form submit: build FormData (includes file)
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    // basic validation example (trackingId required)
    const tracking = form.trackingId?.value?.trim();
    if (!tracking) { alert('Please fill Tracking ID'); return; }

    // rebuild FormData from form to include file input (if browser supports)
    const formData = new FormData(form);

    // if fileInput.files is empty but selectedFile exists (DataTransfer not supported),
    // manually append selectedFile
    if ((!fileInput.files || fileInput.files.length === 0) && selectedFile) {
      formData.append('productImage', selectedFile, selectedFile.name);
    }

    // send as multipart/form-data — server should accept this (e.g. multer)
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        body: formData // do not set Content-Type; browser sets boundary
      });
      if (!res.ok) throw new Error('Save failed: ' + res.status);
      const json = await res.json();
      alert('Saved: ' + (json.trackingId || json.id || 'OK'));
      form.reset();
      clearFile();
    } catch (err) {
      alert('Failed to save: ' + err.message);
    }
  });

})();

let newDetail = document.getElementById('newDetail')
let inventoryForm = document.getElementById('inventoryForm')
let inventoryButton =document.getElementById('inventoryButton')

inventoryButton.addEventListener('click',()=>{
    newDetail.classList.toggle('hidden')
    inventoryForm.classList.toggle('hidden')
})