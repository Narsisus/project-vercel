import Layout from "../components/layout";
import useSWR from "swr";
import axios from "axios";
import { Button, Alert } from "@mantine/core";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import Loading from "../components/loading";
import cafeBackgroundImage from "../assets/images/lovepik-coffee-bean-picture_500553969.jpg";

interface Order {
  id: number;
  total_order: string[];
  status: string;
  total_price: number;
  comments: string;
}

export default function EmployeeOrderPage() {
  const { data: orders, error, mutate } = useSWR<Order[]>("/orders");

  const handleOrderCompletion = async (orderId: number) => {
    try {
      await axios.patch(`/orders/${orderId}`, { status: "Completed" });
      mutate(); // Refresh orders list
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleOrderCancellation = async (orderId: number) => {
    try {
      await axios.patch(`/orders/${orderId}`, { status: "Canceled" });
      mutate(); // Refresh orders list
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <Layout>
      <section
        className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
        style={{ backgroundImage: `url(${cafeBackgroundImage})` }}
      >
        <h1 className="text-5xl mb-2">รายการออเดอร์</h1>
        <h2>รายการออเดอร์ที่รอดำเนินการ</h2>
      </section>

      <section className="container mx-auto py-8">
        <h1 className="text-xl mb-4">รายการออเดอร์</h1>

        {!orders && !error && <Loading />}
        {error && (
          <Alert
            color="red"
            title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
            icon={<IconAlertTriangleFilled />}
          >
            {error.message}
          </Alert>
        )}

        {orders?.length === 0 && (
          <div className="text-center py-4">
            <p>ไม่มีออเดอร์ที่รอดำเนินการ</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders?.filter(order => order.status === "Pending").map(order => (
            <div className="border border-solid border-neutral-200 p-4" key={order.id}>
              <h2 className="text-lg font-semibold">ออเดอร์ #{order.id}</h2>
              <p className="text-sm">สถานะ: {order.status}</p>
              <p className="text-sm">รายการ: {order.total_order.join(", ")}</p>
              <p className="text-sm">ราคารวม: {order.total_price} บาท</p>
              <p className="text-sm">หมายเหตุ: {order.comments || "ไม่มี"}</p>
              <div className="flex space-x-2 mt-2">
                <Button
                  variant="filled"
                  onClick={() => handleOrderCompletion(order.id)}
                >
                  ดำเนินการเสร็จสิ้น
                </Button>
                <Button
                  variant="outline"
                  color="red"
                  onClick={() => handleOrderCancellation(order.id)}
                >
                  ยกเลิก
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
