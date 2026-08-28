import { Form, Input, Select, Button } from "antd";

const { Option } = Select;

const TaskForm = ({ initialValues, students = [], onSubmit, submitting }) => {
  const [form] = Form.useForm();

  const initial =
    initialValues && Object.keys(initialValues).length
      ? {
          task_title: initialValues.title,
          task_description: initialValues.description,
          due_date: initialValues.dueDate,
          student_ids: initialValues.student_ids || [],
        }
      : undefined;

  return (
    <Form
      form={form}
      initialValues={initial}
      onFinish={onSubmit}
      layout="vertical"
    >
      <Form.Item
        label="Task Title"
        name="task_title"
        rules={[{ required: true, message: "Please enter task title" }]}
      >
        <Input placeholder="e.g. Final Year Project Milestone" />
      </Form.Item>

      <Form.Item
        label="Task Description"
        name="task_description"
        rules={[{ required: true, message: "Please enter task description" }]}
      >
        <Input.TextArea rows={4} placeholder="Describe the task in detail" />
      </Form.Item>

      <Form.Item
        label="Due Date"
        name="due_date"
        rules={[{ required: true, message: "Please select a due date" }]}
      >
        <Input type="date" />
      </Form.Item>

      <Form.Item
        label="Assign Students"
        name="student_ids"
        rules={[{ required: true, message: "Please select at least one student" }]}
        extra="Only students from your department are shown below."
      >
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Select students from your department"
          options={students.map((student) => ({
            label: student.full_name,
            value: student.id,
          }))}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={submitting} block>
        {initialValues && Object.keys(initialValues).length
          ? "Update Task"
          : "Create Task"}
      </Button>
    </Form>
  );
};

export default TaskForm;
