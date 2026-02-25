import OrdersList from "../components/OrdersList";

export default function PrivateOrdersPage() {
  return (
    <OrdersList
      title="Private Lesson Orders"
      slotType="LESSON"
    />
  );
}