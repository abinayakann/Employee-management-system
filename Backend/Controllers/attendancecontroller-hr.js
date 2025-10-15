const Attendance = require("../models/Attendance");

// Get all attendance records for HR
const getAllAttendance = async (req, res) => {
  try {
    // Populate employee name and department
    let records = await Attendance.find()
      .populate("employeeId", "name department")
      .sort({ date: -1 });

    // Map records to include workingHours and remarks
    records = records.map((record) => {
  let workingHours = "-";
  let remarks = "-";

  if (record.checkIn) {
    // Safe parsing for check-in
    const [inH, inM, inS] = record.checkIn.split(":").map((v) => parseInt(v, 10) || 0);
    const inDate = new Date(record.date);
    inDate.setHours(inH, inM, inS);

    // Determine check-out
    let outDate;
    if (record.checkOut) {
      const [outH, outM, outS] = record.checkOut.split(":").map((v) => parseInt(v, 10) || 0);
      outDate = new Date(record.date);
      outDate.setHours(outH, outM, outS);
    } else {
      outDate = new Date(); // current time if no check-out
    }

    // Optional shift cap
    const shiftEnd = new Date(record.date);
    shiftEnd.setHours(18, 0, 0); // 6 PM
    if (outDate > shiftEnd) outDate = shiftEnd;

    // Calculate difference safely
    let diffMs = outDate - inDate;
    if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;

    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);

    workingHours = `${hours}h ${minutes}m`;

    // Set remarks
    if (record.status === "Late") {
      remarks = `Late check-in, worked ${workingHours}`;
    } else {
      remarks = `Worked ${workingHours}`;
    }
  }

  return {
    ...record.toObject(),
    workingHours,
    remarks,
  };
});

    res.json(records);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Error fetching attendance", error });
  }
};

module.exports = { getAllAttendance };
