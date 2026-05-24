export const RequestNotificationPermission =
  async () => {

    if (
      !("Notification" in window)
    ) {

      console.log(
        "Browser does not support notifications"
      );

      return false;
    }

    // ALREADY ALLOWED
    if (
      Notification.permission ===
      "granted"
    ) {

      return true;
    }

    // ASK PERMISSION
    const permission =
      await Notification.requestPermission();

    return (
      permission === "granted"
    );
  };

// =========================
// SHOW NOTIFICATION
// =========================

export const ShowNotification = (
  title,
  body
) => {

  if (
    Notification.permission ===
    "granted"
  ) {

    new Notification(
      title,
      {
        body,
        icon: "/logo.png",
      }
    );
  }
};