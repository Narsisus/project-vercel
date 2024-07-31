import Layout from "../components/layout";
import useSWR from "swr";
import axios from "axios";
import { Button, Alert } from "@mantine/core";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import Loading from "../components/loading";

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

  return (
    <Layout>
      <section className="container mx-auto py-8">
        <h1 className="text-xl mb-4">รายการออเดอร์ที่รอดำเนินการ</h1>

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
              <Button
                className="mt-2"
                variant="filled"
                onClick={() => handleOrderCompletion(order.id)}
              >
                ดำเนินการเสร็จสิ้น
              </Button>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}