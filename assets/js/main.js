function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', function () {
    // GFR chart — only rendered on home page
    const gfrChartEl = document.getElementById('gfrChart');
    if (gfrChartEl) {
        const ctx = gfrChartEl.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Start', 'Yr 1', 'Yr 2', 'Yr 3', 'Yr 4', 'Yr 5'],
                datasets: [
                    {
                        label: 'With consistent dietary management',
                        data: [60, 59, 58, 57, 56, 55],
                        borderColor: '#059669',
                        backgroundColor: 'rgba(5, 150, 105, 0.05)',
                        tension: 0.3,
                        fill: true,
                        pointRadius: 5,
                        pointBackgroundColor: '#059669'
                    },
                    {
                        label: 'Without dietary management',
                        data: [60, 54, 46, 38, 30, 22],
                        borderColor: '#a8a29e',
                        borderDash: [5, 5],
                        tension: 0.3,
                        fill: false,
                        pointRadius: 4,
                        pointBackgroundColor: '#a8a29e'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    y: {
                        title: { display: true, text: 'GFR (mL/min/1.73m²)' },
                        min: 0,
                        max: 70
                    }
                }
            }
        });
    }
});
