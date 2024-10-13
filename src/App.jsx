import { useEffect, useState } from 'react'
import { Card, Modal, Avatar } from 'antd';
import {fetchAllUser} from './services/UserService'


function App() {

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Hàm lấy dữ liệu từ API hoặc local storage
  const fetchUsersData = async () => {
    const storageKey = 'userData';
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

  // Hàm xử lý khi nhấp vào Card người dùng
  const handleCardClick = (user) => {
    setSelectedUser(user);
  };

  // Hàm xử lý khi đóng Modal
  const handleModalClose = () => {
    setSelectedUser(null);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {users.map((user) => (
        <Card
          key={"user-" + Math.floor(Math.random()  * 10000)}
          className="w-64 cursor-pointer hover:shadow-lg transition-shadow duration-300"
          onClick={() => handleCardClick(user)}
        >
          <Card.Meta
            avatar={<Avatar src={user.picture.medium} />}
            title={user.name.first}
            description={`Age: ${user.dob.age}`}
          />
        </Card>
      ))}

      {/* Modal hiển thị thông tin chi tiết người dùng */}
      <Modal
        title={selectedUser?.name.first}
        open={!!selectedUser}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedUser && (
          <div>
            <p><strong>ID:</strong> {selectedUser.id.value}</p>
            <p><strong>Age:</strong> {selectedUser.dob.age}</p>
            <p><strong>Address:</strong> {selectedUser.email}</p>
            <p><strong>Workplace:</strong> {selectedUser.location.city}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App
