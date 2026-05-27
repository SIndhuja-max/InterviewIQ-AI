export const RequestNotificationPermission =
  async () => {

    try {

      if (
        !("Notification" in window)
      ) {

        console.log(
          "Browser does not support notifications"
        );

        return false;
      }

      // ALREADY GRANTED

      if (
        Notification.permission ===
        "granted"
      ) {

        return true;
      }

      // REQUEST PERMISSION

      const permission =
        await Notification.requestPermission();

      return (
        permission === "granted"
      );

    } catch (error) {

      console.log(
        "NOTIFICATION PERMISSION ERROR:",
        error
      );

      return false;
    }
  };

// =========================
// SHOW NOTIFICATION
// =========================

export const ShowNotification = (
  title,
  body
) => {

  try {

    if (
      !("Notification" in window)
    ) {

      console.log(
        "Notifications not supported"
      );

      return;
    }

    if (
      Notification.permission !==
      "granted"
    ) {

      console.log(
        "Notification permission not granted"
      );

      return;
    }

    setTimeout(() => {

  const notification =
    new Notification(
      title,
      {
        body,
      }
    );

  notification.onclick =
    () => {

      window.focus();

      notification.close();
    };

}, 2000);

    console.log(
      "Notification shown successfully"
    );

  } catch (error) {

    console.log(
      "SHOW NOTIFICATION ERROR:",
      error
    );
  }
};