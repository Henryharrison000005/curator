import { useState, useEffect } from "react";
import {Table,Button,Modal,Form,Select,Input,Card,Spin,message,Empty,Space,Tag,} from "antd";
import { EditOutlined,SaveOutlined,CloseOutlined,UserOutlined,TeamOutlined,} from "@ant-design/icons";
import {getInstructorStudents,getDepartmentSupervisors,updateStudentAssignment,} from "./services/instructorService";
import { useSelector } from "react-redux";

const InstructorDepartmentManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const instructorName = user?.username || "Instructor";
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [supervisors, setSupervisors] = useState([]);
  const [supervisorLoading, setSupervisorLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [allDepartments, setAllDepartments] = useState([]);

  // Load students on mount
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await getInstructorStudents();
      const studentsData = response.data || [];
      setStudents(studentsData);
      
      // Extract unique departments from students
      const depts = Array.from(
        new Map(
          studentsData.map((s) => [
            s.dept_id,
            { value: s.dept_id, label: s.department_name },
          ])
        ).values()
      );
      setAllDepartments(depts);
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to load students"
      );
      setStudents([]);
      setAllDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSupervisors = async (departmentId) => {
    if (!departmentId) return;
    setSupervisorLoading(true);
    try {
      const response = await getDepartmentSupervisors(departmentId);
      const supervisorsList = response.data?.supervisors || [];
      setSupervisors(supervisorsList);
      
      // Update students with supervisor names for this department
      setStudents(prevStudents =>
        prevStudents.map(student => {
          if (student.dept_id === departmentId && student.supervisor_id && !student.supervisor_name) {
            const supervisor = supervisorsList.find(s => s.id === student.supervisor_id);
            return {
              ...student,
              supervisor_name: supervisor?.full_name || supervisor?.name,
            };
          }
          return student;
        })
      );
    } catch {
      message.error("Failed to load supervisors");
      setSupervisors([]);
    } finally {
      setSupervisorLoading(false);
    }
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    form.resetFields();
    form.setFieldsValue({
      full_name: student.full_name,
      dept_id: student.dept_id,
      supervisor_id: student.supervisor_id,
    });
    loadSupervisors(student.dept_id);
    setIsModalVisible(true);
  };

  const handleDepartmentChange = (deptId) => {
    form.setFieldValue("supervisor_id", null);
    setSupervisors([]);
    loadSupervisors(deptId);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedStudent(null);
    setSupervisors([]);
  };

  const handleSubmit = async (values) => {
    if (!selectedStudent) {
      message.error("No student selected");
      return;
    }

    setSubmitLoading(true);
    try {
      const payload = {
        department_id: Number(values.dept_id),
        supervisor_id: Number(values.supervisor_id),
      };

      await updateStudentAssignment(selectedStudent.id, payload);

      // Find the names for display
      const deptName = allDepartments.find((d) => d.value === values.dept_id)?.label || values.dept_id;
      const supervisorName = supervisors.find((s) => s.id === values.supervisor_id)?.full_name || "";

      // Update students list
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === selectedStudent.id
            ? {
                ...student,
                dept_id: values.dept_id,
                department_name: deptName,
                supervisor_id: values.supervisor_id,
                supervisor_name: supervisorName,
              }
            : student
        )
      );

      message.success("Student assignment updated successfully!");
      handleCancel();
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to update student");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Filter students based on search
  const filteredStudents = students.filter((student) =>
    student.full_name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "No.",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Student Name",
      dataIndex: "full_name",
      key: "full_name",
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
      render: (text) => (
        <span className="font-medium text-gray-700">{text}</span>
      ),
    },
    {
      title: "Department",
      dataIndex: "department_name",
      key: "department_name",
      render: (text) => (
        <Tag color="blue" icon={<TeamOutlined />}>
          {text }
        </Tag>
      ),
    },
    {
      title: "Supervisor",
      dataIndex: "supervisor_name",
      key: "supervisor_name",
      render: (text) => (
        <span>{text ? <UserOutlined /> : null} {text || "None"}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEditClick(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full p-4 md:p-6">
      <Card
        title={
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eafaf8] text-[#0e8a86] ring-1 ring-[#c9f0ec]">
              <TeamOutlined className="text-xl" />
            </div>
            <div>
              <h1 className="font-display text-xl md:text-2xl font-bold text-[#16243f] tracking-tight">
                Student Department &amp; Supervisor Management
              </h1>
              <p className="font-mono-label text-[11px] text-gray-500 mt-1 uppercase tracking-wide">
                Manage assignments · {instructorName}
              </p>
            </div>
          </div>
        }
        className="shadow-lg"
        extra={
          <Button type="default" onClick={loadStudents}>
            Refresh
          </Button>
        }
      >
        {/* Search Bar */}
        <div className="mb-6">
          <Input.Search
            placeholder="Search by student name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="large"
            className="w-full md:w-96"
            allowClear
          />
        </div>

        {/* Students Table */}
        <Spin spinning={loading} tip="Loading students...">
          {filteredStudents.length > 0 ? (
            <Table
              columns={columns}
              dataSource={filteredStudents}
              rowKey={(record) => record.id}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} students`,
              }}
              scroll={{ x: 1000 }}
            />
          ) : (
            <Empty
              description={
                students.length === 0
                  ? "No students found"
                  : "No results matching your search"
              }
              className="py-12"
            />
          )}
        </Spin>
      </Card>

      {/* Edit Modal */}
      <Modal
        title="Edit Student Assignment"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={500}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-6"
        >
          {/* Student Name (Read-only) */}
          <Form.Item label="Student Name">
            <Input
              disabled
              value={form.getFieldValue("full_name")}
              prefix={<UserOutlined />}
              className="bg-gray-50"
            />
          </Form.Item>

          {/* Department Selection */}
          <Form.Item
            name="dept_id"
            label="Department"
            rules={[{ required: true, message: "Please select a department" }]}
          >
            <Select
              placeholder="Select department..."
              onChange={handleDepartmentChange}
              options={allDepartments}
            />
          </Form.Item>

          {/* Supervisor Selection */}
          <Form.Item
            name="supervisor_id"
            label="Supervisor"
            rules={[{ required: true, message: "Please select a supervisor" }]}
          >
            <Select
              placeholder="Select supervisor..."
              loading={supervisorLoading}
              options={supervisors.map((supervisor) => ({
                label: supervisor.full_name || supervisor.name,
                value: supervisor.id,
              }))}
              notFoundContent={
                supervisorLoading ? (
                  <Spin size="small" />
                ) : (
                  <Empty description="No supervisors available" />
                )
              }
            />
          </Form.Item>

          {/* Action Buttons */}
          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={handleCancel} icon={<CloseOutlined />}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={submitLoading}
              >
                Save Changes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InstructorDepartmentManagement;
