import { useState, useEffect, useCallback } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Tabs,
  Modal,
  Divider,
  Popconfirm,
} from "antd";
import {
  LockOutlined,
  UserOutlined,
  SafetyOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  backend,
  updateUserProfile,
  downloadMyData,
  deactivateAccount,
} from "../../modules/auth/services/authenticationService";

const DEFAULT_PREFERENCES = { theme: "light", language: "en" };

function SettingsPage({
  settingsEndpoint,
  roleLabel = "",
  showDepartment = false,
}) {
  const [form] = Form.useForm();
  const [preferencesForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [preferencesLoading, setPreferencesLoading] = useState(false);
  const [data, setData] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
  };

  const loadPreferences = useCallback(async () => {
    setLoading(true);
    try {
      const response = await backend.get(settingsEndpoint);
      const profile = response.data.data;
      const user = profile?.user || {};

      const nextPreferences = {
        theme: ["light", "dark"].includes(user.theme) ? user.theme : "light",
        language: ["en", "sw"].includes(user.language) ? user.language : "en",
      };

      const formattedData = {
        firstName: user.firstname ?? "",
        lastName: user.lastname ?? "",
        email: user.email ?? "",
        phone: user.phone_no ?? "",
        userId: profile?.user_id,
      };

      if (showDepartment) {
        formattedData.department = profile?.department?.dept_name ?? "";
      }

      setData(formattedData);
      form.setFieldsValue(formattedData);
      preferencesForm.setFieldsValue(nextPreferences);
      localStorage.setItem("theme", nextPreferences.theme);
      localStorage.setItem("language", nextPreferences.language);
      applyTheme(nextPreferences.theme);
    } catch (error) {
      const detail =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0] ||
        error?.message ||
        "Please try again.";
      console.error("loadSettings error:", error);
      message.error(`Failed to load settings. ${detail}`);
      preferencesForm.setFieldsValue(DEFAULT_PREFERENCES);
    } finally {
      setLoading(false);
    }
  }, [settingsEndpoint, showDepartment, form, preferencesForm]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const handleProfileUpdate = async (values) => {
    setLoading(true);
    try {
      const phone = values.phone?.trim();
      await updateUserProfile(data?.userId, { phone_no: phone });
      setData((prev) => ({ ...prev, phone }));
      form.setFieldsValue({ phone });
      message.success("Phone number updated successfully!");
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          error?.response?.data?.errors?.phone_no?.[0] ||
          "Failed to update phone number."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values) => {
    if (values.current_password === values.new_password) {
      message.error("New password must be different from your current password.");
      return;
    }

    setPasswordLoading(true);
    try {
      await backend.post("/api/changePassword", {
        current_password: values.current_password,
        new_password: values.new_password,
        new_password_confirmation: values.new_password_confirmation,
      });

      message.success("Password changed successfully!");
      passwordForm.resetFields();
      setShowPasswordModal(false);
    } catch (error) {
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.new_password?.[0];
      message.error(
        backendMessage ||
          "Failed to change password. Please check your current password and try again."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePreferencesChange = async (key, value) => {
    const nextPreferences = { ...preferencesForm.getFieldsValue(), [key]: value };
    setPreferencesLoading(true);
    applyTheme(key === "theme" ? value : nextPreferences.theme);
    try {
      await updateUserProfile(data?.userId, nextPreferences);
      preferencesForm.setFieldsValue(nextPreferences);
      localStorage.setItem("theme", nextPreferences.theme);
      localStorage.setItem("language", nextPreferences.language);
      message.success("Preferences updated!");
    } catch {
      message.error("Failed to save preferences. Please try again.");
    } finally {
      setPreferencesLoading(false);
    }
  };

  const handleDownloadData = async () => {
    try {
      const res = await downloadMyData();
      const payload = res?.data ?? {};
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `my-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success("Your data has been downloaded.");
    } catch {
      message.error("Failed to export your data.");
    }
  };

  const handleDeactivate = async () => {
    setDeactivating(true);
    try {
      await deactivateAccount();
      message.success("Your account has been deactivated.");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/Login";
    } catch {
      message.error("Failed to deactivate your account.");
      setDeactivating(false);
    }
  };

  const items = [
    {
      label: (
        <span>
          <UserOutlined className="mr-2" />
          Profile
        </span>
      ),
      key: "profile",
      children: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-[#2d2a24] mb-4">
              Personal Information
            </h3>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleProfileUpdate}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true, message: "Please enter first name" }]}
                >
                  <Input
                    readOnly
                    variant="borderless"
                    className="rounded-lg bg-gray-100"
                  />
                </Form.Item>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[{ required: true, message: "Please enter last name" }]}
                >
                  <Input
                    readOnly
                    variant="borderless"
                    className="rounded-lg bg-gray-100"
                  />
                </Form.Item>
              </div>

              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  readOnly
                  variant="borderless"
                  className="rounded-lg bg-gray-100"
                />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: "Please enter phone number" },
                  { max: 14, message: "Phone number must be at most 14 characters" },
                ]}
              >
                <Input className="rounded-lg focus:border-[#c4622d]" />
              </Form.Item>

              {showDepartment && (
                <Form.Item
                  label="Department"
                  name="department"
                  rules={[{ required: true }]}
                >
                  <Input
                    readOnly
                    variant="borderless"
                    className="rounded-lg bg-gray-100"
                  />
                </Form.Item>
              )}

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full md:w-auto bg-[#c4622d] text-white hover:bg-[#a85225]"
              >
                Update Profile
              </Button>
            </Form>
          </div>
        </div>
      ),
    },
    {
      label: (
        <span>
          <LockOutlined className="mr-2" />
          Security
        </span>
      ),
      key: "security",
      children: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-[#2d2a24] mb-4">
              Password & Security
            </h3>
            <div className="flex items-center justify-between p-4 bg-[#f4f1ec] rounded-lg border border-[#e5e0d8]">
              <div>
                <p className="font-medium text-[#2d2a24]">Password</p>
                <p className="text-sm text-[#a6a199]">Change your account password</p>
              </div>
              <Button
                type="primary"
                onClick={() => setShowPasswordModal(true)}
                className="bg-[#c4622d] text-white hover:bg-[#a85225]"
              >
                Change Password
              </Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: (
        <span>
          <SafetyOutlined className="mr-2" />
          Preferences
        </span>
      ),
      key: "preferences",
      children: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-[#2d2a24]">
            Display & System Preferences
          </h3>

          <div className="space-y-4">
            <Form
              form={preferencesForm}
              layout="vertical"
              initialValues={preferencesForm.getFieldsValue()}
            >
              <Form.Item label="Theme" name="theme" className="mb-4">
                <Select
                  disabled={preferencesLoading}
                  onChange={(value) => handlePreferencesChange("theme", value)}
                  options={[
                    { label: "Light", value: "light" },
                    { label: "Dark", value: "dark" },
                  ]}
                />
              </Form.Item>

              <Form.Item label="Language" name="language" className="mb-4">
                <Select
                  disabled={preferencesLoading}
                  onChange={(value) => handlePreferencesChange("language", value)}
                  options={[
                    { label: "English", value: "en" },
                    { label: "Swahili", value: "sw" },
                  ]}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      ),
    },
    {
      label: (
        <span>
          <DownloadOutlined className="mr-2" />
          Account
        </span>
      ),
      key: "account",
      children: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-[#2d2a24]">Account Actions</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-[#f4f1ec] rounded-lg border border-[#e5e0d8]">
              <div>
                <p className="font-medium text-[#2d2a24]">Download My Data</p>
                <p className="text-sm text-[#a6a199]">
                  Export a copy of your personal data in JSON format.
                </p>
              </div>
              <Button
                type="primary"
                ghost
                onClick={handleDownloadData}
                icon={<DownloadOutlined />}
                className="border-[#e5e0d8] text-[#2d2a24]"
              >
                Download
              </Button>
            </div>

            <Divider />

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="font-medium text-red-700">Deactivate Account</p>
              <p className="text-sm text-red-600 mt-1">
                Deactivating disables your login. You can contact the administrator
                to reactivate it later.
              </p>
              <Popconfirm
                title="Deactivate your account?"
                description="You will be logged out and will no longer be able to sign in."
                okText="Deactivate"
                okButtonProps={{ danger: true }}
                cancelText="Cancel"
                onConfirm={handleDeactivate}
              >
                <Button
                  block
                  danger
                  loading={deactivating}
                  icon={<ExclamationCircleOutlined />}
                  className="mt-4"
                >
                  Deactivate Account
                </Button>
              </Popconfirm>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="w-full max-w-4xl bg-[#ffffff] border border-[#e5e0d8] shadow-[0_20px_50px_-20px_rgba(45,42,36,0.08)] rounded-lg md:rounded-2xl p-3 md:p-6 lg:p-8 relative z-10">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#2d2a24] mb-2 text-center tracking-tight">
            Settings
          </h1>
          <p className="text-center text-gray-600 text-sm md:text-base">
            Manage your {roleLabel ? `${roleLabel} ` : ""}account settings and preferences
          </p>
        </div>

        <Tabs items={items} className="settings-tabs" />
      </div>

      <Modal
        title="Change Password"
        open={showPasswordModal}
        onCancel={() => {
          setShowPasswordModal(false);
          passwordForm.resetFields();
        }}
        footer={null}
        centered
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
          className="mt-6"
        >
          <Form.Item
            label="Current Password"
            name="current_password"
            rules={[{ required: true, message: "Please enter current password" }]}
          >
            <Input.Password placeholder="Current Password" />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="new_password"
            dependencies={["current_password"]}
            rules={[
              { required: true, message: "Please enter new password" },
              { min: 8, message: "Password must be at least 8 characters" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value && getFieldValue("current_password") === value) {
                    return Promise.reject(
                      new Error("New password must differ from current password")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password placeholder="New Password" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="new_password_confirmation"
            dependencies={["new_password"]}
            rules={[
              { required: true, message: "Please confirm password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={passwordLoading}
            block
            className="bg-[#c4622d] text-white hover:bg-[#a85225]"
          >
            Change Password
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default SettingsPage;
