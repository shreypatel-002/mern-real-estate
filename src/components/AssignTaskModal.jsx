import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Input, Select, DatePicker } from 'antd';

const { Option } = Select;

const AssignTaskModal = ({ isVisible, onClose, onSave }) => {
  const [engineers, setEngineers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const response = await axios.get('/api/Engineer/ShowEngineer');
        setEngineers(response.data.Engineers);
      } catch (error) {
        console.error('Error fetching engineers:', error);
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await axios.get('/api/Customer/CustomerList');
        setCustomers(response.data.customers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchEngineers();
    fetchCustomers();
  }, []);

  const handleFinish = (values) => {
    onSave(values);
    form.resetFields();
  };

  return (
    <Modal
      open={isVisible}
      title="Assign Task"
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" onClick={() => form.submit()}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} onFinish={handleFinish} layout="vertical">
        <Form.Item
          name="title"
          label="Task Title"
          rules={[{ required: true, message: 'Please input the task title!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Task Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="assignedTo"
          label="Assign To"
          rules={[{ required: true, message: 'Please select an engineer!' }]}
        >
          <Select placeholder="Select an engineer">
            {engineers.length > 0 ? (
              engineers.map((engineer) => (
                <Option key={engineer._id} value={engineer._id}>
                  {engineer.Name}
                </Option>
              ))
            ) : (
              <Option disabled>Loading engineers...</Option>
            )}
          </Select>
        </Form.Item>
        <Form.Item
          name="Customer"
          label="Assigned Customer"
          rules={[{ required: true, message: 'Please select a customer!' }]}
        >
          <Select placeholder="Select a customer">
            {customers.length > 0 ? (
              customers.map((cust) => (
                <Option key={cust._id} value={cust._id}>
                  {cust.Name}
                </Option>
              ))
            ) : (
              <Option disabled>Loading customers...</Option>
            )}
          </Select>
        </Form.Item>
        <Form.Item name="dueDate" label="Due Date">
          <DatePicker />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignTaskModal;
