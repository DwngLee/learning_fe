import { useEffect, useState } from 'react'
import { Card, Modal, Avatar, Button, notification, Form, Input, InputNumber } from 'antd';
import { EditOutlined, DeleteTwoTone } from '@ant-design/icons';
import { fetchAllUser } from './services/UserService'

const { Meta } = Card;


function App() {
  const storageKey = 'userData';

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditUser, setIsEditUser] = useState(false);
  const [isAddUser, setIsAddUser] = useState(false);
  const [form] = Form.useForm();


  // Hàm lấy dữ liệu từ API hoặc local storage
  const fetchUsersData = async () => {
    let data = JSON.parse(localStorage.getItem(storageKey));
    // Nếu không có dữ liệu trong local storage, gọi API và lưu lại
    if (!data) {
      try {
        const response = await fetchAllUser();
        data = response.data.results;
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    setUsers(data || []);
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  }

  // Hàm xử lý khi nhấp vào Card người dùng
  function handleCardClick(user) {
    setSelectedUser(user);
    setIsEditUser(false)
  };


  function handleModalClose() {
    setSelectedUser(null);
    setIsEditUser(false);
  };

  function handleAddUserClose() {
    setIsAddUser(false);
  }

  function handledDeleteUser(userId) {
    const updatedUser = users.filter((user) => user.id.value !== userId);

    setUsers(updatedUser);
    localStorage.setItem(storageKey, JSON.stringify(updatedUser));
    setSelectedUser(null);
    notification.success({ message: "Deleted User Sucessfully!" });
  }

  function handledEditUser(values) {
    for (let i = 0; i < users.length; i++) {
      if (users.at(i).id === selectedUser.id) {
        users.at(i).name.first = values.name;
        users.at(i).dob.age = values.age;
      }
    }
    localStorage.setItem(storageKey, JSON.stringify(users));
    setSelectedUser(null);
    setIsEditUser(false);
    form.resetFields(['name', 'age']);
    notification.success({ message: "Update User Sucessfully!" });
  }

  function handleAddUser(values) {
    const newUser = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      picture: {
        medium: "https://picsum.photos/200",
        large: "https://picsum.photos/200"
      },
      ...values,
    };
    users.push(newUser);
    setUsers(users);
    localStorage.setItem(storageKey, JSON.stringify(users));
    setIsAddUser(false);
    notification.success({ message: "Add User successfully" })
  }

  function onFill() {
    form.setFieldsValue({
      name: selectedUser.name.first,
      age: selectedUser.dob.age
    })
    setIsEditUser(true);
  }

  return (
    <div className='p-4'>
      <Button onClick={() => setIsAddUser(true)}>
        Add User
      </Button>
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {users.map((user) => (

          <Card
            key={"user-" + Math.floor(Math.random() * 10000)}
            className="w-64 cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => handleCardClick(user)}

          >
            <Meta
              avatar={<Avatar src={user.picture.medium} />}
              title={user.name.first}
              description={`Age: ${user.dob.age}`}
            />
          </Card>

        ))}

        {/* Modal hiển thị thông tin chi tiết người dùng */}
        <Modal
          title={selectedUser?.name.first}
          open={selectedUser}
          onCancel={handleModalClose}
          footer={!isEditUser && [
            <Button key="setting"
              icon={<EditOutlined />}
              onClick={() => onFill()}>Update</Button>,
            <Button
              key="delete"
              icon={<DeleteTwoTone twoToneColor='red' />}
              danger
              onClick={() => handledDeleteUser(selectedUser.id.value)}>Delete</Button>
          ]}
        >
          {selectedUser && !isEditUser && (
            <div>
              <p><img src={selectedUser.picture.large} alt="" /></p>
              <p><strong>ID:</strong> {selectedUser.id.value}</p>
              <p><strong>Age:</strong> {selectedUser.dob.age}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Workplace:</strong> {selectedUser.location.city}</p>
              <p><strong>Phone:</strong> {selectedUser.cell}</p>
              <p><strong>Gender:</strong> {selectedUser.gender}</p>
              <p><strong>Location:</strong> {selectedUser.location.country}</p>
            </div>
          )}

          {isEditUser && (
            <Form
              form={form}
              layout='vertical'
              onFinish={handledEditUser}
              validateMessages={validateMessages}>
              <img src={selectedUser.picture.large} alt="" />
              <Form.Item label="Name" name="name" rules={[{
                required: true
              }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Age" name="age" rules={[{
                required: true,
                type: 'number',
                min: 18,
                max: 110,
              }]}>
                <InputNumber />
              </Form.Item>
              <Button htmlType='submit'>
                Update
              </Button>
            </Form>
          )}
        </Modal>

        {/* Model them moi nguoi dung */}
        <Modal
          title="Add new User"
          open={isAddUser}
          onCancel={() => setIsAddUser(false)}
          footer={null}
        >
          <Form
            form={form}
            layout='vertical'
            onFinish={handleAddUser}
            validateMessages={validateMessages}>
            <Form.Item
              label="Name"
              name={["name", "first"]}
              rules={[{
                required: true,
              }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Age"
              name={['dob', 'age']}
              rules={[{
                required: true,
                type: 'number',
                min: 18,
                max: 110,
              }]}>
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{
                required: true,
                type: 'email'
              }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Work place"
              name={['location', 'city']}
              rules={[{
                required: true,

              }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="cell"
              rules={[{
                required: true,

              }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{
                required: true,

              }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Location"
              name={['location', 'country']}
              rules={[{
                required: true,

              }]}>
              <Input />
            </Form.Item>
            <Button htmlType='submit'>
              Add User
            </Button>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default App
