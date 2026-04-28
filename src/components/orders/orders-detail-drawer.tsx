import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { OrderItem, OrderProductItem } from '@/types/order.type';
import { useOrderDetail } from '@/hooks/use-orders';

type OrdersDetailDrawerProps = {
  currentRow: OrderItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '-';
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (value?: string) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const getOrderItems = (order: OrderItem) =>
  order.order_details ?? order.items ?? order.order_items ?? [];

const getItemName = (item: OrderProductItem) =>
  item.external_product?.product_name ??
  item.product_name ??
  item.name ??
  'Unnamed product';

const getItemQuantity = (item: OrderProductItem) => item.quantity ?? item.qty ?? 0;

const getItemPrice = (item: OrderProductItem) =>
  item.unit_price ?? item.price ?? item.external_product?.price;

const getItemSubtotal = (item: OrderProductItem) =>
  item.total_price ?? item.subtotal ?? (getItemPrice(item) ?? 0) * getItemQuantity(item);

const getItemImage = (item: OrderProductItem) => item.external_product?.image;

function DetailRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className='grid grid-cols-[120px_1fr] gap-3 text-sm'>
      <span className='text-muted-foreground'>{label}</span>
      <span className='min-w-0 break-words font-medium'>{value || '-'}</span>
    </div>
  );
}

export function OrdersDetailDrawer({
  currentRow,
  open,
  onOpenChange,
}: OrdersDetailDrawerProps) {
  const detailKey = currentRow.id ?? currentRow.order_number;
  const { data: detailResponse, isFetching } = useOrderDetail(detailKey);
  const order =
    detailResponse?.status === true ? detailResponse.data : currentRow;
  const items = getOrderItems(order);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col py-3 sm:max-w-xl'>
        <SheetHeader className='text-start'>
          <SheetTitle>Order Detail</SheetTitle>
          <SheetDescription>
            {order.order_number} from {order.platform || '-'}
          </SheetDescription>
        </SheetHeader>

        <div className='flex-1 space-y-6 overflow-y-auto px-4'>
          <section className='space-y-3'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge variant='outline'>{order.order_status || 'Unknown'}</Badge>
              <Badge variant='secondary'>{order.payment_status || 'Unknown'}</Badge>
            </div>
            <div className='space-y-2'>
              <DetailRow label='Order Number' value={order.order_number} />
              <DetailRow label='External ID' value={order.external_order_id} />
              <DetailRow label='Ordered At' value={formatDate(order.ordered_at)} />
              <DetailRow label='Paid At' value={formatDate(order.paid_at)} />
              <DetailRow label='Shipped At' value={formatDate(order.shipped_at)} />
              <DetailRow label='Created At' value={formatDate(order.created_at)} />
              <DetailRow label='Total' value={formatCurrency(order.total_amount)} />
            </div>
          </section>

          <Separator />

          <section className='space-y-3'>
            <h3 className='text-sm font-semibold'>Buyer</h3>
            <div className='space-y-2'>
              <DetailRow label='Name' value={order.buyer_name} />
              <DetailRow label='Email' value={order.buyer_email} />
              <DetailRow label='Phone' value={order.buyer_phone} />
            </div>
          </section>

          <Separator />

          <section className='space-y-3'>
            <h3 className='text-sm font-semibold'>Shipping</h3>
            <div className='space-y-2'>
              <DetailRow label='Recipient' value={order.receipent_name} />
              <DetailRow label='Phone' value={order.receipent_phone} />
              <DetailRow label='Method' value={order.shipping_method} />
              <DetailRow label='Tracking No.' value={order.tracking_number} />
              <DetailRow label='Address' value={order.shipping_address} />
              <DetailRow label='City' value={order.shipping_city} />
              <DetailRow label='Province' value={order.shipping_province} />
              <DetailRow label='Postal Code' value={order.shipping_postal} />
            </div>
          </section>

          <Separator />

          <section className='space-y-3'>
            <h3 className='text-sm font-semibold'>Payment & Amount</h3>
            <div className='space-y-2'>
              <DetailRow label='Method' value={order.payment_method} />
              <DetailRow label='Status' value={order.payment_status} />
              <DetailRow label='Subtotal' value={formatCurrency(order.subtotal_amount)} />
              <DetailRow label='Shipping Fee' value={formatCurrency(order.shipping_fee)} />
              <DetailRow
                label='Marketplace Fee'
                value={formatCurrency(order.marketplace_fee)}
              />
              <DetailRow label='Discount' value={formatCurrency(order.discount_amount)} />
              <DetailRow label='Tax' value={formatCurrency(order.tax_amount)} />
              <DetailRow label='Net Amount' value={formatCurrency(order.net_amount)} />
              <DetailRow label='Total' value={formatCurrency(order.total_amount)} />
            </div>
          </section>

          <Separator />

          <section className='space-y-3'>
            <div className='flex items-center justify-between gap-3'>
              <h3 className='text-sm font-semibold'>Items</h3>
              <span className='text-xs text-muted-foreground'>
                {isFetching
                  ? 'Loading...'
                  : `${items.length} item${items.length === 1 ? '' : 's'}`}
              </span>
            </div>

            {items.length > 0 ? (
              <div className='overflow-hidden rounded-md border'>
                {items.map((item, index) => (
                  <div
                    key={item.id ?? `${getItemName(item)}-${index}`}
                    className='space-y-2 border-b p-3 last:border-b-0'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='flex min-w-0 items-start gap-3'>
                        <div className='flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-xs text-muted-foreground'>
                          {getItemImage(item) ? (
                            <img
                              src={getItemImage(item)}
                              alt={getItemName(item)}
                              className='size-full object-cover'
                            />
                          ) : (
                            'No img'
                          )}
                        </div>
                        <div className='min-w-0'>
                          <p className='truncate text-sm font-medium'>
                            {getItemName(item)}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {item.external_product_id
                              ? `External ID: ${item.external_product_id}`
                              : 'No external ID'}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {item.external_product?.platform ?? order.platform ?? '-'}
                          </p>
                        </div>
                      </div>
                      <span className='shrink-0 text-sm font-medium'>
                        x{getItemQuantity(item)}
                      </span>
                    </div>
                    <div className='flex items-center justify-between gap-3 text-sm'>
                      <span className='text-muted-foreground'>
                        {formatCurrency(getItemPrice(item))}
                      </span>
                      <span className='font-medium'>
                        {formatCurrency(getItemSubtotal(item))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='rounded-md border border-dashed p-4 text-sm text-muted-foreground'>
                No purchased items found for this order.
              </div>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
