import { useEffect, useState } from 'react';
import { Table, Card, Input, Select, Button, Space, Modal, Form, message, Popconfirm, Tag, Transfer } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, TeamOutlined, PhoneOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { getStudents, getClasses, createStudent, updateStudent, deleteStudent } from '../api/student';
import { getAllCourses } from '../api/course';
import type { Student, Course } from '../type';

const { Search } = Input;
const { Option } = Select;

const Students = () => {
  const [list, setList] = useState<Student[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [classFilter, setClassFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword,
        className: classFilter,
        status: statusFilter,
      };
      const [stuRes, clsRes, courseRes] = await Promise.all([getStudents(params), getClasses(), getAllCourses()]);
      setList(stuRes.data?.list || []);
      setPagination(prev => ({ ...prev, total: stuRes.data?.total || 0 }));
      setClasses(clsRes.data || []);
      setCourses(courseRes.data?.list || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, keyword, classFilter, statusFilter]);

  const handleAdd = () => {
    setEditingStudent(null);
    form.resetFields();
    setSelectedCourseIds([]);
    setModalVisible(true);
  };

  const handleEdit = (record: Student) => {
    setEditingStudent(record);
    form.setFieldsValue(record);
    setSelectedCourseIds(record.course_ids || []);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteStudent(id);
      message.success('删除成功');
      fetchData();
    } catch (e) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = { ...values, course_ids: selectedCourseIds };
      if (editingStudent) {
        await updateStudent(editingStudent.id, payload);
        message.success('更新成功');
      } else {
        await createStudent(payload);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (e) {
      message.error('操作失败');
    }
  };

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '学号', dataIndex: 'student_no', key: 'student_no' },
    { title: '班级', dataIndex: 'class_name', key: 'class_name' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'active' ? 'green' : 'default'}>{v === 'active' ? '活跃' : '非活跃'}</Tag> },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    {
      title: '操作', key: 'action', render: (_: any, record: Student) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const handleTableChange = (pagination: any) => {
    setPagination(prev => ({ 
      ...prev, 
      current: pagination.current, 
      pageSize: pagination.pageSize 
    }));
  };

  const transferData = courses.map(c => ({ key: c.id.toString(), title: c.name }));

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20, fontSize: 24, fontWeight: 600 }}>学生管理</h1>
      <Card style={{ borderRadius: 16 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <Search placeholder="搜索姓名/学号" style={{ width: 260 }} onSearch={v => setKeyword(v)} allowClear />
          <Select placeholder="全部班级" style={{ width: 150 }} allowClear onChange={v => setClassFilter(v)}>
            {classes.map(c => <Option key={c} value={c}>{c}</Option>)}
          </Select>
          <Select placeholder="全部状态" style={{ width: 120 }} allowClear onChange={v => setStatusFilter(v)}>
            <Option value="active">活跃</Option>
            <Option value="inactive">非活跃</Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ borderRadius: 8 }}>新增学生</Button>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
            showTotal: (total) => `共 ${total} 条记录`
          }}
          onChange={handleTableChange}
        />
      </Card>

      {/* 美化后的弹窗（带滚动、高度压缩） */}
      <Modal
        title={
          <div style={{ fontSize: 20, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
            <UserOutlined style={{ color: '#1890ff' }} />
            {editingStudent ? '编辑学生' : '新增学生'}
          </div>
        }
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={880}
        okText="保存"
        cancelText="取消"
        okButtonProps={{ style: { borderRadius: 8 } }}
        cancelButtonProps={{ style: { borderRadius: 8 } }}
        style={{ top: 40 }}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: 8 }}
      >
        <div style={{ padding: '4px 0' }}>
          <Form form={form} layout="vertical" size="middle">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 12 }}>
                <div style={{ fontWeight: 500, marginBottom: 12, color: '#1e293b' }}>📋 基本信息</div>
                <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
                  <Input prefix={<UserOutlined style={{ color: '#94a3b8' }} />} placeholder="请输入姓名" style={{ borderRadius: 8 }} />
                </Form.Item>
                <Form.Item name="student_no" label="学号" rules={[{ required: true }]}>
                  <Input prefix={<IdcardOutlined style={{ color: '#94a3b8' }} />} placeholder="请输入学号" style={{ borderRadius: 8 }} />
                </Form.Item>
                <Form.Item name="class_name" label="班级">
                  <Select placeholder="请选择班级" style={{ borderRadius: 8 }} allowClear>
                    {classes.map(c => <Option key={c} value={c}>{c}</Option>)}
                  </Select>
                </Form.Item>
                <Form.Item name="status" label="状态">
                  <Select placeholder="请选择状态" style={{ borderRadius: 8 }}>
                    <Option value="active">活跃</Option>
                    <Option value="inactive">非活跃</Option>
                  </Select>
                </Form.Item>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 12 }}>
                <div style={{ fontWeight: 500, marginBottom: 12, color: '#1e293b' }}>📞 联系方式</div>
                <Form.Item name="phone" label="手机号">
                  <Input prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />} placeholder="请输入手机号" style={{ borderRadius: 8 }} />
                </Form.Item>
                <Form.Item name="email" label="邮箱">
                  <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} placeholder="请输入邮箱" style={{ borderRadius: 8 }} />
                </Form.Item>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 12, marginTop: 16 }}>
              <div style={{ fontWeight: 500, marginBottom: 12, color: '#1e293b' }}>📚 已选课程</div>
              <Form.Item>
                <Transfer
                  dataSource={transferData}
                  targetKeys={selectedCourseIds.map(id => id.toString())}
                  onChange={keys => setSelectedCourseIds(keys.map(Number))}
                  render={item => item.title}
                  listStyle={{ width: 330, height: 260, borderRadius: 12 }}
                  showSearch
                  titles={['可选课程', '已选课程']}
                />
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default Students;