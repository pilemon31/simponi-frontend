import { OrdersDetailDrawer } from './orders-detail-drawer';
import { useOrders } from './orders-provider';

export function OrdersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useOrders();

  return (
    <>
      {currentRow && (
        <OrdersDetailDrawer
          key={`orders-detail-${currentRow.id ?? currentRow.order_number}`}
          open={open === 'detail'}
          onOpenChange={(nextOpen: boolean) => {
            setOpen(nextOpen ? 'detail' : null);
            if (!nextOpen) {
              setTimeout(() => {
                setCurrentRow(null);
              }, 300);
            }
          }}
          currentRow={currentRow}
        />
      )}
    </>
  );
}
