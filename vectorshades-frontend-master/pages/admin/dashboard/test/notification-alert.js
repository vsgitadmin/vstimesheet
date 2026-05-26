import React from "react";
import { notificationAlert } from "../../../../src/Components/NotificationAlert/NotificationAlert";

const index = () => {

  const userImg = "b5229b0a-9ed0-46e9-8309-ebb16adfb0e7";
  const userName = "John Doe";
  const message = "@rashi mentioned you in designing groups chat";

  return (
    <div>
      <button onClick={() => notificationAlert(userImg,userName,message)}>Test Notification Alert</button>
    </div>
  );
};

export default index;
