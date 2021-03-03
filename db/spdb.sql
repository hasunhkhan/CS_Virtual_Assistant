-- joseph
create table USERINFO(
  U_Name varchar(11),
  U_Email varchar(32),
  password varchar(32),
  Userid numeric(9) primary key
);
create table STUDENT(
  S_Name varchar(11),
  S_Email varchar(32),
  Sid numeric(9) primary key
);

create table PROFESSOR(
  P_Name varchar(11) primary key,
  P_Email varchar(32),
  Office numeric(4),
  Class varchar(32)
);

create table COUNSELOR(
  C_Name varchar(11) primary key,
  C_Email varchar(32),
  office numeric(4)
);
create table CLASS(
  CName varchar(32) unique primary key,
  StartTime numeric(4),
  Days varchar(12) unique,
  PName varchar(11),
  OfficeHours varchar(10),
  Room numeric(4),
  CourseNumber numeric(6),
  foreign key(PName) references PROFESSOR(P_Name)
);

create view SCHEDULE(SName, SDays)
as select   CName, Days
   from     CLASS
   group by CName, Days;

/*create table DEPARTMENT INFO(
  
);
*/
create view STOREDEMAILS(S_Name, S_Email ) 
as select   P_Name, P_Email
   from	    professor
   group by P_Name, P_Email;

create function NewUser (name varchar(11), email varchar(32),
    			 password varchar(32), id numeric(9))

RETURNS VOID AS $$
begin
    insert into USERINFO(U_Name, U_Email, password, Userid) values
    			 (name, email, password, id);
end;
$$
LANGUAGE plpgsql;

