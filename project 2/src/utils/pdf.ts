import jsPDF from "jspdf";
import { Estimate } from "../components/EstimateCreator";

export function generateEstimatePDF(estimate: Estimate): Blob {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.text("Estimate", 14, 22);
  
  // Customer info
  doc.setFontSize(12);
  doc.text(`Customer: ${estimate.customerName}`, 14, 32);
  doc.text(`Estimate ID: ${estimate.id}`, 14, 40);
  doc.text(`Date: ${estimate.date}`, 14, 48);
  doc.text(`Status: ${estimate.status}`, 14, 56);

  // Items table header
  let yPos = 70;
  doc.setFontSize(10);
  doc.text("#", 14, yPos);
  doc.text("Item", 24, yPos);
  doc.text("Description", 60, yPos);
  doc.text("Qty", 120, yPos);
  doc.text("Price", 140, yPos);
  doc.text("Total", 170, yPos);
  
  // Draw header line
  doc.line(14, yPos + 2, 190, yPos + 2);
  yPos += 8;

  // Items
  estimate.items.forEach((item, index) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    const total = item.price * item.qty;
    doc.text(`${index + 1}`, 14, yPos);
    doc.text(item.name.substring(0, 20), 24, yPos);
    doc.text(item.description.substring(0, 30), 60, yPos);
    doc.text(`${item.qty}`, 120, yPos);
    doc.text(`$${item.price.toFixed(2)}`, 140, yPos);
    doc.text(`$${total.toFixed(2)}`, 170, yPos);
    yPos += 6;
  });

  // Totals
  yPos += 10;
  doc.line(14, yPos, 190, yPos);
  yPos += 8;
  
  doc.text(`Subtotal: $${estimate.subtotal.toFixed(2)}`, 140, yPos);
  yPos += 6;
  doc.text(`Tax: $${estimate.tax.toFixed(2)}`, 140, yPos);
  yPos += 6;
  doc.setFontSize(12);
  doc.text(`Total: $${estimate.total.toFixed(2)}`, 140, yPos);

  // Customer note
  if (estimate.customerNote) {
    yPos += 15;
    doc.setFontSize(10);
    doc.text("Notes:", 14, yPos);
    yPos += 6;
    const lines = doc.splitTextToSize(estimate.customerNote, 170);
    doc.text(lines, 14, yPos);
  }

  // Return as Blob
  return doc.output("blob");
}