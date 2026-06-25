import Router from '@koa/router';
import db from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { success, fail } from '../utils/response.js';

const router = new Router();

// 获取学生列表（支持搜索、班级、状态、课程筛选）
router.get('/', authenticateToken, async (ctx) => {
  const { keyword = '', className = '', status = '', courseId = '', page = 1, pageSize = 10 } = ctx.query;
  const offset = (Number(page) - 1) * Number(pageSize);

  let where = 'WHERE 1=1';
  const params = [];

  if (keyword) {
    where += ' AND (name LIKE ? OR student_no LIKE ?)';
    params.push(`%${keyword}%`, `%${keyword}%`);
  }
  if (className) {
    where += ' AND class_name = ?';
    params.push(className);
  }
  if (status) {
    where += ' AND status = ?';
    params.push(status);
  }

  let rows = db.prepare(`SELECT * FROM students ${where} ORDER BY created_at DESC`).all(...params);

  if (courseId) {
    rows = rows.filter(s => {
      const ids = JSON.parse(s.course_ids || '[]');
      return ids.includes(Number(courseId));
    });
  }

  const total = rows.length;
  const list = rows.slice(offset, offset + Number(pageSize)).map(s => ({
    ...s,
    course_ids: JSON.parse(s.course_ids || '[]'),
  }));

  success(ctx, { list, total, page: Number(page), pageSize: Number(pageSize) });
});

// 获取班级列表
router.get('/classes', authenticateToken, async (ctx) => {
  const classes = db.prepare("SELECT DISTINCT class_name FROM students WHERE class_name != '' ORDER BY class_name")
    .all()
    .map(r => r.class_name);
  success(ctx, classes);
});

// 获取学生详情
router.get('/:id', authenticateToken, async (ctx) => {
  const student = db.prepare('SELECT * FROM students WHERE id = ?').get(ctx.params.id);
  if (!student) {
    return fail(ctx, 404, '学生不存在');
  }
  student.course_ids = JSON.parse(student.course_ids || '[]');
  const courses = db.prepare('SELECT id, name FROM courses').all();
  const enrolledCourses = courses.filter(c => student.course_ids.includes(c.id));
  success(ctx, { ...student, enrolledCourses });
});

// ✅ 创建学生（已实现）
router.post('/', authenticateToken, async (ctx) => {
  const { name, student_no, class_name, phone, email, status, course_ids } = ctx.request.body;

  if (!name || !student_no) {
    return fail(ctx, 400, '姓名和学号不能为空');
  }

  const existing = db.prepare('SELECT id FROM students WHERE student_no = ?').get(student_no);
  if (existing) {
    return fail(ctx, 400, '学号已存在');
  }

  const courseIdsJson = JSON.stringify(course_ids || []);

  const result = db.prepare(`
    INSERT INTO students (name, student_no, class_name, phone, email, status, course_ids)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(name, student_no, class_name || '', phone || '', email || '', status || 'active', courseIdsJson);

  updateCourseCounts();

  const student = db.prepare('SELECT * FROM students WHERE id = ?').get(result.lastInsertRowid);
  student.course_ids = JSON.parse(student.course_ids);
  ctx.status = 201;
  success(ctx, student);
});

// ✅ 更新学生（已实现）
router.put('/:id', authenticateToken, async (ctx) => {
  const existing = db.prepare('SELECT * FROM students WHERE id = ?').get(ctx.params.id);
  if (!existing) {
    return fail(ctx, 404, '学生不存在');
  }

  const { name, student_no, class_name, phone, email, status, course_ids } = ctx.request.body;

  if (student_no && student_no !== existing.student_no) {
    const conflict = db.prepare('SELECT id FROM students WHERE student_no = ? AND id != ?').get(student_no, ctx.params.id);
    if (conflict) {
      return fail(ctx, 400, '学号已存在');
    }
  }

  const newName = name ?? existing.name;
  const newStudentNo = student_no ?? existing.student_no;
  const newClassName = class_name ?? existing.class_name;
  const newPhone = phone ?? existing.phone;
  const newEmail = email ?? existing.email;
  const newStatus = status ?? existing.status;
  const newCourseIds = JSON.stringify(course_ids ?? JSON.parse(existing.course_ids));

  db.prepare(`
    UPDATE students
    SET name = ?, student_no = ?, class_name = ?, phone = ?, email = ?, status = ?, course_ids = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(newName, newStudentNo, newClassName, newPhone, newEmail, newStatus, newCourseIds, ctx.params.id);

  updateCourseCounts();

  const student = db.prepare('SELECT * FROM students WHERE id = ?').get(ctx.params.id);
  student.course_ids = JSON.parse(student.course_ids);
  success(ctx, student);
});

// ✅ 删除学生（已实现）
router.delete('/:id', authenticateToken, async (ctx) => {
  const existing = db.prepare('SELECT * FROM students WHERE id = ?').get(ctx.params.id);
  if (!existing) {
    return fail(ctx, 404, '学生不存在');
  }

  db.prepare('DELETE FROM students WHERE id = ?').run(ctx.params.id);
  updateCourseCounts();

  success(ctx, null, '删除成功');
});

// 辅助函数：更新所有课程的选课人数
function updateCourseCounts() {
  const courses = db.prepare('SELECT id FROM courses').all();
  const students = db.prepare('SELECT course_ids FROM students').all();

  for (const course of courses) {
    const count = students.filter(s => {
      const ids = JSON.parse(s.course_ids || '[]');
      return ids.includes(course.id);
    }).length;
    db.prepare('UPDATE courses SET student_count = ? WHERE id = ?').run(count, course.id);
  }
}

export default router;