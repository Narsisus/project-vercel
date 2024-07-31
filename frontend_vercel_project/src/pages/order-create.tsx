import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../components/layout";
import { Button, Textarea } from "@mantine/core";
import axios from "axios";
import { notifications } from "@mantine/notifications";

export default function OrderSummaryPage() {
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [comments, setComments] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Retrieve order items from local storage
    const savedOrderItems = localStorage.getItem("orderItems");
    if (savedOrderItems) {
      setOrderItems(JSON.parse(savedOrderItems));
    } else {
      navigate("/cafes"); // Redirect if no order data found
    }
  }, [navigate]);

  const handleSubmitOrder = async () => {
    setIsProcessing(true);

    try {
      await axios.post("/orders", {
        total_or: orderItems.map((item) => ({
          cafe_id: item.cafeId,
          quantity: item.quantity,
        })),
        total_price: orderItems.reduce((sum, item) => sum + item.quantity * 100, 0), // Adjust price calculation as needed
        comments,
        status: "Pending",
      });

      notifications.show({
        title: "สั่งซื้อสำเร็จ",
        message: "คำสั่งซื้อของคุณได้รับการบันทึกเรียบร้อยแล้ว",
        color: "teal",
      });

      localStorage.removeItem("orderItems");
      navigate("/cafes");
    } catch (error) {
      notifications.show({
        title: "เกิดข้อผิดพลาด",
        message: "กรุณาลองอีกครั้ง",
        color: "red",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <section className="container mx-auto py-8">
        <h1 className="text-xl mb-4">สรุปคำสั่งซื้อ</h1>

        <div className="space-y-4">
          {orderItems.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>เมนู ID: {item.cafeId}</span>
              <span>จำนวน: {item.quantity}</span>
            </div>
          ))}
        </div>

        <Textarea
          label="หมายเหตุเพิ่มเติม"
          placeholder="เพิ่มหมายเหตุ"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="mt-4"
        />

        <Button
          onClick={handleSubmitOrder}
          loading={isProcessing}
          className="mt-4"
        >
          ยืนยันคำสั่งซื้อ
        </Button>
      </section>
    </Layout>
  );
}
