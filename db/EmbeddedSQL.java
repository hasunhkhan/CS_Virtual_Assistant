/*
 * Template JAVA User Interface
 * =============================
 * acquired from Anthony Bianchi, CMPS 3420-03
 * Target DBMS: 'Postgres'
 *
 */


import java.sql.DriverManager;
import java.sql.Connection;
import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.util.Scanner;
import java.lang.*;
/**
 * This class defines a simple embedded SQL utility class that is designed to
 * work with PostgreSQL JDBC drivers.
 *
 */
public class EmbeddedSQL {

   // reference to physical database connection.
   private Connection _connection = null;

   // handling the keyboard inputs through a BufferedReader
   // This variable can be global for convenience.
   static BufferedReader in = new BufferedReader(
                                new InputStreamReader(System.in));

   /**
    * Creates a new instance of EmbeddedSQL
    *
    * @param hostname the MySQL or PostgreSQL server hostname
    * @param database the name of the database
    * @param username the user name used to login to the database
    * @param password the user login password
    * @throws java.sql.SQLException when failed to make a connection.
    */
   public EmbeddedSQL (String database, String username, String password) throws SQLException {

     System.out.print("Connecting to database...");
       try
       {
         // constructs the connection URL
         String url = "jdbc:postgresql://localhost/" + database;
         System.out.println ("Connection URL: " + url + "\n");

         // obtain a physical connection
         this._connection = DriverManager.getConnection (url, username, password);
         System.out.println("Done");
       }
       catch (Exception e)
       {
               System.err.println( "Error - Unable to Connect to Database: " + e.getMessage() );
               System.out.println("Make sure you started postgres on this machine");
               System.exit(-1);
       }

   }

   /**
    * Method to execute an update SQL statement.  Update SQL instructions
    * includes CREATE, INSERT, UPDATE, DELETE, and DROP.
    *
    * @param sql the input SQL string
    * @throws java.sql.SQLException when update failed
    */
   public void executeUpdate (String sql) throws SQLException {
      // creates a statement object
      Statement stmt = this._connection.createStatement ();

      // issues the update instruction
      stmt.executeUpdate (sql);

      // close the instruction
      stmt.close ();
   }

   /**
    * Method to execute an input query SQL instruction (i.e. SELECT).  This
    * method issues the query to the DBMS and outputs the results to
    * standard out.
    *
    * @param query the input query string
    * @return the number of rows returned
    * @throws java.sql.SQLException when failed to execute the query
    */
   public int executeQuery (String query) throws SQLException {
      // creates a statement object
      Statement stmt = this._connection.createStatement ();

      // issues the query instruction
      ResultSet rs = stmt.executeQuery (query);

      /*
       ** obtains the metadata object for the returned result set.  The metadata
       ** contains row and column info.
       */
      ResultSetMetaData rsmd = rs.getMetaData ();
      int numCol = rsmd.getColumnCount ();
      int rowCount = 0;

      // iterates through the result set and output them to standard out.
      while (rs.next ()) {
         for (int i=1; i<=numCol; ++i)
            System.out.println (rsmd.getColumnName (i) +
               " = " + rs.getString (i));
         System.out.println ();
         ++rowCount;
      }
      stmt.close ();
      return rowCount;
   }
   public int executeQuery (String query, String selection, String[] rows) throws SQLException 
   {
      // creates a statement object
      Statement stmt = this._connection.createStatement ();

      // issues the query instruction
      ResultSet rs = stmt.executeQuery (query);

      /*
       ** obtains the metadata object for the returned result set.  The metadata
       ** contains row and column info.
       */
      ResultSetMetaData rsmd = rs.getMetaData ();
      int numCol = rsmd.getColumnCount ();
      int rowCount = 0;
	  int x = 0;
	  try
	  {
		  FileWriter fw = new FileWriter(selection); 
		  BufferedWriter bw = new BufferedWriter(fw);
		  
		  while(rs.next())
		  {
			  if(x==0)
			  {
				  for (int i = 1; i <= numCol; i++) 
				  {
						if (i > 1) 
						{
							try
							{
								bw.write("|  ");
							}catch(Exception e)
							{
								System.out.println("Exception"+e);
							}
						}
						try
						{
							String columnName = rsmd.getColumnName(i);
							bw.write(columnName);
						}catch(Exception e)
						{
								System.out.println("Exception"+e);
						}	
						
					}
			  }
					x++;

					try 
				   {
					   String col1=rs.getString(rows[0]);
					   String col2=rs.getString(rows[1]);
					   String col3=rs.getString(rows[2]);
					   bw.newLine();
					   bw.write(col1);
					   bw.append("|  ");
					   bw.write(col2);
					   bw.append("|  ");
					   bw.write(col3);

						bw.newLine();

				   }catch (Exception e)
				   {
					   System.out.println("Exception"+e);
				   }
		  }
			   bw.close();
			   stmt.close();
	  }
	  catch( Exception e )
	  {
		  e.printStackTrace();
	  }
      
      return rowCount;
   }
   
   

   /**
    * Method to close the physical connection if it is open.
    */
   public void cleanup () {
      try {
         if (this._connection != null)
            this._connection.close ();
      } catch (SQLException e) {
         // ignored.
      }
   }

   /**
    * The main execution method
    *
    * @param args the command line arguments this inclues the <mysql|pgsql> <login file>
    */
   public static void main (String[] args) {
      if (args.length != 3) {
         System.err.println (
            "Usage: " +
            "java [-classpath <classpath>] " +
            EmbeddedSQL.class.getName () +
            " <database> <username> <password>");
         return;
      }
      Greeting();
      EmbeddedSQL esql = null;
      try {

         // use postgres JDBC driver.
         Class.forName ("org.postgresql.Driver").newInstance ();
         // instantiate the EmbeddedSQL object and creates a physical
         // connection.
         String database = args[0];
         String username = args[1];
         String password = args[2];
         esql = new EmbeddedSQL (database, username, password);

         boolean keepon = true;
	 int p = 0;
         while(keepon)
         {
	     if(p == 0) {
                 System.out.println("\nCommand Testing");
                 System.out.println("---------");
                 System.out.println("1. GPA");
                 System.out.println("2. Stored Emails");
                 System.out.println("3. Professor information");
              	 System.out.println("4. Counselor information");
                 System.out.println("5. Student information");
		 System.out.println("6. Class information");
		 System.out.println("7. Schedule");
		 System.out.println("8. Grades");
		 System.out.println("9. Userinfo");
		 System.out.println("10. page 2");
                 System.out.println("0. Exit");
		 switch (readChoice())
                 {
                             //GPA
			case 1:   p1_Query1(esql); break;
                             //stored Emails
		        case 2:   p1_Query2(esql); break;
			     //Professor Information
                        case 3:   p1_Query3(esql); break;
			     //Counselor Information
		        case 4:   p1_Query4(esql); break;
			     //Student infromation
			case 5:   p1_Query5(esql); break;
			     //Class Information
			case 6:   p1_Query6(esql); break;
			     //schedule
			case 7:   p1_Query7(esql); break;
			     //print grades
			case 8:   p1_Query8(esql); break;
			     //user info
			case 9:   p1_Query9(esql); break;
		   	     //exit
			case 10:  p = 1; break;
			case 0:   keepon = false; break;
			default : System.out.println("Unrecognized choice!"); break;
              }
	 } if(p == 1) {
		 System.out.println("\nPage 2");
                 System.out.println("---------");
                 System.out.println("1. Add Professor");
                 System.out.println("2. Add Counselor");
                 System.out.println("3. Add Student");
              	 System.out.println("4. Add Class");
		 System.out.println("commands 5-9 are case sensitive");
                 System.out.println("5. Remove Professor");
		 System.out.println("6. Remove Counselor");
		 System.out.println("7. Remove Student");
		 System.out.println("8. Remove class");
		 System.out.println("9. page 1");
                 System.out.println("0. Exit");
		 switch (readChoice())
                 {
                             //add professor
			case 1:   p2_Query1(esql); break;
                             //add counselor
		        case 2:   p2_Query2(esql); break;
			     //add student
                        case 3:   p2_Query3(esql); break;
			     //add class
		        case 4:   p2_Query4(esql); break;
			     //remove professor
			case 5:   p2_Query5(esql); break;
			     //remove counselor
			case 6:   p2_Query6(esql); break;
			     //remove student
			case 7:   p2_Query7(esql); break;
			     //remove class
			case 8:   p2_Query8(esql); break;
		   	     //return to page 1
			case 9:  p = 0; break;
		 	     //exit
			case 0:   keepon = false; break;
			default : System.out.println("Unrecognized choice!"); break;
		 }
	    }
	}
      } catch (Exception e) {
         System.err.println (e.getMessage ());
      } finally {
         // make sure to cleanup the created table and close the connection.
         try {
            if (esql != null) {
               System.out.print("Disconnecting from database...");
               esql.cleanup ();
               System.out.println("Done\n\nBye !");
            }
         } catch (Exception e) {
            // ignored.
         }
      }
      }
   
   public static void Greeting()
   {
        System.out.println(
        "\n\n*******************************************************\n" +
        "              User Interface      	               \n" +
        "*******************************************************\n");
   }

/*
 * Reads the users choice given from the keyboard
 * @int
 **/
  public static int readChoice() {
    int input;
    // returns only if a correct value is given.
    do {
      System.out.print("Please make your choice: ");
      try { // read the integer, parse it and break.
        input = Integer.parseInt(in.readLine());
	System.out.println("\n");
        break;
      }
      catch (Exception e) {
        System.out.println("Your input is invalid!");
        continue;
      }
    }
    while (true);
    return input;
  }

  
    //GPA
    public static void p1_Query1(EmbeddedSQL esql)
    {
        try{
        String query = "select GPA()";

        int rowcount = esql.executeQuery (query);
        System.out.println ("total row(s): " + rowcount);
        
	}catch(Exception e)
        {
          System.err.println (e.getMessage ());
        }
     }
   
     //stored emails
     public static void p1_Query2(EmbeddedSQL esql)
     {
 	try{
	String query ="SELECT * from storedemails;";

        
	int rowCount = esql.executeQuery (query);
	
        System.out.println ("total row(s): " + rowCount);
        
	}catch(Exception e)
        {
          System.err.println (e.getMessage ());
        }
     }
     
     //Professor information
     public static void p1_Query3(EmbeddedSQL esql)
     {
        try{
        String query = "SELECT * from professor;";

        int rowcount = esql.executeQuery (query);
        System.out.println ("total row(s): " + rowcount);
        
	}catch(Exception e)
        {
          System.err.println (e.getMessage ());
        }	
     }
    
     //Counselor Information
     public static void p1_Query4(EmbeddedSQL esql)
     {
        try{
        String query = "select * from counselor;";

        int rowcount = esql.executeQuery (query);
        System.out.println ("total row(s): " + rowcount);
        
	}catch(Exception e)
        {
          System.err.println (e.getMessage ());
        }    
     }
    
     //Student Information
     public static void p1_Query5(EmbeddedSQL esql)
     {
        try{
        String query = "select * from student;";

        int rowcount = esql.executeQuery (query);
        System.out.println ("total row(s): " + rowcount);
        
	}catch(Exception e)
        {
          System.err.println (e.getMessage ());
        }    
     }
    
     //Class Information
     public static void p1_Query6(EmbeddedSQL esql)
     {
        try{
        String query = "select * from class;";

        int rowcount = esql.executeQuery (query);
        System.out.println ("total row(s): " + rowcount);
        
	}catch(Exception e)
        {
          System.err.println (e.getMessage ());
        }
     }
    
     //Schedule
     public static void p1_Query7(EmbeddedSQL esql)
     {
        try{
        String query = "select * from schedule";

        int rowcount = esql.executeQuery (query);
        System.out.println ("total row(s): " + rowcount);
        
	}catch(Exception e)
        {
          System.err.println (e.getMessage ());
        }
     }
    
     //Print Grades
     public static void p1_Query8(EmbeddedSQL esql)
     {
	try{
        String query = "select * from grades;";

        int rowcount = esql.executeQuery (query);
        System.out.println ("total row(s): " + rowcount);
        
	}catch(Exception e)
        {
          System.err.println (e.getMessage ());
        }
     }
     //user info
     public static void p1_Query9(EmbeddedSQL esql)
     {
	try{
        String query = "select * from userinfo;";

        int rowcount = esql.executeQuery (query);
        System.out.println ("total row(s): " + rowcount);
        
	}catch(Exception e)
        {
          System.err.println (e.getMessage ());
        }
     }
     //add professor 
     public static void p2_Query1(EmbeddedSQL esql)
     {
        try{
	String name,email,course, tmp;
	int office;
	
	System.out.println("Enter name: ");
	name = in.readLine();
	
	System.out.println("Enter email address: ");
	email = in.readLine();
	
	System.out.println("Enter course name: ");
	course = in.readLine();

	System.out.println("Enter office number: ");
	tmp = in.readLine();
	office = Integer.parseInt(tmp);

        String query = "select addProf('";
	query += name;
	query += "','";
	query += email;
	query += "',";
	query += office;
	query += ",'";
	query += course;
	query += "');";
        int rowcount = esql.executeQuery (query);
        System.out.println ("total row(s): " + rowcount);
        
	}catch(Exception e)
        {
          System.err.println (e.getMessage ());
        }
     }
   
     //add counselor
     public static void p2_Query2(EmbeddedSQL esql)
     {
	try{
	String name,email, tmp;
	int office;
	
	System.out.println("Enter name: ");
	name = in.readLine();
	
	System.out.println("Enter email address: ");
	email = in.readLine();

	System.out.println("Enter office number: ");
	tmp = in.readLine();
	office = Integer.parseInt(tmp);

        String query = "select addCoun('";
	query += name;
	query += "','";
	query += email;
	query += "',";
	query += office;
	query += ");";
        int rowcount = esql.executeQuery (query);
        System.out.println ("total row(s): " + rowcount);
        
	}catch(Exception e)
        {
          System.err.println (e.getMessage ());
        }
     }
     
     //add student
     public static void p2_Query3(EmbeddedSQL esql)
     {
        try{
	String name,email;
	
	System.out.println("Enter name: ");
	name = in.readLine();

	System.out.println("Enter email address: ");
	email = in.readLine();

        String query = "select addstudent('";
	query += name;
	query += "','";
	query += email;
	query += "');";
        int rowcount = esql.executeQuery (query);
        System.out.println ("total row(s): " + rowcount);
        
	}catch(Exception e)
        {
          System.err.println (e.getMessage ());
        }	
     }
    
     //add class
     public static void p2_Query4(EmbeddedSQL esql)
     {
        try{
	String name, days, oh,tmp;
	int st, room, course, grade;
	
	System.out.println("Enter name: ");
	name = in.readLine();
	
	System.out.println("Enter meet-up days: ");
	days = in.readLine();
	
	System.out.println("Enter office hours: ");
	oh = in.readLine();
	
	System.out.println("Enter start time: ");
	tmp = in.readLine();
	st = Integer.parseInt(tmp);
	
	System.out.println("Enter room number: ");
	tmp = in.readLine();
	room = Integer.parseInt(tmp);
	
	System.out.println("Enter course number: ");
	tmp = in.readLine();
	course = Integer.parseInt(tmp);

	System.out.println("Enter current grade: ");
	tmp = in.readLine();
	grade = Integer.parseInt(tmp);

        String query = "select addclass('";
	query += name;
	query += "',";
	query += st;
	query += ",'";
	query += days;
	query += "','";
	query += oh;
	query += "',";
	query += room;
	query += ",";
	query += course;
	query += ",";
	query += grade;
	query += ");";
        int rowcount = esql.executeQuery (query);
        System.out.println ("total row(s): " + rowcount);
        
	}catch(Exception e)
        {
          System.err.println (e.getMessage ());
        }    
     }
    
     //remove professor
     public static void p2_Query5(EmbeddedSQL esql)
     {
        try{
        System.out.println("Enter Professor Name: ");
	String input = in.readLine();
	String query = "select RemoveProfessor('";
	query += input;
	query += "')";

        int rowcount = esql.executeQuery (query);
        System.out.println ("total row(s): " + rowcount);
        
	}catch(Exception e)
        {
          System.err.println (e.getMessage ());
        }    
     }
    
     //remove counselor
     public static void p2_Query6(EmbeddedSQL esql)
     {
        try{
        System.out.println("Enter Counselor Name: ");
	String input = in.readLine();
	String query = "select RemoveCounselor('";
	query += input;
	query += "')";

        int rowcount = esql.executeQuery (query);
        System.out.println ("total row(s): " + rowcount);
        
	}catch(Exception e)
        {
          System.err.println (e.getMessage ());
        }
     }
    
     //remove student
     public static void p2_Query7(EmbeddedSQL esql)
     {
        try{
        System.out.println("Enter Student Name: ");
	String input = in.readLine();
	String query = "select RemoveStudent('";
	query += input;
	query += "')";

        int rowcount = esql.executeQuery (query);
        System.out.println ("total row(s): " + rowcount);
        
	}catch(Exception e)
        {
          System.err.println (e.getMessage ());
        }
     }
    
     //remove class
     public static void p2_Query8(EmbeddedSQL esql)
     {
	try{
        System.out.println("Enter Class Name: ");
	String input = in.readLine();
	String query = "select RemoveClass('";
	query += input;
	query += "')";

        int rowcount = esql.executeQuery (query);
        System.out.println ("total row(s): " + rowcount);
        
	}catch(Exception e)
        {
          System.err.println (e.getMessage ());
        }
     }
} //END OF CLASS
