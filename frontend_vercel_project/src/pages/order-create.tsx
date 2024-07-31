import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { Button, Container, Divider, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";

export default function OrderSummaryPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Sample items to order; replace with actual items from the cart or state
  const orderItems = [
    { id: 1, name: "Coffee", price: 50, quantity: 2 },
    { id: 2, name: "Cake", price: 80, quantity: 1 },
  ];

  // Calculate total price
  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderCreateForm = useForm({
    initialValues: {
      comments: "",
    },

    validate: {
      comments: (value) => (value.length > 0 ? null : "กรุณาใส่หมายเหตุ"),
    },
  });

  const handleSubmit = async (values: typeof orderCreateForm.values) => {
    try {
      setIsProcessing(true);
      const orderData = {
        total_or: orderItems.map(item => `${item.name} x ${item.quantity}`),
        total_price: totalPrice,
        comments: values.comments,
        status: "Pending",
        cafe_id: orderItems[0].id // Example; adjust as needed
      };

      const response = await axios.post("/orders", orderData);
      notifications.show({
        title: "สั่งซื้อสำเร็จ",
        message: "คำสั่งซื้อของคุณได้รับการบันทึกเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/orders/${response.data.id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        notifications.show({
          title: "เกิดข้อผิดพลาด",
          message: "กรุณาลองอีกครั้งหรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
          color: "red",
        });
      } else {
        notifications.show({
          title: "เกิดข้อผิดพลาดบางอย่าง",
          message: "กรุณาลองใหม่อีกครั้ง",
          color: "red",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Layout>
        <Container className="mt-8">
          <h1 className="text-xl">สรุปคำสั่งซื้อ</h1>
          <div className="space-y-4">
            {orderItems.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name}</span>
                <span>{item.quantity} x {item.price} บาท</span>
              </div>
            ))}
            <Divider />
            <div className="flex justify-between font-bold">
              <span>ยอดรวม</span>
              <span>{totalPrice} บาท</span>
            </div>
          </div>

          <form onSubmit={orderCreateForm.onSubmit(handleSubmit)} className="space-y-4 mt-8">
            <Textarea
              label="หมายเหตุ"
              placeholder="ใส่หมายเหตุเพิ่มเติม"
              {...orderCreateForm.getInputProps("comments")}
            />

            <Button type="submit" loading={isProcessing}>
              สั่งซื้อ
            </Button>
          </form>
        </Container>
      </Layout>
    </>
  );
}
