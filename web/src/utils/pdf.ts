export async function generateReceiptPDF(booking: any) {
  const { jsPDF } = await import("jspdf")

  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let yPosition = 20

  // Helper function to add text with automatic wrapping
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    pdf.text(text, x, y, options)
    return y + (options.lineHeight || 7)
  }

  // Header
  pdf.setFontSize(24)
  pdf.setTextColor(33, 33, 33)
  yPosition = addText("Booking Receipt", 20, yPosition, { fontStyle: "bold" })

  // Divider
  pdf.setDrawColor(200, 200, 200)
  yPosition += 5
  pdf.line(20, yPosition, pageWidth - 20, yPosition)
  yPosition += 8

  // Booking ID & Date
  pdf.setFontSize(11)
  pdf.setTextColor(80, 80, 80)
  yPosition = addText(`Booking ID: ${booking.id}`, 20, yPosition)
  yPosition = addText(`Issued: ${new Date().toLocaleDateString()}`, 20, yPosition)

  yPosition += 8

  // Property & Room Section
  pdf.setFontSize(12)
  pdf.setTextColor(33, 33, 33)
  yPosition = addText("Property Details", 20, yPosition, { fontStyle: "bold" })

  pdf.setFontSize(10)
  pdf.setTextColor(80, 80, 80)
  yPosition = addText(`Property: ${booking.property?.name || "N/A"}`, 25, yPosition)
  yPosition = addText(`Room: ${booking.room?.name || "N/A"}`, 25, yPosition)
  yPosition = addText(`Room ID: ${booking.room?.roomId || "N/A"}`, 25, yPosition)

  yPosition += 8

  // Stay Details
  pdf.setFontSize(12)
  pdf.setTextColor(33, 33, 33)
  yPosition = addText("Stay Details", 20, yPosition, { fontStyle: "bold" })

  const checkIn = new Date(booking.checkIn)
  const checkOut = new Date(booking.checkOut)
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

  pdf.setFontSize(10)
  pdf.setTextColor(80, 80, 80)
  yPosition = addText(`Check-in: ${checkIn.toLocaleDateString()}`, 25, yPosition)
  yPosition = addText(`Check-out: ${checkOut.toLocaleDateString()}`, 25, yPosition)
  yPosition = addText(`Duration: ${nights} night${nights !== 1 ? "s" : ""}`, 25, yPosition)
  yPosition = addText(`Guests: ${booking.guests}`, 25, yPosition)

  yPosition += 8

  // Payment Breakdown
  pdf.setFontSize(12)
  pdf.setTextColor(33, 33, 33)
  yPosition = addText("Payment Breakdown", 20, yPosition, { fontStyle: "bold" })

  pdf.setFontSize(10)
  pdf.setTextColor(80, 80, 80)

  // Create table-like structure
  const colX1 = 25
  const colX2 = pageWidth - 50

  yPosition += 2
  yPosition = addText(`Base Price:`, colX1, yPosition)
  pdf.text(`${booking.currency} ${booking.basePrice}`, colX2, yPosition, { align: "right" })
  yPosition += 7

  if (Number.parseInt(booking.taxAmount) > 0) {
    yPosition = addText(`Tax:`, colX1, yPosition)
    pdf.text(`${booking.currency} ${booking.taxAmount}`, colX2, yPosition, { align: "right" })
    yPosition += 7
  }

  if (Number.parseInt(booking.discount) > 0) {
    yPosition = addText(`Discount:`, colX1, yPosition)
    pdf.text(`-${booking.currency} ${booking.discount}`, colX2, yPosition, { align: "right" })
    yPosition += 7
  }

  if (booking.additionalServices && booking.additionalServices.length > 0) {
    yPosition += 3
    booking.additionalServices.forEach((service: any) => {
      yPosition = addText(`${service.name}:`, colX1, yPosition)
      pdf.text(`${booking.currency} ${service.price}`, colX2, yPosition, { align: "right" })
      yPosition += 7
    })
  }

  // Total
  yPosition += 3
  pdf.setDrawColor(200, 200, 200)
  pdf.line(colX1 - 5, yPosition, pageWidth - 25, yPosition)
  yPosition += 7

  pdf.setFontSize(12)
  pdf.setTextColor(33, 33, 33)
  yPosition = addText(`Total Amount:`, colX1, yPosition, { fontStyle: "bold" })
  pdf.setTextColor(22, 163, 74) // green color
  pdf.text(`${booking.currency} ${booking.totalAmount}`, colX2, yPosition, { align: "right",  })

  yPosition += 10

  // Payment Status
  pdf.setFontSize(10)
  pdf.setTextColor(80, 80, 80)
  yPosition = addText(`Payment Status: ${booking.payment?.status || "N/A"}`, 20, yPosition)
  yPosition = addText(`Payment Method: ${booking.payment?.method || "N/A"}`, 20, yPosition)

  if (booking.payment?.transactionRef) {
    yPosition = addText(`Transaction Ref: ${booking.payment.transactionRef}`, 20, yPosition)
  }

  if (booking.payment?.pendingAmount && Number.parseInt(booking.payment.pendingAmount) > 0) {
    yPosition += 3
    pdf.setTextColor(220, 38, 38) // red color
    yPosition = addText(`Pending Amount: ${booking.currency} ${booking.payment.pendingAmount}`, 20, yPosition, {
      fontStyle: "bold",
    })
  }

  yPosition += 12

  // Footer
  pdf.setFontSize(9)
  pdf.setTextColor(150, 150, 150)
  pdf.text("Thank you for your booking! Please keep this receipt for your records.", pageWidth / 2, pageHeight - 20, {
    align: "center",
  })

  return pdf
}
