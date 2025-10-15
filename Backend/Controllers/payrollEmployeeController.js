const Payroll = require("../models/Payroll");
const PDFDocument = require("pdfkit");

// Employee can view own payrolls
const getMyPayroll = async (req, res) => {
  try {
    const userId = req.user.id;
    const payrolls = await Payroll.find({ employeeId: userId }).sort({ createdAt: -1 });
    res.status(200).json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Employee can download their own payslip
const downloadPayslip = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const payroll = await Payroll.findOne({ _id: id, employeeId: userId });
    if (!payroll) return res.status(404).json({ message: "Payroll not found" });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=payslip_${payroll.month}.pdf`
    );
    doc.pipe(res);

    doc.fontSize(18).text("Employee Payslip", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Month: ${payroll.month}`);
    doc.text(`Base Salary: ₹${payroll.baseSalary}`);
    doc.text(`Bonus: ₹${payroll.bonus}`);
    doc.text(`Deductions: ₹${payroll.deductions}`);
    doc.text(`Net Salary: ₹${payroll.netSalary}`);
    doc.text(`Status: ${payroll.status}`);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`);

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {getMyPayroll,downloadPayslip}