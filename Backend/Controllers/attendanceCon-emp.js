const Attendance = require("../models/Attendance");

// Get logged-in employee attendance
const getMyAttendance = async (req, res) => {
  try {
    const employeeId = req.user.id;
    let records = await Attendance.find({ employeeId }).sort({ date: -1 });

    // Calculate working hours and remarks
    records = records.map((record) => {
      let workingHours = "-";
      let remarks = "-";

      if (record.checkIn) {
        // Parse check-in time
        const [inH, inM, inS] = record.checkIn.split(":").map((v) => parseInt(v, 10) || 0);
        const inDate = new Date(record.date);
        inDate.setHours(inH, inM, inS);

        // Determine check-out time
        let outDate;
        if (record.checkOut && record.checkOut !== "-") {
          const [outH, outM, outS] = record.checkOut.split(":").map((v) => parseInt(v, 10) || 0);
          outDate = new Date(record.date);
          outDate.setHours(outH, outM, outS);
        } else {
          outDate = new Date(); // use current time if not checked out
        }

        // Handle overnight shifts
        if (outDate < inDate) outDate.setDate(outDate.getDate() + 1);

        const diffMs = outDate - inDate;
        const hours = Math.floor(diffMs / 3600000);
        const minutes = Math.floor((diffMs % 3600000) / 60000);

        workingHours = `${hours}h ${minutes}m`;
        remarks = record.status === "Late"
          ? `Late check-in, worked ${workingHours}`
          : `Worked ${workingHours}`;
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

// Mark Check-In
const markCheckIn = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in
    let record = await Attendance.findOne({
      employeeId,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    });
    if (record) return res.status(400).json({ message: "Already checked in today" });

    const now = new Date();
    const checkInTime = now.toTimeString().split(" ")[0]; // HH:MM:SS
    const status = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30)
      ? "Late"
      : "Present";

    record = new Attendance({
      employeeId,
      date: today,
      status,
      checkIn: checkInTime,
      remarks: status === "Late" ? "Late check-in" : "",
    });

    await record.save();
    res.status(201).json({ message: "Check-in successful", record });
  } catch (error) {
    console.error("Error marking check-in:", error);
    res.status(500).json({ message: "Error marking check-in", error });
  }
};

// Mark Check-Out
const markCheckOut = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Find today's record
    const record = await Attendance.findOne({
      employeeId,
      date: { $gte: todayStart, $lt: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000) },
    });
    if (!record) return res.status(400).json({ message: "No check-in record found today" });
    if (record.checkOut && record.checkOut !== "-")
      return res.status(400).json({ message: "Already checked out today" });

    // Parse check-in and current check-out time
    const [inH, inM, inS] = record.checkIn.split(":").map((v) => parseInt(v, 10) || 0);
    const checkInDate = new Date(record.date);
    checkInDate.setHours(inH, inM, inS);

    const checkOutDate = new Date(record.date);
    checkOutDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

    // Handle overnight
    if (checkOutDate < checkInDate) checkOutDate.setDate(checkOutDate.getDate() + 1);

    const diffMs = checkOutDate - checkInDate;
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);

    record.checkOut = now.toTimeString().split(" ")[0];
    record.workingHours = `${hours}h ${minutes}m`;
    record.remarks = record.status === "Late"
      ? `Late check-in, worked ${hours}h ${minutes}m`
      : `Worked ${hours}h ${minutes}m`;

    await record.save();
    res.json({ message: "Check-out successful", record });
  } catch (error) {
    console.error("Error marking check-out:", error);
    res.status(500).json({ message: "Error marking check-out", error });
  }
};

module.exports = { getMyAttendance, markCheckIn, markCheckOut };
