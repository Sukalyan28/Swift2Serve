import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import moment from "moment";

const Profile = () => {
  const { user } = useSelector(state => state.user);
  const [worker, setWorker] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  // update doc ==========
  //handle form
  const handleFinish = async values => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8080/api/v1/worker/updateProfile",
        {
          ...values,
          userId: user._id,
          timings: [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm")
          ]
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
        navigate("/");
      } else {
        message.error(res.data.success);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Somthing Went Wrrong ");
    }
  };


  const getWorkerInfo = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/worker/getWorkerInfo",
        { userId: params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (res.data.success) {
        setWorker(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWorkerInfo();
   
  }, []);
  return (
    <Layout>
      <h1 className=" font-semibold py-3 text-xl px-3">Manage Profile</h1>
      {worker &&
        <Form
          layout="vertical"
          className="m-3"
          initialValues={{
            ...worker,
            timings: [
              moment(worker.timings[0], "HH:mm"),
              moment(worker.timings[1], "HH:mm")
            ]
          }}
          onFinish={handleFinish}
        >
          <h4 className=" font-semibold text-lg">Personal Details : </h4>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="First Name"
                name="firstName"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="your first name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Last Name"
                name="lastName"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="your last name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Phone No"
                name="phone"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="your contact no" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Email"
                name="email"
                required
                rules={[{ required: true }]}
              >
                <Input type="email" placeholder="your email address" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Website" name="website">
                <Input type="text" placeholder="your website" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Address"
                name="address"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="your house address" />
              </Form.Item>
            </Col>
          </Row>
          <h4 className=" font-semibold text-lg">Professional Details :</h4>
          <Row gutter={20}>
          
            
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Fees"
                name="fees"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="your contact no" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Timings"
                name="timings"
                required
                rules={[{ required: true }]}
              >
                <TimePicker.RangePicker
                  format="HH:mm"
                  defaultValue={[
                    moment(worker.timings[0], "HH:mm"),
                    moment(worker.timings[1], "HH:mm")
                  ]}
                  onChange={value => {
                    setWorker(prevWorker => ({
                      ...prevWorker,
                      timings: [
                        value[0].format("HH:mm"),
                        value[1].format("HH:mm")
                      ]
                    }));
                  }}
                />
              </Form.Item>
            </Col>
           
            <Col xs={24} md={24} lg={8}>
              <button className="btn btn-primary form-btn" type="submit">
                Update
              </button>
            </Col>
          </Row>
        </Form>}
    </Layout>
  );
};

export default Profile;
