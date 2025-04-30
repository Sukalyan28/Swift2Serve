import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";

import axios from "axios";

import moment from "moment";
import { message, Table } from "antd";

const WorkerAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/worker/worker-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(res)
      if (res.data.success) {
        
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const handleStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/worker/update-status",
        { appointmentsId: record._id, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getAppointments();
      }
    } catch (error) {
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id"
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) =>
        <span>
          {record.date} &nbsp;
          {record.time}
        </span>
    },
    {
      title: "Status",
      dataIndex: "status"
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) =>
        <div className="d-flex">
          {record.status === "pending" &&
            <div className="d-flex">
              <button
                className="btn btn-success"
                onClick={() => handleStatus(record, "approved")}
              >
                Approved
              </button>
              <button
                className="btn btn-danger ms-2"
                onClick={() => handleStatus(record, "reject")}
              >
                Reject
              </button>
            </div>}
        </div>
    }
  ];
  return (
    <Layout>
      <h1 className=" font-semibold py-3 text-xl">Appointment List</h1>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
};

export default WorkerAppointments;
