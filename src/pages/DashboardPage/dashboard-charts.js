// Dashboard Charts Module
const DashboardCharts = (function() {
    // Chart instances
    let revenueChart = null;
    let projectStatusChart = null;
    
    // Chart colors
    const colors = {
        primary: '#4361ee',
        secondary: '#3f37c9',
        success: '#4cc9f0',
        info: '#4895ef',
        warning: '#f72585',
        danger: '#f72585',
        light: '#f8f9fa',
        dark: '#212529',
        gray: '#6c757d',
        grayLight: '#e9ecef'
    };
    
    // Initialize all charts
    function init() {
        initRevenueChart();
        initProjectStatusChart();
        setupEventListeners();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Period toggle buttons
        document.querySelectorAll('[data-period]').forEach(btn => {
            btn.addEventListener('click', function() {
                const period = this.getAttribute('data-period');
                updateRevenueChart(period);
                
                // Update active state
                document.querySelectorAll('[data-period]').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Initialize revenue chart
    function initRevenueChart() {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        
        // Default data (will be updated)
        revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Revenue',
                    data: [],
                    borderColor: colors.primary,
                    backgroundColor: `${colors.primary}20`,
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: colors.primary,
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: getChartOptions('£')
        });
        
        // Load initial data
        updateRevenueChart('month');
    }
    
    // Update revenue chart based on period
    function updateRevenueChart(period) {
        // Simulated data - in a real app, this would come from an API
        let labels, data;
        
        switch(period) {
            case 'month':
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                data = [12000, 15000, 18000, 14000, 16000, 19000, 21000, 20000, 22000, 20000, 23000, 25000];
                break;
            case 'quarter':
                labels = ['Q1', 'Q2', 'Q3', 'Q4'];
                data = [45000, 54000, 63000, 68000];
                break;
            case 'year':
                labels = ['2020', '2021', '2022', '2023', '2024'];
                data = [45000, 68000, 79000, 120000, 180000];
                break;
        }
        
        // Update chart data
        revenueChart.data.labels = labels;
        revenueChart.data.datasets[0].data = data;
        revenueChart.update();
    }
    
    // Initialize project status chart
    function initProjectStatusChart() {
        const ctx = document.getElementById('projectStatusChart').getContext('2d');
        const data = {
            labels: ['Completed', 'In Progress', 'Pending', 'On Hold'],
            datasets: [{
                data: [12, 19, 5, 3],
                backgroundColor: [
                    '#28a745',
                    '#17a2b8',
                    '#ffc107',
                    '#dc3545'
                ],
                borderWidth: 1,
                borderColor: '#fff'
            }]
        };
        
        projectStatusChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            },
            plugins: [{
                id: 'doughnut-center-text',
                afterDraw(chart) {
                    const { ctx, chartArea: { left, right, top, bottom, width, height } } = chart;
                    const centerX = (left + right) / 2;
                    const centerY = (top + bottom) / 2;
                    
                    // Draw total in center
                    ctx.save();
                    ctx.font = 'bold 20px Arial';
                    ctx.fillStyle = colors.dark;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('12', centerX, centerY - 10);
                    
                    ctx.font = '12px Arial';
                    ctx.fillStyle = colors.gray;
                    ctx.fillText('Total', centerX, centerY + 15);
                    ctx.restore();
                }
            }]
        });
        
        // Create custom legend
        updateProjectStatusLegend(data);
    }
    
    // Update project status legend
    function updateProjectStatusLegend(data) {
        const legendContainer = document.getElementById('projectStatusLegend');
        if (!legendContainer) return;
        
        const colors = [
            { bg: 'rgba(40, 167, 69, 0.1)', text: '#28a745' },
            { bg: 'rgba(23, 162, 184, 0.1)', text: '#17a2b8' },
            { bg: 'rgba(255, 193, 7, 0.1)', text: '#ffc107' },
            { bg: 'rgba(220, 53, 69, 0.1)', text: '#dc3545' }
        ];
        
        legendContainer.innerHTML = data.labels.map((label, i) => {
            const value = data.datasets[0].data[i];
            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            
            return `
                <div class="d-flex align-items-center me-3 mb-2">
                    <span class="rounded-circle me-2" style="width: 12px; height: 12px; background-color: ${colors[i].text}"></span>
                    <span class="small text-muted">${label}: <span class="fw-bold" style="color: ${colors[i].text}">${value}</span> (${percentage}%)</span>
                </div>
            `;
        }).join('');
    }
    
    // Get common chart options
    function getChartOptions(currency = '') {
        return {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return currency + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += currency + context.parsed.y.toLocaleString();
                            }
                            return label;
                        }
                    }
                }
            }
        };
    }
    
    // Public API
    return {
        init: init,
        updateRevenueChart: updateRevenueChart
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    DashboardCharts.init();
});
