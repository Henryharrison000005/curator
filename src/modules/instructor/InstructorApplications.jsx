import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Input,
  Card,
  Spin,
  message,
  Empty,
  Space,
  Tag,
  Descriptions,
  Alert,
  Result,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  UserOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import {
  getApplications,
  acceptApplication,
  rejectApplication,
  getDepartmentSupervisors,
} from "./services/instructorService";
import { useSelector } from "react-redux";

const InstructorApplications = () => {
  const { user } = useSelector((state) => state.auth);
  const instructorName = user?.username || "Instructor";

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [supervisors, setSupervisors] = useState([]);
  const [supervisorLoading, setSupervisorLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [acceptedResult, setAcceptedResult] = useState(null);
  const [acceptForm] = Form.useForm();
  const [rejectForm] = Form.useForm();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const response = await getApplications();
      setApplications(response.data || []);
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to load applications"
      );
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSupervisors = async (departmentId) => {
    if (!departmentId) return;
    setSupervisorLoading(true);
    try {
      const response = await getDepartmentSupervisors(departmentId);
      setSupervisors(response.data?.supervisors || []);
    } catch {
      setSupervisors([]);
      message.error("Failed to load supervisors");
    } finally {
      setSupervisorLoading(false);
    }
  };

  const openAccept = (record) => {
    setSelected(record);
    setAcceptedResult(null);
    acceptForm.resetFields();
    acceptForm.setFieldsValue({
      field_start_date: record.field_start_date,
      field_end_date: record.field_end_date,
    });
    loadSupervisors(record.department_id);
    setAcceptOpen(true);
  };

  const openReject = (record) => {
    setSelected(record);
    rejectForm.resetFields();
    setRejectOpen(true);
  };

  const handleAccept = async (values) => {
    if (!selected) return;
    setSubmitLoading(true);
    try {
      const payload = {
        supervisor_id: values.supervisor_id,
        field_start_date: values.field_start_date,
        field_end_date: values.field_end_date,
      };
      const response = await acceptApplication(selected.id, payload);
      setAcceptedResult({
        default_password: response.default_password,
        message: response.message,
      });
      setApplications((prev) =>
        prev.map((app) =>
          app.id === selected.id
            ? { ...app, application_status: "approved" }
            : app
        )
      );
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to accept application"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReject = async (values) => {
    if (!selected) return;
    setSubmitLoading(true);
    try {
      await rejectApplication(selected.id, {
        rejection_reason: values.rejection_reason,
      });
      message.success("Application rejected.");
      setApplications((prev) =>
        prev.map((app) =>
          app.id === selected.id
            ? { ...app, application_status: "rejected" }
            : app
        )
      );
      setRejectOpen(false);
      setSelected(null);
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to reject application"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const filtered = applications.filter(
    (app) => statusFilter === "all" || app.application_status === statusFilter
  );

  const statusTag = (status) => {
    if (status === "pending")
      return <Tag color="gold">Pending</Tag>;
    if (status === "approved")
      return <Tag color="green">Approved</Tag>;
    return <Tag color="red">Rejected</Tag>;
  };

  const columns = [
    {
      title: "No.",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Applicant",
      key: "full_name",
      render: (_, record) => (
        <div>
          <span className="font-medium text-gray-800">{record.full_name}</span>
          <span className="block text-xs text-gray-500">
            {record.username} · {record.email}
          </span>
        </div>
      ),
    },
    {
      title: "College",
      dataIndex: "college",
      key: "college",
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: "Age / Gender",
      key: "age_gender",
      width: 120,
      render: (_, record) => `${record.age} · ${record.gender}`,
    },
    {
      title: "Department",
      dataIndex: "department_name",
      key: "department_name",
      render: (text) => (
        <Tag color="blue" icon={<TeamOutlined />}>{text}</Tag>
      ),
    },
    {
      title: "Field Dates",
      key: "dates",
      width: 200,
      render: (_, record) => `${record.field_start_date} → ${record.field_end_date}`,
    },
    {
      title: "Status",
      dataIndex: "application_status",
      key: "application_status",
      width: 110,
      render: (s) => statusTag(s),
    },
    {
      title: "Action",
      key: "action",
      width: 170,
      render: (_, record) =>
        record.application_status === "pending" ? (
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => openAccept(record)}
            >
              Review
            </Button>
            <Button
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={() => openReject(record)}
            />
          </Space>
        ) : (
          <span className="text-gray-400 text-sm">No action</span>
        ),
    },
  ];

  return (
    <div className="w-full p-4 md:p-6">
      <Card
        title={
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eafaf8] text-[#0e8a86] ring-1 ring-[#c9f0ec]">
              <InboxOutlined className="text-xl" />
            </div>
            <div>
              <h1 className="font-display text-xl md:text-2xl font-bold text-[#16243f] tracking-tight">
                Field Applications
              </h1>
              <p className="font-mono-label text-[11px] text-gray-500 mt-1 uppercase tracking-wide">
                Review &amp; accept · {instructorName}
              </p>
            </div>
          </div>
        }
        className="shadow-lg"
        extra={<Button type="default" onClick={loadApplications}>Refresh</Button>}
      >
        <div className="mb-4">
          <Space wrap>
            {[
              { key: "pending", label: "Pending" },
              { key: "approved", label: "Approved" },
              { key: "rejected", label: "Rejected" },
              { key: "all", label: "All" },
            ].map((t) => (
              <Button
                key={t.key}
                type={statusFilter === t.key ? "primary" : "default"}
                onClick={() => setStatusFilter(t.key)}
              >
                {t.label}
              </Button>
            ))}
          </Space>
        </div>

        <Spin spinning={loading} tip="Loading applications...">
          {filtered.length > 0 ? (
            <Table
              columns={columns}
              dataSource={filtered}
              rowKey={(record) => record.id}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} applications`,
              }}
              scroll={{ x: 1100 }}
            />
          ) : (
            <Empty
              description={
                applications.length === 0
                  ? "No applications found"
                  : "No applications in this status"
              }
              className="py-12"
            />
          )}
        </Spin>
      </Card>

      {/* Accept / Review Modal */}
      <Modal
        title="Review Application & Assign Supervisor"
        open={acceptOpen}
        onCancel={() => {
          setAcceptOpen(false);
          setSelected(null);
          setAcceptedResult(null);
        }}
        footer={null}
        width={640}
        centered
      >
        {acceptedResult ? (
          <Result
            status="success"
            title="Application Accepted"
            subTitle={acceptedResult.message}
            extra={[
              <Alert
                key="pwd"
                type="info"
                showIcon
                message={`Default account password: ${acceptedResult.default_password}`}
                description="Share this temporary password with the student. They can change it after first login."
              />,
              <Button
                key="done"
                type="primary"
                className="mt-4"
                onClick={() => {
                  setAcceptOpen(false);
                  setSelected(null);
                  setAcceptedResult(null);
                  loadApplications();
                }}
              >
                Done
              </Button>,
            ]}
          />
        ) : (
          <>
            {selected && (
              <Descriptions
                column={2}
                size="small"
                bordered
                className="mb-4"
                items={[
                  { key: "n", label: "Applicant", children: selected.full_name, span: 2 },
                  { key: "e", label: "Email", children: selected.email },
                  { key: "p", label: "Phone", children: selected.phone_no },
                  { key: "c", label: "College", children: selected.college },
                  { key: "a", label: "Age / Gender", children: `${selected.age} / ${selected.gender}` },
                  { key: "cit", label: "Citizenship", children: selected.citizenship },
                  { key: "d", label: "Department", children: selected.department_name },
                  { key: "s", label: "Field Dates", children: `${selected.field_start_date} → ${selected.field_end_date}`, span: 2 },
                ]}
              />
            )}
            <Form
              form={acceptForm}
              layout="vertical"
              onFinish={handleAccept}
            >
              <Form.Item
                name="supervisor_id"
                label="Assign Supervisor"
                rules={[{ required: true, message: "Please select a supervisor" }]}
              >
                <Select
                  placeholder="Select supervisor..."
                  loading={supervisorLoading}
                  prefix={<UserOutlined />}
                  options={supervisors.map((s) => ({
                    label: s.full_name,
                    value: s.id,
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
              <div className="grid grid-cols-2 gap-3">
                <Form.Item
                  name="field_start_date"
                  label="Field Start Date"
                >
                  <Input type="date" />
                </Form.Item>
                <Form.Item
                  name="field_end_date"
                  label="Field End Date"
                >
                  <Input type="date" />
                </Form.Item>
              </div>
              <Alert
                type="info"
                showIcon
                message="On acceptance the student account is activated."
                description="The account's default password will be set to the applicant's surname in capital letters. Activation also creates the student profile and supervisor assignment."
                className="mb-4"
              />
              <Space className="w-full justify-end">
                <Button
                  onClick={() => {
                    setAcceptOpen(false);
                    setSelected(null);
                    setAcceptedResult(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<CheckCircleOutlined />}
                  loading={submitLoading}
                >
                  Accept &amp; Activate
                </Button>
              </Space>
            </Form>
          </>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Reject Application"
        open={rejectOpen}
        onCancel={() => {
          setRejectOpen(false);
          setSelected(null);
        }}
        footer={null}
        width={500}
        centered
      >
        <Form form={rejectForm} layout="vertical" onFinish={handleReject}>
          <Form.Item
            name="rejection_reason"
            label="Rejection Reason"
            rules={[{ required: true, message: "Please provide a reason" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Explain why this application is being rejected..."
            />
          </Form.Item>
          <Space className="w-full justify-end">
            <Button
              onClick={() => {
                setRejectOpen(false);
                setSelected(null);
              }}
            >
              Cancel
            </Button>
            <Button
              danger
              type="primary"
              htmlType="submit"
              icon={<CloseCircleOutlined />}
              loading={submitLoading}
            >
              Reject Application
            </Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default InstructorApplications;
