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
  initials: string;
  queueNumber: number;
  status: PatientStatus;
  room: string | null;
  checkedInAt: string;
  reasonForVisit: string;
  seenByDoctor: string | null;
  diagnosis: string | null;
  notes: string | null;
};

export type UserRole = {
  userId: string;
  role: 'receptionist' | 'doctor';
};