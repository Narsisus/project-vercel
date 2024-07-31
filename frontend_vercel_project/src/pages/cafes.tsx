import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/coffee-1.jpg";
import useSWR from "swr";
import { Cafe } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button } from "@mantine/core";
import { IconAlertTriangleFilled } from "@tabler/icons-react";

export default function CafesPage() {
  const navigate = useNavigate();
  const { data: cafes, error } = useSWR<Cafe[]>("/cafes");
  const [orderCounts, setOrderCounts] = useState<{ [key: number]: number }>({});

  const handleIncrease = (cafeId: number) => {
    setOrderCounts((prevCounts) => ({
      ...prevCounts,
      [cafeId]: (prevCounts[cafeId] || 0) + 1,
    }));
  };

  const handleDecrease = (cafeId: number) => {
    setOrderCounts((prevCounts) => ({
      ...prevCounts,
      [cafeId]: Math.max((prevCounts[cafeId] || 0) - 1, 0),
    }));
  };

  const handleOrder = () => {
    const orderItems = Object.keys(orderCounts)
      .filter((cafeId) => orderCounts[parseInt(cafeId)] > 0)
      .map((cafeId) => ({
        cafeId: parseInt(cafeId),
        quantity: orderCounts[parseInt(cafeId)],
      }));

    // Store order data in local storage or state management
    localStorage.setItem("orderItems", JSON.stringify(orderItems));
    navigate("/order-summary");
  };

  return (
    <Layout>
      <section
        className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
        style={{ backgroundImage: `url(${cafeBackgroundImage})` }}
      >
        <h1 className="text-5xl mb-2">เมนู</h1>
        <h2>รายการเมนูทั้งหมด</h2>
      </section>

      <section className="container mx-auto py-8">
        <div className="flex justify-between">
          <h1>รายการเมนู</h1>
        </div>

        {!cafes && !error && <Loading />}
        {error && (
          <Alert
            color="red"
            title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
            icon={<IconAlertTriangleFilled />}
          >
            {error.message}
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cafes?.map((cafe) => (
            <div className="border border-solid border-neutral-200" key={cafe.id}>
              <img
                src= "../assets/images/coffee-1.jpg"
                alt={cafe.name}
                className="w-full object-cover aspect-[3/4]"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold line-clamp-2">{cafe.name}</h2>
                <p className="text-xs text-neutral-500">รายละเอียด {cafe.comments}</p>
                <p className="text-xs text-neutral-500">ราคา {cafe.price}</p>
              </div>

              <div className="flex justify-between px-4 pb-2">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="default"
                    size="xs"
                    onClick={() => handleDecrease(cafe.id)}
                  >
                    -
                  </Button>
                  <span>{orderCounts[cafe.id] || 0}</span>
                  <Button
                    variant="default"
                    size="xs"
                    onClick={() => handleIncrease(cafe.id)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="fixed bottom-4 right-4">
        <Button
          size="lg"
          variant="primary"
          onClick={handleOrder}
          disabled={Object.values(orderCounts).every((count) => count === 0)}
        >
          สั่งซื้อ
        </Button>
      </div>
    </Layout>
  );
}
