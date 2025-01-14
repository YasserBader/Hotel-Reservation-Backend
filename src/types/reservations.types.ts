export interface Reservation {
  reservation_id: number;
  guest_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}
