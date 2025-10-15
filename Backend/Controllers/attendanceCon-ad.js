const AttendanceAd = require("../models/Attendance");

// ✅ Get all attendance records with filters (month, employeeId, department)
const getAllAttendance = async (req, res) => {
  try {
    const { month, employeeId } = req.query;
    const query = {};

    if (month) {
      const start = new Date(`${month}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      query.date = { $gte: start, $lt: end };
    }
    if (employeeId) query.employeeId = employeeId;

    const records = await AttendanceAd.find(query)
      .populate("employeeId", "name department designation");
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance", error });
  }
};

// ✅ Admin can add new attendance (optional)
const addAttendance = async (req, res) => {
  try {
    const record = new AttendanceAd(req.body);
    await record.save();
    res.status(201).json({ message: "Attendance added successfully", record });
  } catch (error) {
    res.status(500).json({ message: "Error adding attendance", error });
  }
};

// ✅ Admin updates attendance
const updateAttendance = async (req, res) => {
  try {
    const updated = await AttendanceAd.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Attendance updated successfully", updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating attendance", error });
  }
};

// ✅ Admin deletes attendance
const deleteAttendance = async (req, res) => {
  try {
    await AttendanceAd.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting attendance", error });
  }
};

module.exports = {
  getAllAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
};
