import { Button, Card, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { ReadOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const res = await login(values);
      localStorage.setItem('token', res.data.token);
      message.success('登录成功');
      navigate('/dashboard');
    } catch (err) {
      message.error('登录失败，请检查账号密码');
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{
        width: 420,
        borderRadius: 24,
        boxShadow: '0 20px 35px -8px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <ReadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          <h2 style={{ marginTop: 16, marginBottom: 8, fontSize: 24, fontWeight: 600 }}>学习管理平台</h2>
          <p style={{ color: '#64748b', marginBottom: 0 }}>管理员登录</p>
        </div>
        <Form onFinish={onFinish} initialValues={{ username: 'admin', password: 'admin123' }} size="large">
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" style={{ borderRadius: 8, fontWeight: 500 }}>
              登录
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 16, color: '#94a3b8' }}>
          测试账号：admin / admin123
        </div>
      </Card>
    </div>
  );
};

export default Login;