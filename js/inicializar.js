
        // Definición de los datos extraídos de los archivos CSV
        const datosDashboard = {
            // Datos extraídos de 'Dashboard Distrito 06-07.xlsx - Dashboard de Matrícula.csv' y 'Tendencia.csv'
            tendencia: [
                { 'Año Escolar': '2023-2024', 'Matrícula Total': 8424, 'Cambio Absoluto': null, 'Cambio %': null },
                { 'Año Escolar': '2024-2025', 'Matrícula Total': 8549, 'Cambio Absoluto': 125, 'Cambio %': 1.4838556505223139 },
                { 'Año Escolar': '2025-2026', 'Matrícula Total': 7942, 'Cambio Absoluto': -607, 'Cambio %': -7.100245642765235 }
            ],
            // Datos extraídos de 'Dashboard Distrito 06-07.xlsx - Matrícula por Nivel.csv'
            matriculaNivelAnual: {
                '1-INICIAL': { '2023-2024': 1122, '2024-2025': 1246, '2025-2026': 1042 },
                '2-PRIMARIO': { '2023-2024': 3779, '2024-2025': 3778, '2025-2026': 3700 },
                '3-SECUNDARIO': { '2023-2024': 2799, '2024-2025': 2780, '2025-2026': 2701 },
                '4-ADULTOS': { '2023-2024': 724, '2024-2025': 745, '2025-2026': 499 }
            },
            // Datos extraídos de 'Dashboard Distrito 06-07.xlsx - Distribución Nivel.csv' (Solo 2025-2026)
            distribucionNivel2026: [
                { 'Nivel Educativo': '1-INICIAL', 'Matrícula': 1042, 'Porcentaje': 13.12 },
                { 'Nivel Educativo': '2-PRIMARIO', 'Matrícula': 3700, 'Porcentaje': 46.59 },
                { 'Nivel Educativo': '3-SECUNDARIO', 'Matrícula': 2701, 'Porcentaje': 34.01 },
                { 'Nivel Educativo': '4-ADULTOS', 'Matrícula': 499, 'Porcentaje': 6.28 }
            ],
            // Datos extraídos de 'Dashboard Distrito 06-07.xlsx - Matrícula por Sector.csv' (Solo 2025-2026)
            matriculaSector2026: [
                { 'Sector': 'PRIVADO', 'Matrícula': 378 },
                { 'Sector': 'PUBLICO', 'Matrícula': 7564 }
            ],
            // Datos extraídos de 'Dashboard Distrito 06-07.xlsx - Resumen Niveles.csv'
            resumenNiveles: [
                { 'Nivel Educativo': '1-INICIAL', 'Promedio Estudiantes/Sección': 26 },
                { 'Nivel Educativo': '2-PRIMARIO', 'Promedio Estudiantes/Sección': 74.1 },
                { 'Nivel Educativo': '3-SECUNDARIO', 'Promedio Estudiantes/Sección': 217.9 },
                { 'Nivel Educativo': '4-ADULTOS', 'Promedio Estudiantes/Sección': 72.9 }
            ],
            // Conteo de Centros (Se extrae de 'Datos Centros.csv')
            conteoCentros: 71 // Número de centros únicos en el archivo
        };

        // Colores consistentes para los niveles
        const NivelColors = {
            '1-INICIAL': '#f59e0b', // Amarillo
            '2-PRIMARIO': '#10b981', // Verde
            '3-SECUNDARIO': '#3b82f6', // Azul
            '4-ADULTOS': '#ef4444'  // Rojo
        };

        // Función para formatear números con separador de miles
        const formatNumber = (num) => new Intl.NumberFormat('es-DO').format(num);

        // =================================================================
        // 1. INICIALIZACIÓN DE KPIs
        // =================================================================
        function initKPIs() {
            // Matrícula 2025-2026
            const matriculaActual = datosDashboard.tendencia.find(d => d['Año Escolar'] === '2025-2026')['Matrícula Total'];
            document.getElementById('kpi-matricula-actual').textContent = formatNumber(matriculaActual);

            // Cambio % (2025-2026 vs 2024-2025)
            const cambioPct = datosDashboard.tendencia.find(d => d['Año Escolar'] === '2025-2026')['Cambio %'];
            const cambioElement = document.getElementById('kpi-cambio-porcentaje');
            
            // Determinar color y texto del cambio porcentual
            if (cambioPct !== null) {
                const isNegative = cambioPct < 0;
                cambioElement.textContent = (cambioPct * 1).toFixed(2) + '%';
                cambioElement.classList.remove(isNegative ? 'text-green-600' : 'text-red-600');
                cambioElement.classList.add(isNegative ? 'text-red-600' : 'text-green-600');
                
                // Actualizar el color del borde del KPI
                document.getElementById('kpi-cambio-porcentaje').closest('.card').classList.remove('border-red-500');
                document.getElementById('kpi-cambio-porcentaje').closest('.card').classList.add(isNegative ? 'border-red-500' : 'border-green-500');
            }


            // Matrícula Pública 2025-2026
            const matriculaPublica = datosDashboard.matriculaSector2026.find(d => d['Sector'] === 'PUBLICO')['Matrícula'];
            document.getElementById('kpi-publica').textContent = formatNumber(matriculaPublica);

            // Conteo de Centros
            document.getElementById('kpi-centros-count').textContent = datosDashboard.conteoCentros;
        }

        // =================================================================
        // 2. GRÁFICO DE TENDENCIA (Matrícula Total Anual)
        // =================================================================
        function createChartTendencia() {
            const data = datosDashboard.tendencia;
            const labels = data.map(d => d['Año Escolar']);
            const matriculaData = data.map(d => d['Matrícula Total']);
            const cambioPctData = data.map(d => d['Cambio %'] !== null ? d['Cambio %'] * 100 : null);

            new Chart(document.getElementById('chartTendencia'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            type: 'bar',
                            label: 'Matrícula Total',
                            data: matriculaData,
                            backgroundColor: '#1e40af', // Azul oscuro (primary)
                            borderColor: '#1e40af',
                            borderWidth: 1,
                            yAxisID: 'yMatricula',
                            borderRadius: 6
                        },
                        {
                            type: 'line',
                            label: 'Cambio % (vs. Año Anterior)',
                            data: cambioPctData,
                            borderColor: '#f59e0b', // Naranja (accent)
                            backgroundColor: '#f59e0b',
                            fill: false,
                            yAxisID: 'yCambio',
                            pointRadius: 5,
                            pointBackgroundColor: '#f59e0b',
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    plugins: {
                        legend: { position: 'top' },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        if (context.dataset.yAxisID === 'yCambio') {
                                            label += context.parsed.y.toFixed(2) + '%';
                                        } else {
                                            label += formatNumber(context.parsed.y);
                                        }
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        yMatricula: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: { display: true, text: 'Matrícula Total' },
                            ticks: { callback: (val) => formatNumber(val) }
                        },
                        yCambio: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: { display: true, text: 'Cambio %' },
                            grid: { drawOnChartArea: false },
                            ticks: { callback: (val) => val.toFixed(1) + '%' }
                        }
                    }
                }
            });
        }

        // =================================================================
        // 3. GRÁFICO DE SECTOR (Matrícula Público vs Privado 2025-2026)
        // =================================================================
        function createChartSector() {
            const data = datosDashboard.matriculaSector2026;
            const labels = data.map(d => d['Sector']);
            const matriculaData = data.map(d => d['Matrícula']);
            const backgroundColors = ['#f59e0b', '#1e40af']; // Naranja para Privado, Azul para Público

            new Chart(document.getElementById('chartSector'), {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Matrícula 2025-2026',
                        data: matriculaData,
                        backgroundColor: backgroundColors,
                        hoverOffset: 4,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1) + '%';
                                    return `${label}: ${formatNumber(value)} (${percentage})`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // =================================================================
        // 4. GRÁFICO DISTRIBUCIÓN POR NIVEL (Pie Chart 2025-2026)
        // =================================================================
        function createChartDistribucionNivel() {
            const data = datosDashboard.distribucionNivel2026;
            const labels = data.map(d => d['Nivel Educativo'].replace(/\d-/, '')); // Quitar el prefijo numérico
            const matriculaData = data.map(d => d['Matrícula']);
            const backgroundColors = data.map(d => NivelColors[d['Nivel Educativo']]);

            new Chart(document.getElementById('chartDistribucionNivel'), {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Matrícula 2025-2026',
                        data: matriculaData,
                        backgroundColor: backgroundColors,
                        hoverOffset: 4,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1) + '%';
                                    return `${label}: ${formatNumber(value)} (${percentage})`;
                                }
                            }
                        }
                    }
                }
            });
        }


        // =================================================================
        // 5. GRÁFICO COMPARATIVO POR NIVEL ANUAL (Barra Agrupada)
        // =================================================================
        function createChartNivelAnual() {
            const data = datosDashboard.matriculaNivelAnual;
            const anos = Object.keys(data['1-INICIAL']);
            const niveles = Object.keys(data);
            
            const datasets = niveles.map(nivel => ({
                label: nivel.replace(/\d-/, ''), // Nombre limpio
                data: anos.map(ano => data[nivel][ano]),
                backgroundColor: NivelColors[nivel],
                borderColor: NivelColors[nivel],
                borderWidth: 1,
                borderRadius: 4
            }));

            new Chart(document.getElementById('chartNivelAnual'), {
                type: 'bar',
                data: {
                    labels: anos,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top' },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += formatNumber(context.parsed.y);
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        x: { stacked: false, title: { display: true, text: 'Año Escolar' } },
                        y: { stacked: false, title: { display: true, text: 'Matrícula' }, ticks: { callback: (val) => formatNumber(val) } }
                    }
                }
            });
        }


        // =================================================================
        // 6. INYECCIÓN DE CARGA PROMEDIO POR NIVEL (Mini-KPIs)
        // =================================================================
        function injectCargaPromedio() {
            const container = document.getElementById('seccion-carga-niveles');
            const data = datosDashboard.resumenNiveles;

            const colorMap = {
                '1-INICIAL': 'border-yellow-500 bg-yellow-50',
                '2-PRIMARIO': 'border-green-500 bg-green-50',
                '3-SECUNDARIO': 'border-blue-500 bg-blue-50',
                '4-ADULTOS': 'border-red-500 bg-red-50',
            };

            data.forEach(item => {
                const nivel = item['Nivel Educativo'];
                const promedio = parseFloat(item['Promedio Estudiantes/Sección']).toFixed(1);
                const colorClasses = colorMap[nivel] || 'border-gray-300 bg-gray-50';
                
                // Determinar el color del texto del promedio
                let textColorClass = 'text-gray-800';
                if (promedio >= 100) {
                    textColorClass = 'text-red-600'; // Advertencia
                } else if (promedio >= 50) {
                    textColorClass = 'text-orange-600'; // Cuidado
                } else {
                    textColorClass = 'text-green-600'; // Ideal
                }

                const html = `
                    <div class="p-4 rounded-lg border-l-4 ${colorClasses} card">
                        <p class="text-sm font-medium text-gray-500">${nivel.replace(/\d-/, '')}</p>
                        <p class="mt-1 text-2xl font-bold ${textColorClass}">${promedio}</p>
                        <p class="text-xs text-gray-500">Est. / Sección (Promedio)</p>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', html);
            });
        }


        // Inicialización de la aplicación al cargar la ventana
        window.onload = function() {
            initKPIs();
            createChartTendencia();
            createChartSector();
            createChartDistribucionNivel();
            createChartNivelAnual();
            injectCargaPromedio();
        };
