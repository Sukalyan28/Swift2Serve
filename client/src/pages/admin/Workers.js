import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table } from "antd";
import { message } from "antd";

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [showButton,setShowButton] = useState(true);
  //getUsers
  const getWorkers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/admin/getAllWorkers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.data.success) {
        setWorkers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // handle account
  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/admin/changeAccountStatus",
        { workerId: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload();
        setShowButton(false);
      }
    } catch (error) {
      message.error("Something Went Wrong");
    }
  };
  useEffect(() => {
    getWorkers();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) =>
        <span>
          {record.firstName} {record.lastName}
        </span>
    },
    {
      title: "Status",
      dataIndex: "status"
    },
    {
      title: "Phone",
      dataIndex: "phone"
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) =>
        <div className="d-flex">
          {record.status === "pending"
            ? <div><button
            className="btn btn-success"
            onClick={() => handleAccountStatus(record, "approved")}
          >
            Approve
          </button> 
          <button className="btn btn-danger" 
            onClick={() => handleAccountStatus(record, "rejected")}
            >Reject</button></div> 
            : <button className="btn btn-danger" 
            onClick={() => handleAccountStatus(record, "rejected")}
            >Reject</button>}
        </div>
    }
  ];

  return (
    <Layout>
      <h1 className="text-center m-3 text-xl font-semibold py-3">All Workers</h1>
      <Table columns={columns} dataSource={workers} />
    </Layout>
  );
};

export default Workers;
