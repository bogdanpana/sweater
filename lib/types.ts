export type Participant = {
  id: string;
  nickname: string;
  photo_url: string;
  votes_count: number;
  approved: boolean;
  created_at: string;
};

export type DeviceStatus = {
  device_id: string;
  has_uploaded: boolean;
  has_voted: boolean;
};

