// SIDEBAR

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
  const response = await fetch('http://localhost:3000/api/order/new');
  const data = await response.json();
  return data;
};

document.addEventListener("DOMContentLoaded", async () => {
  const data = await masterData();      // WAIT HERE
  console.log("RAW API response:", data);

  const displayedData = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];      // SAFE COPY
  console.log(displayedData);
  const tableBody = document.getElementById("tableBody");
  const searchInput = document.getElementById("searchInput");

  if (!tableBody) {
    console.error("tableBody element not found (id='tableBody').");
    return;
  }
  if (!searchInput) {
    console.error("searchInput element not found (id='searchInput').");
    return;
  }

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



// Search Function of product table
  searchInput.addEventListener("input", () => {
      const value = searchInput.value.toLowerCase();

      if (!value) {
      // empty -> show all
      renderRows(displayedData);
      return;
    }

      const filtered = displayedData.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(value)
        )
      );
      renderRows(filtered)
  });
  

  // details 

  const totalSales=document.getElementById('totalSales')
  const totalShipment = document.getElementById('totalShipment')
  const totalOrder=document.getElementById('totalOrder')
  const avgDelTime = document.getElementById('avgDelTime')

  // detail1
  const totalValue = (num)=>{
    if (!Array.isArray(num) || num.length === 0) return 0;
    const sum = num.reduce((a, b) => a + Number(b.cost), 0);
    totalSales.innerText = `$${sum}`
  }
  totalValue(displayedData)

  // detail2

  const delivered = displayedData.filter(item => item.status === "Shipped").length;
  totalShipment.innerText = delivered


  // detail3
  totalOrder.innerText = displayedData.length

  // detail4
  const averageDT =()=>{
    // const check = displayedData.filter(item => item.status === "Shipped");
      const answer = displayedData.reduce((a, b) => {
        const days = Number(b.delivery.match(/\d+/)[0]);
        return a + days;
      }, 0);
      avgDelTime.innerText = `${answer} Days`
  }
  averageDT()

});



// charts

// chart1

  (function () {
  let countryChartInstance = null;

  function genColors(n) {
    const base = [
      '#2563eb', '#38bdf8', '#f97316', '#10b981', '#ef4444',
      '#8b5cf6', '#f59e0b', '#06b6d4', '#7c3aed', '#84cc16'
    ];
    if (n <= base.length) return base.slice(0, n);
    const out = [];
    for (let i = 0; i < n; i++) out.push(base[i % base.length]);
    return out;
  }

  // format value into rupee-friendly string
  // examples: 300 -> "₹300", 10000 -> "10k", 100000 -> "100k", 1200000 -> "1.2M"
  function formatRupee(v, mode = "auto") {
    // ensure numeric
    const n = Number(v) || 0;

    if (mode === "raw") {
      // raw: show full rupee value with ₹ and thousands separator
      return `₹${n.toLocaleString('en-IN')}`;
    }

    // auto mode: choose compact units
    if (n < 1000) return `₹${n}`;            // 0 - 999 => ₹300
    if (n < 100000) {                        // 1k - 99,999 => show as "10k" or "12.3k"
      const k = n / 1000;
      // if integer small number show no decimals else 1 decimal
      return (Number.isInteger(k) ? `${k}k` : `${+k.toFixed(1)}k`);
    }
    if (n < 10000000) {                      // 1L - 99L -> show as "100k", "2.5M" not desired — treat 100k as 100k
      const k = n / 1000;
      return `${Math.round(k)}k`;            // e.g., 100000 -> "100k"
    }
    // million and above
    const m = n / 1000000;
    return (Number.isInteger(m) ? `${m}M` : `${+m.toFixed(1)}M`);
  }

  function niceMax(values) {
    const maxv = Math.max(...values, 0);
    if (maxv === 0) return 10;
    // choose step based on magnitude
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxv)));
    const step = magnitude / 2;
    return Math.ceil((maxv + step) / step) * step;
  }

  /**
   * renderCountryChart(labels, values, opts)
   * opts = { formatMode: "auto"|"raw", currencyPrefix: "₹" (unused for auto but could be extended) }
   */
  function renderCountryChart(labels, values, opts = {}) {
    const { formatMode = "auto" } = opts;

    if (!Array.isArray(labels) || !Array.isArray(values)) {
      console.error('labels and values must be arrays');
      return;
    }

    if (labels.length !== values.length) {
      console.warn('labels and values lengths differ — extra values will be ignored or padded with 0s');
    }

    const length = labels.length;
    const finalValues = values.slice(0, length).concat(Array(Math.max(0, length - values.length)).fill(0)).map(v => Number(v) || 0);

    const ctxEl = document.getElementById('countryChart');
    if (!ctxEl) {
      console.error('No canvas with id countryChart found');
      return;
    }
    const ctx = ctxEl.getContext('2d');

    if (countryChartInstance) { countryChartInstance.destroy(); countryChartInstance = null; }

    // const bgColors = backgroundColor: [ 'blue','skyblue',],

    countryChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Value',
          data: finalValues,
          backgroundColor: ['blue','skyblue'],
          borderRadius: 6,
          barThickness: 29,
          categoryPercentage: 0.4,
        }]
      },
      options: {
        indexAxis: 'y',
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                // for horizontal chart parsed.x contains numeric value
                const val = ctx.parsed && (ctx.parsed.x ?? ctx.parsed);
                return formatRupee(val, formatMode);
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            beginAtZero: true,
            max: niceMax(finalValues),
            ticks: {
              color: '#374151',
              font: { size: 16, weight: '500' },
              callback: (value) => formatRupee(value, formatMode)
            },
            grid: { display: false }
          },
          y: {
            grid: { display: false },
            ticks: {
              color: '#374151',
              font: { size: 14, weight: '600' }
            }
          }
        }
      }
    });

    return countryChartInstance;
  }

  // expose
  window.renderCountryChart = renderCountryChart;
})();

const chart1Data = async () => {
      const res = await fetch("http://localhost:3000/api/data/chart1data");
      const data  = await res.json();
      return data;
}
const  copy1Chart = await chart1Data();
const act1ChartData = { ...copy1Chart };
const labels1 = act1ChartData.labels
const values1 = act1ChartData.values
console.log(act1ChartData,labels1)

// auto chosen formatting
renderCountryChart(labels1, values1);




// chart2

const chartsales=document.getElementById('chartsales')

const chartSValue = (num)=>{
    if (!Array.isArray(num) || num.length === 0) return 0;
    const sum = num.reduce((a, b) => a + Number(b), 0);
    chartsales.innerText = `$${sum}`
  }



const chartData = async () => {
      const res = await fetch("http://localhost:3000/api/data/chart2data");
      const data  = await res.json();
      return data;

}
const  copyChart = await chartData();
const actChartData = { ...copyChart };
const labels = actChartData.labels
const values = actChartData.values
console.log(actChartData)
chartSValue(values)
/* ---------- build chart ---------- */
const ctx = document.getElementById('salesChart').getContext('2d');

/* gradient fill */
const grad = ctx.createLinearGradient(0, 0, 0, 300);
grad.addColorStop(0, 'rgba(37,99,235,0.18)');  // top = blue  (rgba(37,99,235) = #2563EB)
grad.addColorStop(0.6, 'rgba(59,130,246,0.08)');
grad.addColorStop(1, 'rgba(59,130,246,0.02)'); // bottom faint

/* create chart instance */
const salesChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels,
    datasets: [{
      label: 'Sales',
      data: values,
      fill: true,
      backgroundColor: grad,
      borderColor: '#2563EB',       // line color
      pointBackgroundColor: '#2563EB',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#2563EB',
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2,
      tension: 0.36,               // smooth curve
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600 },
    plugins: {
      legend: { display: false },

      tooltip: {
        enabled: false, // disable native tooltip; we'll use custom to match bubble look
        external: function(context) {
          // custom tooltip to mimic the speech-bubble style
          const tooltipModel = context.tooltip;
          const canvas = context.chart.canvas;
          const chartRect = canvas.getBoundingClientRect();

          // remove old tooltip element
          let tooltipEl = document.getElementById('chartjs-tooltip');
          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            document.body.appendChild(tooltipEl);
          }

          // hide if no tooltip or not active
          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          // position and style
          tooltipEl.style.opacity = 1;
          tooltipEl.style.position = 'absolute';
          tooltipEl.style.pointerEvents = 'none';
          tooltipEl.style.transform = 'translate(-50%, -120%)';
          tooltipEl.style.background = '#fff';
          tooltipEl.style.border = '1px solid rgba(0,0,0,0.08)';
          tooltipEl.style.padding = '8px 10px';
          tooltipEl.style.borderRadius = '8px';
          tooltipEl.style.boxShadow = '0 6px 18px rgba(16,24,40,0.08)';
          tooltipEl.style.fontSize = '13px';
          tooltipEl.style.color = '#0f172a';
          tooltipEl.style.whiteSpace = 'nowrap';
          tooltipEl.style.zIndex = 9999;

          // data
          const item = tooltipModel.dataPoints && tooltipModel.dataPoints[0];
          if (!item) return;

          const value = item.formattedValue || item.raw;
          // sample formatting: $32,849 (use toLocaleString)
          const formatted = '$' + Number(item.raw).toLocaleString();

          // draw small dot marker inside tooltip (like screenshot)
          tooltipEl.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px">
              <div style="width:10px;height:10px;border-radius:6px;background:#2563EB;box-shadow:0 0 0 4px rgba(37,99,235,0.08)"></div>
              <div style="font-weight:600">${formatted}</div>
            </div>
          `;

          // calculate position: align to the hovered point
          const canvasRect = context.chart.canvas.getBoundingClientRect();
          const caretX = canvasRect.left + window.scrollX + tooltipModel.caretX;
          const caretY = canvasRect.top + window.scrollY + tooltipModel.caretY;

          tooltipEl.style.left = caretX + 'px';
          tooltipEl.style.top = (caretY - 18) + 'px';
        }
      },

      annotation: {
        // dashed vertical marker line on 'Tue' (change 'value' to index or label)
        annotations: {
          markerLine: {
            type: 'line',
            scaleID: 'x',
            value: 'Tue',                  // label at which line appears
            borderColor: 'rgba(99,102,241,0.6)',
            borderWidth: 2,
            borderDash: [6,6],
            // extend from top to bottom
            drawTime: 'afterDatasetsDraw',
            label: {
              display: false
            }
          }
        }
      }
    },

    scales: {
      x: {
        grid: {
          // vertical column style (light rectangles)
          color: 'rgba(99,102,241,0.06)',
          borderDash: [10,10],
          drawBorder: false,
          tickLength: 0
        },
        ticks: {
          color: '#6B7280',
          padding: 8
        }
      },
      y: {
        grid: {
          color: 'rgba(99,102,241,0.03)',
          drawBorder: false
        },
        ticks: {
          color: '#6B7280',
          callback: function(v) {
            // convert to hours-like label in screenshot? Here keep currency small number formatting
            // If your data are dollars, you can format: return '$' + v;
            return v >= 1000 ? (v/1000) + 'k' : v;
          },
          padding: 6
        }
      }
    },

    interaction: {
      mode: 'index',
      intersect: false,
      axis: 'x'
    },

    hover: {
      mode: 'nearest',
      intersect: true
    }
  }
});

/* ---------- make tooltip show on hover (simulate hover) ---------- */
document.getElementById('salesChart').addEventListener('mousemove', function(evt) {
  const points = salesChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
  if (points.length) {
    salesChart.setActiveElements(points.map(p => ({ datasetIndex: p.datasetIndex, index: p.index })));
    salesChart.tooltip.setActiveElements(points.map(p => ({ datasetIndex: p.datasetIndex, index: p.index })), {x: pX = points[0].element.x, y: points[0].element.y});
    salesChart.update('none');
  } else {
    // clear tooltip
    salesChart.tooltip.setActiveElements([], {x:0,y:0});
    salesChart.update('none');
  }
});



