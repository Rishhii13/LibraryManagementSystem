import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketTest = () => {
  const [status, setStatus] = useState("Connecting...");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      setStatus("Connected");
    });

    socket.on("connection-success", (data) => {
      setMessage(data.message);
    });

    const handleBookEvent = (data) => {
      const notification = {
        id: `${Date.now()}-${Math.random()}`,
        message: data.message,
        title: data.book?.title || data.book?.name || data.title || "",
      };

      setNotifications((previous) => [
        notification,
        ...previous,
      ]);
    };

    socket.on("book-created", handleBookEvent);
    socket.on("book-updated", handleBookEvent);
    socket.on("book-deleted", handleBookEvent);

    socket.on("connect_error", () => {
      setStatus("Connection failed");
    });

    socket.on("disconnect", () => {
      setStatus("Disconnected");
    });

    return () => {
      socket.off("book-created", handleBookEvent);
      socket.off("book-updated", handleBookEvent);
      socket.off("book-deleted", handleBookEvent);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow">
        <h1 className="mb-5 text-2xl font-bold">
          Library Real-Time Notifications
        </h1>

        <p className="mb-3">
          Connection Status:{" "}
          <span
            className={
              status === "Connected"
                ? "font-semibold text-green-600"
                : "font-semibold text-red-600"
            }
          >
            {status}
          </span>
        </p>

        <p className="mb-6 text-slate-700">
          Server Message: {message || "Waiting for server..."}
        </p>

        <h2 className="mb-3 text-xl font-semibold">
          Book Activity
        </h2>

        {notifications.length === 0 ? (
          <p className="rounded-lg bg-slate-50 p-4 text-slate-500">
            No book activity yet. Add, update, or delete a book
            to receive a real-time notification.
          </p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="rounded-lg border border-blue-200 bg-blue-50 p-4"
              >
                <p className="font-medium text-slate-800">
                  {notification.message}
                </p>

                {notification.title && (
                  <p className="mt-1 text-sm text-slate-600">
                    Book: {notification.title}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocketTest;