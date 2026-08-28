import SettingsPage from "../../common/components/SettingsPage";

export default function StudentSettings() {
  return (
    <SettingsPage
      settingsEndpoint="/api/getStudentSettings"
      roleLabel="Student"
      showDepartment
    />
  );
}
