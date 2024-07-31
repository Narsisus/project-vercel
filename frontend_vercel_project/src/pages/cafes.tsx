import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-2.jpg";
import useSWR from "swr";
import { Cafe } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button } from "@mantine/core";
import { IconAlertTriangleFilled, } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function CafesPage() {
    const { data: cafes, error } = useSWR<Cafe[]>("/cafes");

    return (
        <>
            <Layout>
                <section
                    className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
                    style={{
                        backgroundImage: `url(${cafeBackgroundImage})`,
                    }}
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
                                    src="https://placehold.co/150x200"
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
                                            onClick={() => {/* ลดจำนวนเมนูที่จะสั่ง */ }}
                                        >
                                            -
                                        </Button>
                                        <span>0</span> {/* แสดงจำนวนเมนูที่จะสั่ง */}
                                        <Button
                                            variant="default"
                                            size="xs"
                                            onClick={() => {/* เพิ่มจำนวนเมนูที่จะสั่ง */ }}
                                        >
                                            +
                                        </Button>
                                    </div>
                                    <Button
                                        component={Link}
                                        to={`/cafes/${cafe.id}/order`}
                                        size="xs"
                                        variant="primary"
                                    >
                                        สั่งซื้อ
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </Layout>
        </>
    );
}
