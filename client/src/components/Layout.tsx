import { Layout, Menu, Avatar, Dropdown, message } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  FileTextOutlined,
  LogoutOutlined,
  ReadOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: '工作台' },
    { key: '/courses', icon: <BookOutlined />, label: '课程管理' },
    { key: '/students', icon: <UserOutlined />, label: '学生管理' },
    { key: '/summary', icon: <FileTextOutlined />, label: '学习总结' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    message.success('退出成功');
    navigate('/login');
  };

  const userMenu = {
    items: [
      { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: handleLogout }
    ]
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="dark" style={{ background: 'linear-gradient(180deg, #001529 0%, #002140 100%)' }}>
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          color: '#fff',
          fontSize: 18,
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <ReadOutlined style={{ fontSize: 24 }} />
          <span>学习管理平台</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: 'transparent', marginTop: 8 }}
        />
      </Sider>
      <Layout>
        <Header style={{
          background: '#ffffff',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          borderRadius: '0 0 12px 12px',
          marginBottom: 4
        }}>
          <Dropdown menu={userMenu} placement="bottomRight" arrow>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar icon={<UserOutlined />} style={{ background: '#1890ff' }} />
              <span style={{ fontWeight: 500, color: '#1e293b' }}>管理员</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ background: 'transparent', padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;