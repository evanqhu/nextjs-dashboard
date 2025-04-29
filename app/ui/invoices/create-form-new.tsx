import { CustomerField } from '@/app/lib/definitions';
import { createInvoice } from '@/app/lib/actions';
import InvoiceFormUI from './invoice-form-ui';

export default function CreateInvoiceForm({ customers }: { customers: CustomerField[] }) {
  return (
    <InvoiceFormUI
      customers={customers}
      submitButtonLabel="Create Invoice"
      onSubmit={createInvoice}
    />
  );
} 