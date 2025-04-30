import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, message, TimePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const BookingPage = () => {
  const { user } = useSelector(state => state.user);
  const params = useParams();
  const [workers, SetWorkers] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const dispatch = useDispatch();
  // login user data
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/worker/getWorkerById",
        { workerId: params.workerId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );
      if (res.data.success) {
        SetWorkers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ============ handle availiblity
  const handleAvailability = async () => {
    try {
      if (!date && !time) {
        return alert("Date and Time Required");
      }
      console.log("Checking availability", { date, time });
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8080/api/v1/user/booking-availbility",
        { workerId: params.workerId, date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        setIsAvailable(true);
        console.log(isAvailable);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };
  // =============== booking func
  const handleBooking = async () => {
    try {
      setIsAvailable(true);
      if (!date && !time) {
        return alert("Date and Time Required");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8080/api/v1/user/book-appointment",
        {
          workerId: params.workerId,
          userId: user._id,
          workerInfo: workers,
          userInfo: user,
          date: date,
          time: time
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);
  return (
    <Layout>
      <h3 className=" text-center text-lg font-semibold py-3">Booking Page</h3>
      <div className="container m-2">
        {workers &&
          <div>
            <h4 className=" font-semibold px-2 pb-1">
            Name: {workers.firstName} {workers.lastName}
            </h4>
            <h4 className=" font-semibold px-2 pb-1">
              Fees:  &#8377;{workers.fees}
            </h4>
            <h4 className=" font-semibold px-2 pb-2">
              Specialization: {workers.speciality}
            </h4>
            <div className=" flex flex-col w-50">
            <input
              type="date"
              className="m-2 px-2 py-1 border-2 rounded-sm cursor-pointer"
              name="date"
              value={date}
              onChange={event => {
                
              setDate(event.target.value);
              }}
             />
              <input
                type="time"
                value={time}
                className="m-2 px-2 py-1 border-2 rounded-sm"
                onChange={event => {
                  setTime(event.target.value);
                }}
              />
              <button
                className="btn btn-primary mt-2"
                onClick={handleAvailability}
              >
                Check Availability
              </button>

              <button className="btn btn-dark mt-2" onClick={handleBooking}>
                Book Now
              </button>
            </div>
          </div>}
      </div>
    </Layout>
  );
};

export default BookingPage;
