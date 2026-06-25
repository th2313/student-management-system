import { useEffect, useState } from 'react';
import { Card, Spin, message, Button, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getSummary } from '../api/summary';
import type { SummaryData } from '../type';

// 自定义代码块组件（带语法高亮 + 复制按钮）
const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const code = String(children).replace(/\n$/, '');
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    message.success('代码已复制');
  };

  if (!inline && match) {
    return (
      <div style={{ position: 'relative', margin: '16px 0' }}>
        <Tooltip title="复制代码">
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined />}
            onClick={handleCopy}
            style={{ position: 'absolute', top: 8, right: 8, zIndex: 1, color: '#fff' }}
          />
        </Tooltip>
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          showLineNumbers
          {...props}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  }
  return <code className={className} {...props}>{children}</code>;
};

const Summary = () => {
  const [data, setData] = useState<SummaryData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSummary();
        setData(res.data);
      } catch (error) {
        console.error('获取总结失败:', error);
      }
    };
    fetchData();
  }, []);

  if (!data) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <Card title="学习总结">
      <div className="markdown-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: CodeBlock,  // 使用自定义代码块组件
          }}
        >
          {data.content}
        </ReactMarkdown>
      </div>
    </Card>
  );
};

export default Summary;