document.addEventListener('DOMContentLoaded', function () {
    const jsonData = document.getElementById('charts-data').textContent;
    if (jsonData) {
        try {
            const chartsData = JSON.parse(jsonData);
            chartsData.forEach(function(data, index) {
                var ctx = document.getElementById('chart-' + (index + 1)).getContext('2d');
                new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: ['Wins', 'Losses', 'Draws'],
                        datasets: [{
                            label: data.typeName + ' Game Results',
                            data: [data.wins, data.losses, data.draws],
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 206, 86, 0.2)'
                            ],
                            borderColor: [
                                'rgba(75, 192, 192, 1)',
                                'rgba(255, 99, 132, 1)',
                                'rgba(255, 206, 86, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
            });
        } catch (e) {
            console.log('Error parsing JSON data: ', e);
        }
    } else {
        console.log('No data available for charts.');
    }
});
