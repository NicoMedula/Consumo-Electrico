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

    // Definir precios y rangos en base a la imagen
    const cargoFijo = 11421.88;
    const precio_600_kWh = 123.9694;
    const precio_excedente_600_142_kWh = 134.8474;
    const precio_excedente_600_43_kWh = 162.1050;
    const precio_excedente_600_503_kWh = 166.6580;
    const subsidio = 37773.68;
    const alumbradoPublico = 4426.00;
    const iva = 0.21;

    // Calcular consumo en cada rango y montos correspondientes
    let montoConsumo = 0;
    let monto600 = 0;
    let montoExcedente142 = 0;
    let montoExcedente43 = 0;
    let montoExcedente503 = 0;

    if (consumo <= 600) {
        monto600 = consumo * precio_600_kWh;
        montoConsumo = monto600;
    } else if (consumo <= 742) {
        monto600 = 600 * precio_600_kWh;
        montoExcedente142 = (consumo - 600) * precio_excedente_600_142_kWh;
        montoConsumo = monto600 + montoExcedente142;
    } else if (consumo <= 785) {
        monto600 = 600 * precio_600_kWh;
        montoExcedente142 = 142 * precio_excedente_600_142_kWh;
        montoExcedente43 = (consumo - 742) * precio_excedente_600_43_kWh;
        montoConsumo = monto600 + montoExcedente142 + montoExcedente43;
    } else {
        monto600 = 600 * precio_600_kWh;
        montoExcedente142 = 142 * precio_excedente_600_142_kWh;
        montoExcedente43 = 43 * precio_excedente_600_43_kWh;
        montoExcedente503 = (consumo - 785) * precio_excedente_600_503_kWh;
        montoConsumo = monto600 + montoExcedente142 + montoExcedente43 + montoExcedente503;
    }

    // Calcular el monto base antes del IVA
    const montoBase = cargoFijo + montoConsumo - subsidio + alumbradoPublico;

    // Calcular IVA y monto total
    const montoIVA = montoBase * iva;
    const montoTotal = montoBase + montoIVA;

    // Calcular corriente y capacitor sugerido
    const voltaje = 220; // V
    const potencia = consumo * 1000 / 720; // W (asumiendo factor de carga mensual de 720 horas)
    const corriente = potencia / (voltaje * factorPotencia);
    const capacitor = (potencia * (0.95 - factorPotencia)) / (2 * Math.PI * 50 * Math.pow(voltaje, 2)) * 1000000;

    // Mostrar resultados detallados en la interfaz
    document.getElementById('clienteNombre').textContent = `${nombre} ${apellido}`;
    document.getElementById('tipoConsumidorResult').textContent = tipoConsumidor;
    document.getElementById('consumoResult').textContent = consumo.toFixed(2);
    document.getElementById('montoFijoResult').textContent = cargoFijo.toFixed(2);
    document.getElementById('monto600Result').textContent = monto600.toFixed(2);
    document.getElementById('montoExcedente142Result').textContent = montoExcedente142.toFixed(2);
    document.getElementById('montoExcedente43Result').textContent = montoExcedente43.toFixed(2);
    document.getElementById('montoExcedente503Result').textContent = montoExcedente503.toFixed(2);
    document.getElementById('subsidioResult').textContent = subsidio.toFixed(2);
    document.getElementById('alumbradoResult').textContent = alumbradoPublico.toFixed(2);
    document.getElementById('ivaResult').textContent = montoIVA.toFixed(2);
    document.getElementById('totalResult').textContent = montoTotal.toFixed(2);
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
            'Tipo Consumidor': document.getElementById('tipoConsumidor').value,
            'Consumo (kWh)': parseFloat(document.getElementById('consumo').value),
            'Factor de Potencia': parseFloat(document.getElementById('factorPotencia').value),
            'Cargo Fijo': parseFloat(document.getElementById('montoFijoResult').textContent),
            'Consumo primeros 600 kWh': parseFloat(document.getElementById('monto600Result').textContent),
            'Excedente 142 kWh': parseFloat(document.getElementById('montoExcedente142Result').textContent),
            'Excedente 43 kWh': parseFloat(document.getElementById('montoExcedente43Result').textContent),
            'Excedente 503 kWh': parseFloat(document.getElementById('montoExcedente503Result').textContent),
            'Subsidio': parseFloat(document.getElementById('subsidioResult').textContent),
            'Alumbrado Público': parseFloat(document.getElementById('alumbradoResult').textContent),
            'IVA (21%)': parseFloat(document.getElementById('ivaResult').textContent),
            'Total Bimestral': parseFloat(document.getElementById('totalResult').textContent),
            'Corriente (A)': parseFloat(document.getElementById('corrienteResult').textContent),
            'Capacitor (µF)': parseFloat(document.getElementById('capacitorResult').textContent)
        }
    ];

    // Crear workbook y hoja de cálculo
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Consumos");

    // Guardar archivo Excel
    const fileName = `consumos_electricos_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
});