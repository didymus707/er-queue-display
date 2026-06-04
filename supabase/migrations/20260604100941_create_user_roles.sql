create table user_roles (
  user_id uuid references auth.users(id) primary key,
  role text not null check (role in ('receptionist', 'doctor'))
);
