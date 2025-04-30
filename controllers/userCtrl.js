const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const workerModel = require("../models/workerModel");
const bookingModel = require("../models/bookingModel");
const moment = require("moment");
//register callback
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Registered Succesfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`
    });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid Email or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    res.status(200).send({ message: "Login success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

//auth controller
const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password == undefined;
    if (!user) {
      return res.status(200)({
        message: " user not found",
        success: false
      });
    } else {
      res.status(200).send({
        success: true,
        data: user
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error
    });
  }
};
const applyWorkerController = async (req, res) => {
  try {
    const newWorker = await workerModel.create({ ...req.body, status: "pending" });
   
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-worker-request",
      message: `${newWorker.firstName} ${newWorker.lastName} Has applied for Worker account`,
      data: {
        worker: newWorker._id,
        name: newWorker.firstName + " " + newWorker.lastName,
        onClickPath: "/admin/workers"
      }
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Worker Account Applied SUccessfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while Applying for Worker" + error.message
    });
  }
};
//notification ctrl
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notification marked as read",
      data: updatedUser
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error
    });
  }
};

const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: updatedUser
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error
    });
  }
};

//GET ALL WORKER
const getAllWorkerController = async (req, res) => {
  try {
    const worker = await workerModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Worker Lists Fetched Successfully",
      data: worker
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Worker"
    });
  }
};

//BOOK APPOINTMENT
// bad spellings over here

const bookAppointmnetController = async (req, res) => {
  try {
    console.log(req)
   // req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
   // req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new bookingModel(req.body);
    await newAppointment.save();
    const user = await userModel.findById(req.body.userId);
    console.log("user in bookAppointmentController",user)
    user?.notification.push({
      type: "New-appointment-request",
      message: `A New Appointment Request from ${req.body.userInfo.name}`,
      onCLickPath: "/user/bookings"
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Booked succesfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Booking Appointment" + error.message
    });
  }
};

// booking bookingAvailabilityController
const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const workerId = req.body.workerId;
    const appointments = await bookingModel.find({
      workerId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime
      }
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not Availibale at this time",
        success: true
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointments available"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking"
    });
  }
};

//AppointmentController
const userAppointmentsController = async (req, res) => {
  try {
    const bookings = await bookingModel.find({
      userId: req.body.userId
    });
    res.status(200).send({
      success: true,
      message: "Users Appointments Fetch SUccessfully",
      data: bookings
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointments"
    });
  }
};

const updateUserProfileController = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.body.userId,
      req.body
    );
    res.status(201).send({
      success: true,
      message: "user Profile Updated",
      data: user
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "User Profile Update issue",
      error
    });
  }
};
const getUserInfoController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId );
    res.status(200).send({
      success: true,
      message: "User data fetch success",
      data: user
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching user Details"
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  applyWorkerController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllWorkerController,
  bookAppointmnetController,
  bookingAvailabilityController,
  userAppointmentsController,
  updateUserProfileController,
  getUserInfoController

};
