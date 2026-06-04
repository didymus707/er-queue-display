export type PatientStatus = "waiting" | "called" | "recalled" | "done";

export type Patient = {
  id: string;
  name: string;
  age: number;
  createdAt: string; 
};

export type QueueEntry = {
  id: string;
  patientId: string;
  inititals: string;
  queueNumber: number;
  status: PatientStatus;
  room: string | null;
  checkedInAt: string;
  reasonForVisit: string;
  seenByDoctor: string;
  dignosis: string;
  notes: string;
};

type UserRole = {
  userId: string;           // uuid → auth.users(id)
  role: 'receptionist' | 'doctor';
};