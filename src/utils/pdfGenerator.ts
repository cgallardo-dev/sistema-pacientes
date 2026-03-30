import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Paciente } from '../types/paciente';
import type { Receta, ItemReceta } from '../types/receta';

export function generarPDFReceta(
    paciente: Paciente,
    receta: Receta,
    items: ItemReceta[] | Omit<ItemReceta, 'id' | 'receta_id'>[]
) {
    const doc = new jsPDF();

    // Configuración general
    const marginX = 15;
    let currentY = 20;

    // Encabezado
    doc.setFontSize(22);
    doc.setTextColor(14, 165, 233); // Cyan-500
    doc.text('Clínica Podología - Receta Médica', marginX, currentY);
    
    currentY += 15;
    
    // Datos de la receta (Fecha y Folio)
    doc.setFontSize(11);
    doc.setTextColor(100);
    const fecha = new Date(receta.fecha).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    const recetaIdShort = receta.id ? receta.id.split('-')[0].toUpperCase() : 'N/A';
    doc.text(`Fecha: ${fecha}`, marginX, currentY);
    doc.text(`Folio: ${recetaIdShort}`, marginX, currentY + 6);

    currentY += 15;

    // Datos del Paciente
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Datos del Paciente', marginX, currentY);
    
    currentY += 8;
    
    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text(`Nombre completo: ${paciente.nombre} ${paciente.apellido}`, marginX, currentY);
    doc.text(`DNI: ${paciente.dni}`, marginX, currentY + 6);
    doc.text(`Edad: ${paciente.edad} años`, marginX, currentY + 12);
    doc.text(`Diagnóstico: ${paciente.diagnostico || 'No especificado'}`, marginX, currentY + 18);

    currentY += 28;

    // Detalles de medicamentos (Tabla)
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Indicaciones Médicas', marginX, currentY);

    currentY += 6;

    const tableBody = items.map(item => [
        item.medicamento_nombre,
        `Tomar cada ${item.frecuencia_horas} horas`,
        `${item.dias} días`
    ]);

    autoTable(doc, {
        startY: currentY,
        head: [['Medicamento', 'Frecuencia', 'Duración']],
        body: tableBody,
        theme: 'grid',
        headStyles: {
            fillColor: [14, 165, 233], // Cyan-500
            textColor: 255,
            fontStyle: 'bold',
        },
        styles: {
            fontSize: 11,
            cellPadding: 4,
        },
        alternateRowStyles: {
            fillColor: [240, 249, 255] // Cyan-50
        }
    });

    // Firma (Placeholder)
    const finalY = (doc as any).lastAutoTable.finalY || currentY + 40;
    
    if (finalY + 40 > doc.internal.pageSize.getHeight()) {
        doc.addPage();
        currentY = 20;
    } else {
        currentY = finalY + 30;
    }

    doc.setDrawColor(150);
    doc.line(marginX + 100, currentY, marginX + 180, currentY);
    doc.setFontSize(10);
    doc.text('Firma y Sello del Profesional', marginX + 115, currentY + 5);

    // Pie de página
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('Este documento es una receta médica válida para la dispensación de los medicamentos indicados.', marginX, pageHeight - 15);

    // Guardar el PDF
    doc.save(`Receta_${paciente.dni}_${recetaIdShort}.pdf`);
}
