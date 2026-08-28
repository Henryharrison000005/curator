import SettingsPage from "../../common/components/SettingsPage";

export default function SupervisorSettings() {
  return (
    <SettingsPage
      settingsEndpoint="/api/getSupervisorSettings"
      roleLabel="Supervisor"
      showDepartment
    />
  );
}
