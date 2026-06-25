import { useEffect, useState } from 'react';
import { Table, Card, Input, Select, Button, Space, Modal, Form, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SwapOutlined, BookOutlined, UserOutlined, TagOutlined, FileTextOutlined, HourglassOutlined } from '@ant-design/icons';
import { getCourses, getCourseCategories, createCourse, updateCourse, deleteCourse, toggleCourseStatus } from '../api/course';
import type { Course } from '../type';

const { Search } = Input;
const { Option } = Select;

const Courses = () => {
  const [list, setList] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword,
        status: statusFilter,
        category: categoryFilter,
        sortField,
        sortOrder: sortOrder === 'ascend' ? 'ascend' : sortOrder === 'descend' ? 'descend' : ''
      };
      const [courseRes, cateRes] = await Promise.all([getCourses(params), getCourseCategories()]);
      setList(courseRes.data?.list || []);
      setPagination(prev => ({ ...prev, total: courseRes.data?.total || 0 }));
      setCategories(cateRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, keyword, statusFilter, categoryFilter, sortField, sortOrder]);

  const handleAdd = () => {
    setEditingCourse(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Course) => {
    setEditingCourse(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCourse(id);
      message.success('删除成功');
      fetchData();
    } catch (e) {
      message.error('删除失败');
    }
  };

  const handleToggleStatus = async (record: Course) => {
    try {
      await toggleCourseStatus(record.id);
      message.success(`课程已${record.status === 'published' ? '下架' : '发布'}`);
      fetchData();
    } catch (e) {
      message.error('操作失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingCourse) {
        await updateCourse(editingCourse.id, values);
        message.success('更新成功');
      } else {
        await createCourse(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (e) {
      message.error('操作失败');
    }
  };

  const columns = [
    { title: '课程名称', dataIndex: 'name', key: 'name', sorter: true },
    { title: '讲师', dataIndex: 'instructor', key: 'instructor' },
    { title: '分类', dataIndex: 'category', key: 'category' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'published' ? 'green' : 'default'}>{v === 'published' ? '已发布' : '草稿'}</Tag> },
    { title: '选课人数', dataIndex: 'student_count', key: 'student_count', sorter: true },
    { title: '课时数', dataIndex: 'lesson_count', key: 'lesson_count', sorter: true },
    {
      title: '操作', key: 'action', render: (_: any, record: Course) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>编辑</Button>
          <Button icon={<SwapOutlined />} size="small" onClick={() => handleToggleStatus(record)}>
            {record.status === 'published' ? '下架' : '发布'}
          </Button>
          <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPagination(prev => ({ 
      ...prev, 
      current: pagination.current, 
      pageSize: pagination.pageSize 
    }));
    setSortField(sorter.field);
    setSortOrder(sorter.order);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20, fontSize: 24, fontWeight: 600 }}>课程管理</h1>
      <Card style={{ marginTop: 16, borderRadius: 16 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <Search placeholder="搜索课程名/讲师" style={{ width: 260 }} onSearch={v => setKeyword(v)} allowClear />
          <Select placeholder="全部状态" style={{ width: 150 }} allowClear onChange={v => setStatusFilter(v)}>
            <Option value="published">已发布</Option>
            <Option value="draft">草稿</Option>
          </Select>
          <Select placeholder="全部分类" style={{ width: 150 }} allowClear onChange={v => setCategoryFilter(v)}>
            {categories.map(c => <Option key={c} value={c}>{c}</Option>)}
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ borderRadius: 8 }}>新增课程</Button>
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

      {/* 美化后的弹窗 */}
      <Modal
        title={
          <div style={{ fontSize: 20, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
            <BookOutlined style={{ color: '#1890ff' }} />
            {editingCourse ? '编辑课程' : '新增课程'}
          </div>
        }
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={620}
        okText="保存"
        cancelText="取消"
        okButtonProps={{ style: { borderRadius: 8 } }}
        cancelButtonProps={{ style: { borderRadius: 8 } }}
        style={{ top: 60 }}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        <div style={{ padding: '8px 0' }}>
          <Form form={form} layout="vertical" size="middle">
            <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: 12, marginBottom: 20 }}>
              <div style={{ fontWeight: 500, marginBottom: 16, color: '#1e293b' }}>基本信息</div>
              <Form.Item name="name" label="课程名称" rules={[{ required: true }]}>
                <Input prefix={<BookOutlined style={{ color: '#94a3b8' }} />} placeholder="请输入课程名称" style={{ borderRadius: 8 }} />
              </Form.Item>
              <Form.Item name="instructor" label="讲师">
                <Input prefix={<UserOutlined style={{ color: '#94a3b8' }} />} placeholder="请输入讲师姓名" style={{ borderRadius: 8 }} />
              </Form.Item>
              <Form.Item name="category" label="课程分类">
                <Select placeholder="请选择分类" style={{ borderRadius: 8 }} allowClear>
                  {categories.map(c => <Option key={c} value={c}>{c}</Option>)}
                </Select>
              </Form.Item>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: 12, marginBottom: 20 }}>
              <div style={{ fontWeight: 500, marginBottom: 16, color: '#1e293b' }}>详细信息</div>
              <Form.Item name="description" label="课程描述">
                <Input.TextArea rows={3} placeholder="请输入课程描述" style={{ borderRadius: 8 }} />
              </Form.Item>
              <Form.Item name="lesson_count" label="课时数">
                <Input type="number" prefix={<HourglassOutlined style={{ color: '#94a3b8' }} />} placeholder="0" style={{ borderRadius: 8 }} />
              </Form.Item>
              <Form.Item name="status" label="发布状态">
                <Select placeholder="请选择状态" style={{ borderRadius: 8 }}>
                  <Option value="published">已发布</Option>
                  <Option value="draft">草稿</Option>
                </Select>
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default Courses;