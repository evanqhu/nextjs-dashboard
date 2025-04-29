'use client';

import { CustomerField, InvoiceForm } from '@/app/lib/definitions';
import InvoiceFormUI from './invoice-form-ui';

export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
}) {
  const updateInvoice = async (formData: FormData) => {
    // 这里实现更新发票的逻辑
    // 你可以从原来的 actions.ts 中移植过来
    'use server';
    // ... 更新发票的具体实现
  };

  return (
    <InvoiceFormUI
      customers={customers}
      defaultValues={{
        customerId: invoice.customer_id,
        amount: invoice.amount,
        status: invoice.status,
      }}
      submitButtonLabel="Edit Invoice"
      onSubmit={updateInvoice}
    />
  );
} 