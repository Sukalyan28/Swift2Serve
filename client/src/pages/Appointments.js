import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import { Table } from "antd";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/user/user-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    // {
    //   title: "Name",
    //   dataIndex: "name",
    //   render: (text, record) => (
    //     <span>
    //       {record.doctorInfo.firstName} {record.doctorInfo.lastName}
    //     </span>
    //   ),
    // },
    // {
    //   title: "Phone",
    //   dataIndex: "phone",
    //   render: (text, record) => <span>{record.doctorInfo.phone}</span>,
    // },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {record.date} &nbsp;
          {record.time}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  return (
    <Layout>
      <h1 className=" font-semibold text-2xl py-3">Appointment Lists</h1>
      <Table columns={columns} dataSource={appointments} className=" border-2 rounded-lg bg-[#f0f0f0]" />
    </Layout>
  );
};

export default Appointments;
