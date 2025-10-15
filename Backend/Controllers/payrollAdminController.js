const Payroll = require("../models/Payroll");
const Employee = require("../models/Employee");
const EmployeeHR = require("../models/EmployeeHR");
const PDFDocument = require("pdfkit");

// Admin can view all payrolls
const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find();

    // Enrich payrolls with name, department, designation
    const enrichedPayrolls = await Promise.all(
      payrolls.map(async (p) => {
        const employee = await Employee.findById(p.employeeId);
        const hrData = await EmployeeHR.findOne({ EmployeeID: employee.EmployeeID });

        return {
          _id: p._id,
          name: employee?.name || "",
          EmployeeID: employee?.EmployeeID || "",
          department: hrData?.department || "",
          designation: hrData?.designation || "",
          month: p.month,
          netSalary: p.netSalary,
          status: p.status,
        };
      })
    );

    res.status(200).json(enrichedPayrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download Payslip (Admin)
const downloadPayslip = async (req, res) => {
  try {
    const { id } = req.params;
    const payroll = await Payroll.findById(id);
    if (!payroll) return res.status(404).json({ message: "Payroll not found" });

    const employee = await Employee.findById(payroll.employeeId);
    const hrData = await EmployeeHR.findOne({ EmployeeID: employee.EmployeeID });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=payslip_${employee.EmployeeID}_${payroll.month}.pdf`
    );
    doc.pipe(res);

    doc.fontSize(18).text("Employee Payslip", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Employee Name: ${employee.name}`);
    doc.text(`Employee ID: ${employee.EmployeeID}`);
    doc.text(`Department: ${hrData?.department || ""}`);
    doc.text(`Designation: ${hrData?.designation || ""}`);
    doc.text(`Month: ${payroll.month}`);
    doc.text(`Base Salary: ₹${payroll.baseSalary}`);
    doc.text(`Bonus: ₹${payroll.bonus}`);
    doc.text(`Deductions: ₹${payroll.deductions}`);
    doc.text(`Net Salary: ₹${payroll.netSalary}`, { underline: true });
    doc.text(`Status: ${payroll.status}`);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`);

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllPayrolls, downloadPayslip };
