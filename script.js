document.getElementById('calculatorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    calcular();
});

function calcular() {
    // Obtener valores
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const tipoConsumidor = document.getElementById('tipoConsumidor').value;
    const consumo = parseFloat(document.getElementById('consumo').value);
    const factorPotencia = parseFloat(document.getElementById('factorPotencia').value);

    // Calcular tarifa
    let tarifa;
    if (tipoConsumidor === 'Residencial') {
        if (consumo <= 100) tarifa = 75;
        else if (consumo <= 300) tarifa = 85;
        else tarifa = 95;
    } else if (tipoConsumidor === 'Comercial') {
        tarifa = 110;
    } else { // Industrial
        tarifa = 130;
    }

    // Cálculos
    const voltaje = 220; // V
    const monto = consumo * tarifa;
    const potencia = consumo * 1000 / 720; // W
    const corriente = potencia / (voltaje * factorPotencia);
    const capacitor = (potencia * (0.95 - factorPotencia)) / (2 * Math.PI * 50 * Math.pow(voltaje, 2)) * 1000000;

    // Mostrar resultados
    document.getElementById('clienteNombre').textContent = `${nombre} ${apellido}`;
    document.getElementById('tipoConsumidorResult').textContent = tipoConsumidor;
    document.getElementById('consumoResult').textContent = consumo.toFixed(2);
    document.getElementById('montoResult').textContent = monto.toFixed(2);
    document.getElementById('corrienteResult').textContent = corriente.toFixed(2);
    document.getElementById('capacitorResult').textContent = capacitor.toFixed(2);

    // Mostrar sección de resultados
    document.getElementById('results').classList.add('show');
}

document.getElementById('exportBtn').addEventListener('click', function() {
    // Crear datos para Excel
    const data = [
        {
            'Fecha': new Date().toLocaleString(),
            'Nombre': document.getElementById('nombre').value,
            'Apellido': document.getElementById('apellido').value,
            'Tipo_Consumidor': document.getElementById('tipoConsumidor').value,
            'Consumo_kWh': parseFloat(document.getElementById('consumo').value),
            'Factor_Potencia': parseFloat(document.getElementById('factorPotencia').value),
            'Monto': parseFloat(document.getElementById('montoResult').textContent),
            'Corriente_A': parseFloat(document.getElementById('corrienteResult').textContent),
            'Capacitor_uF': parseFloat(document.getElementById('capacitorResult').textContent)
        }
    ];

    // Crear workbook
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Consumos");

    // Guardar archivo
    const fileName = `consumos_electricos_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
});
