import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  getNotificationPermission,
  requestNotificationPermission,
  showTestNotification,
} from "../lib/notifications";

type SettingsPageProps = {
  userEmail?: string;
};

export default function SettingsPage({ userEmail }: SettingsPageProps) {
  const [permission, setPermission] = useState<string>("default");
  const [isRequesting, setIsRequesting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
    }
  };

  const handleEnableNotifications = async () => {
    setIsRequesting(true);

    try {
      const result = await requestNotificationPermission();
      setPermission(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to request permission.";
      alert(message);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleTestNotification = async () => {
    setIsTesting(true);

    try {
      if (permission !== "granted") {
        alert("Please enable notifications first.");
        return;
      }

      await showTestNotification();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to show notification.";
      alert(message);
    } finally {
      setIsTesting(false);
    }
  };

  const permissionLabel =
    permission === "granted"
      ? "Allowed"
      : permission === "denied"
      ? "Blocked"
      : permission === "unsupported"
      ? "Not supported"
      : "Not yet allowed";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your GLacs account and preferences here.
        </p>
      </div>

      <div className="rounded-2xl border bg-gray-50 p-4">
        <h2 className="text-lg font-semibold">Account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Logged in as: <span className="font-medium">{userEmail || "Unknown user"}</span>
        </p>
      </div>

      <div className="rounded-2xl border bg-gray-50 p-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <p className="mt-2 text-sm text-gray-600">
          Current permission: <span className="font-medium">{permissionLabel}</span>
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleEnableNotifications}
            disabled={isRequesting}
            className="rounded-lg bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
          >
            {isRequesting ? "Requesting..." : "Enable Notifications"}
          </button>

          <button
            onClick={handleTestNotification}
            disabled={isTesting}
            className="rounded-lg border px-4 py-2 hover:bg-white disabled:opacity-50"
          >
            {isTesting ? "Sending..." : "Test Notification"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border bg-gray-50 p-4">
        <h2 className="text-lg font-semibold">Session</h2>
        <p className="mt-2 text-sm text-gray-600">
          You can sign out of your account here.
        </p>

        <button
          onClick={handleLogout}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:opacity-90"
        >
          Logout
        </button>
      </div>
    </div>
  );
}