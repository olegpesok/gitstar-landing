create table if not exists users(
  id integer primary key autoIncrement,
  email varchar(100),
  created_at date,
  updated_at date
);
