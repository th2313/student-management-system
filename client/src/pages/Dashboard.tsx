import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Spin } from 'antd';
import * as echarts from 'echarts';
import { getDashboard } from '../api/dashboard';
import type { DashboardData } from '../type';

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboard();
        setData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!data) return;

    // 柱状图
    const enrollChart = echarts.init(document.getElementById('enrollChart'));
    enrollChart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: data.charts.enrollment.map(item => item.name), axisLabel: { rotate: 30 } },
      yAxis: { type: 'value', name: '选课人数' },
      series: [{ type: 'bar', data: data.charts.enrollment.map(item => item.value), itemStyle: { color: '#1890ff' } }]
    });

    // 折线图（双轴）
    const activityChart = echarts.init(document.getElementById('activityChart'));
    activityChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['学习人数', '学习时长(小时)'] },
      xAxis: { type: 'category', data: data.charts.activity.map(item => item.label) },
      yAxis: [{ type: 'value', name: '人数' }, { type: 'value', name: '小时' }],
      series: [
        { name: '学习人数', type: 'line', data: data.charts.activity.map(item => item.students), yAxisIndex: 0 },
        { name: '学习时长', type: 'line', data: data.charts.activity.map(item => item.duration), yAxisIndex: 1, lineStyle: { color: '#52c41a' } }
      ]
    });

    // 饼图1
    const statusChart = echarts.init(document.getElementById('statusChart'));
    statusChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [{ type: 'pie', radius: '50%', data: data.charts.statusDist, label: { show: true } }]
    });

    // 饼图2
    const categoryChart = echarts.init(document.getElementById('categoryChart'));
    categoryChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [{ type: 'pie', radius: '50%', data: data.charts.categoryDist, label: { show: true } }]
    });

    const handleResize = () => {
      enrollChart.resize();
      activityChart.resize();
      statusChart.resize();
      categoryChart.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data]);

  if (!data) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div style={{ padding: 20 }}>
      <h1>工作台</h1>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="课程总数" value={data.stats.totalCourses} /></Card></Col>
        <Col span={6}><Card><Statistic title="已发布课程" value={data.stats.publishedCourses} /></Card></Col>
        <Col span={6}><Card><Statistic title="学生总数" value={data.stats.totalStudents} /></Card></Col>
        <Col span={6}><Card><Statistic title="活跃学生" value={data.stats.activeStudents} /></Card></Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}><Card title="课程选课人数 TOP 8"><div id="enrollChart" style={{ height: 400 }} /></Card></Col>
        <Col span={12}><Card title="近7天学习活跃度"><div id="activityChart" style={{ height: 400 }} /></Card></Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}><Card title="学生状态分布"><div id="statusChart" style={{ height: 400 }} /></Card></Col>
        <Col span={12}><Card title="课程分类分布"><div id="categoryChart" style={{ height: 400 }} /></Card></Col>
      </Row>
    </div>
  );
};

export default Dashboard;