export type ServiceCategory =
  | 'diagnostics'
  | 'oil_change'
  | 'brakes'
  | 'battery'
  | 'tires'
  | 'ac_heating'
  | 'engine'
  | 'electrical'
  | 'transmission'
  | 'other';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  base_price: number;
  duration_minutes: number;
  is_active: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  customer_id: string;
  service_id: string;
  service?: Service;
  customer?: Customer;
  status: BookingStatus;
  scheduled_date: string;
  scheduled_time: string;
  address: string;
  city: string;
  zip: string;
  vehicle_year: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_vin?: string;
  notes?: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address?: string;
  city?: string;
  zip?: string;
  created_at: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  booking_id?: string;
  booking?: Booking;
  customer_id: string;
  customer?: Customer;
  items: InvoiceItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  status: InvoiceStatus;
  due_date: string;
  paid_at?: string;
  notes?: string;
  created_at: string;
}

export interface BookingFormData {
  service_id: string;
  scheduled_date: string;
  scheduled_time: string;
  address: string;
  city: string;
  zip: string;
  vehicle_year: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_vin?: string;
  notes?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface ContactFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  service_type: string;
  vehicle: string;
  message: string;
}

export interface DashboardStats {
  total_bookings: number;
  pending_bookings: number;
  completed_jobs: number;
  total_revenue: number;
  this_month_revenue: number;
  new_customers: number;
}
