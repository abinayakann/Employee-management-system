const Payroll = require("../models/Payroll");
const Employee = require("../models/Employee");
const EmployeeHR = require("../models/Employeehr");
const PDFDocument = require("pdfkit");

// ✅ Create Payroll
const createPayroll = async (req, res) => {
  try {
    const { employeeId, month, baseSalary, bonus, deductions } = req.body;
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const netSalary = baseSalary + (bonus || 0) - (deductions || 0);

    const existing = await Payroll.findOne({ employeeId, month });
    if (existing) return res.status(400).json({ message: "Payroll already exists" });

    const payroll = new Payroll({ employeeId, month, baseSalary, bonus, deductions, netSalary });
    await payroll.save();
    res.status(201).json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Payrolls
const getAllPayroll = async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate("employeeId", "name EmployeeID");
    const employeeHRs = await EmployeeHR.find(); // All HR details

    // Merge department info using EmployeeID
    const merged = payrolls.map((p) => {
      const empId = p.employeeId?.EmployeeID;
      const hrData = employeeHRs.find((e) => e.EmployeeID === empId);

      return {
        ...p._doc,
        department: hrData ? hrData.department : "—",
        designation: hrData ? hrData.designation : "—",
      };
    });

    res.status(200).json(merged);
  } catch (err) {
    console.error("Error fetching payrolls:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Update Payroll
// Backend: updatePayroll
const updatePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Payroll.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Payroll not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Delete Payroll
const deletePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Payroll.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Payroll not found" });
    res.status(200).json({ message: "Payroll deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Download Payslip
const downloadPayslip = async (req, res) => {
  try {
    const { id } = req.params;
    const payroll = await Payroll.findById(id).populate("employeeId", "name EmployeeID department designation");
    if (!payroll) return res.status(404).json({ message: "Payroll not found" });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=payslip_${payroll.employeeId.EmployeeID}_${payroll.month}.pdf`
    );
    doc.pipe(res);

    doc.fontSize(18).text("Employee Payslip", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Employee Name: ${payroll.employeeId.name}`);
    doc.text(`Employee ID: ${payroll.employeeId.EmployeeID}`);
    doc.text(`Department: ${payroll.employeeId.department}`);
    doc.text(`Designation: ${payroll.employeeId.designation}`);
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

module.exports = {createPayroll,getAllPayroll,updatePayroll,
  deletePayroll,downloadPayslip
}
