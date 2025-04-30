import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";


const UserProfile = () => {
  const { user } = useSelector(state => state.user);
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  // update doc ==========
  //handle form
  const handleFinish = async values => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8080/api/v1/user/userProfile",
        {
          ...values,
          userId: user._id,
         
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


  const getUserInfo = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/user/getUserProfile",
        { userId: params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (res.data.success) {
        console.log(res);
        setUserData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserInfo();
   
  }, []);
  return (
    <Layout>
      <h1 className=" font-semibold text-2xl py-3 px-2">Manage Profile</h1>
      {userData &&
        <Form
          layout="vertical"
          className="m-3"
          initialValues={{
            ...userData,
            
          }}
          onFinish={handleFinish}
        >
          <h4 className=" font-semibold text-lg">Personal Details : </h4>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Name"
                name="name"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Enter Your Name" />
              </Form.Item>
            </Col>
          
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Phone No"
                name="phone"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Enter Your Contact No." />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Email"
                name="email"
                required
                rules={[{ required: true }]}
              >
                <Input type="email" placeholder="Enter Your Email Id" />
              </Form.Item>
            </Col>
           
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Address"
                name="address"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Enter your address" />
              </Form.Item>
            </Col>
            
          </Row>
          <Row>
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

export default UserProfile;
