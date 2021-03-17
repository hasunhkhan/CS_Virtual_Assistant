-- joseph
create table USERINFO(
  U_Name varchar(11),
  U_Email varchar(32),
  password varchar(32),
  Userid numeric(12) primary key
);
create table STUDENT(
  S_Name varchar(11),
  S_Email varchar(32) primary key
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
  OfficeHours varchar(12),
  Room numeric(4),
  CourseNumber numeric(6),
  Grade numeric(3)
);

create view SCHEDULE(SName, SDays)
as select   CName, Days
   from     CLASS
   group by CName, Days;

create view STOREDEMAILS(Email ) 
as select   P.P_Email from professor P
   UNION ALL
   select   S.S_Email from student S
   UNION ALL
   select   C.C_Email from counselor C;

create view Grades(Class, Grade)
as select   C.CName, C.Grade
   from     class c
   order by CName;


create function addstudent(name varchar(11), email varchar(32))
RETURNS VOID AS $$
begin
    insert into STUDENT(S_Name, S_Email) values
		       (name, email);
end;
$$
LANGUAGE plpgsql;

create function addProf(name varchar(11), email varchar(32), office numeric(4), class varchar(32))
RETURNS VOID AS $$
begin
    insert into PROFESSOR(P_Name, P_Email, Office, Class) values
			  (name, email, office, class);
end;
$$
LANGUAGE plpgsql;

create function addCoun(name varchar(11), email varchar(32), office numeric(4))
RETURNS VOID AS $$
begin
    insert into COUNSELOR(C_Name, C_Email, Office) values
			  (name, email, office);
end;
$$
LANGUAGE plpgsql;

create function addclass(name varchar(11), starttime numeric(4), days varchar(12), officeh varchar(12), roomnum numeric(4), coursenum numeric(6), grade numeric(3))
RETURNS VOID AS $$
begin
    insert into CLASS(CName, StartTime, Days, OfficeHours, Room, CourseNumber, Grade) 
                values(name, starttime, days, officeh, roomnum, coursenum, grade);
end;
$$
LANGUAGE plpgsql;

create function NewUser (name varchar(11), email varchar(32),
    			 password varchar(32), id numeric(9))

RETURNS VOID AS $$
begin
    insert into USERINFO(U_Name, U_Email, password, Userid) values
    			 (name, email, password, id);
end;
$$
LANGUAGE plpgsql;

create function GPA()
Returns double precision as $$
begin
	return(select AVG(Grade)
	       from   Grades);
end;
$$
LANGUAGE plpgsql;
