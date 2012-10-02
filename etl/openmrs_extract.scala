/*
    This script uses the DataExpress ETL scripting environment to transform data from the 
    OpenMRS demo data set into the schema for the Harvest demo project.

    Version 1.0


    This script requires the DataExpress.jar to be on your java classpath

    //TODO: more details here
*/

import edu.chop.cbmi.dataExpress.dsl.ETL._
import edu.chop.cbmi.dataExpress.dsl.stores.SqlDb
import edu.chop.cbmi.dataExpress.dataModels.RichOption._
import edu.chop.cbmi.dataExpress.dataModels._
import edu.chop.cbmi.dataExpress.dataModels.sql._
import edu.chop.cbmi.dataExpress.backends._
import edu.chop.cbmi.dataExpress.dataWriters.sql._

//Set up the connections to the OpenMRS source schema and the Harvest demo db

val harvest:SqlBackend = SqlBackendFactory("harvestdb.properties")
val openmrs:SqlBackend = SqlBackendFactory("openmrsdb.properties")

harvest.connect
openmrs.connect


/*

    Copy the person table

*/
def copyPerson = {
    val patients = """SELECT person_id as "id",
                          gender,
	                      birthdate,
                          case birthdate_estimated
                              when 0 then 'f'
                              when 1 then 't'
                              else null
                          end as birthdate_estimated
                     FROM person"""
    
    val source = DataTable(openmrs, patients)
    val writer = SqlTableWriter(harvest)
    //Need to cast the last column to a boolean data type, this should be way easier than it is
    source.foreach {r:DataRow[Any] =>
        val row = DataRow("id" -> r.id.as[Int].getOrElse(null),
                          "gender" -> r.gender.as[String].getOrElse(null),
                          "birthdate" -> r.birthdate.as[java.sql.Date].getOrElse(null),
                          "birthdate_estimated" -> {r.birthdate_estimated.as[String].get match {
                                      case "t" => true
                                      case "f" => false
                                      case _ => false
                           }})
        writer.insert_row("patient", row)

    }
    harvest commit

}

/*

    Copy the encounters, denormalizing a bit for convenience

*/
def copyEncounter = {
    val encounters = """SELECT e.encounter_id as id,
                               e.patient_id, 
                        	   e.encounter_datetime,
                               encounter_type.description
                          FROM encounter e
               LEFT OUTER JOIN (encounter_type) ON (e.encounter_type = encounter_type.encounter_type_id)"""    
    
    val source = DataTable(openmrs,encounters)
    val writer = SqlTableWriter(harvest)
     
    writer.insert_rows("encounter", source)
    harvest commit
}


/*

    Copy cbc labs, pivoting to make them relational

*/
def copyCbc = {

    val cbcvalues = """SELECT DISTINCT obs.person_id,
	                                   obs.encounter_id,
                                       obs.concept_id,
                                       cname.name,
                                       obs.value_numeric
                                FROM   obs
                       LEFT OUTER JOIN (concept_name cname) on (obs.concept_id = cname.concept_id)
		                          JOIN (concept_numeric cnum) on (obs.concept_id = cnum.concept_id)
                                 WHERE obs.concept_id IN ('21',
                                                          '678',
					                                   	  '679',
						                                  '729',
						                                  '851',
						                                  '1015',
						                                  '1016',
					                                      '1017',
						                                  '1018')
                                   AND (cname.concept_name_type = 'SHORT' OR 
                                         (cname.name = 'PLATELETS' AND cname.concept_name_type ='FULLY_SPECIFIED'))
                                   AND cname.voided = 0
                              ORDER BY encounter_id"""
    val writer = SqlTableWriter(harvest)

    //Need to pivot the data to fit into the new Harvest schema, approach below leads to last row
    //getting kicked back which needs to be inserted outside the fold left
    val lastRow = DataTable(openmrs,cbcvalues).foldLeft(Map[String,Any]()){(r,c) =>
                    if (r.isEmpty) {
                          Map[String,Any]() + ("encounter_id" -> c.encounter_id.as[Int].get,
                                                           c.name.as[String].get -> c.value_numeric.as[Double].get)
                    }
                    else if (c.encounter_id.as[Int].get == r.get("encounter_id").get) {
                         r + (c.name.as[String].get -> c.value_numeric.as[Double].get)
                    }
                    else   {
                        //println(r) //commit goes here eventually
                        val names = r.toSeq.map{(_._1.toLowerCase)}
                        val values = r.toSeq.map{(_._2)}
                        val dr = DataRow(names)(values.map{Option(_)})
                        writer.insert_row("cbc_result", dr)
                        Map[String,Any]("encounter_id" -> c.encounter_id.as[Int].get)
                    }
    }

    val names = lastRow.toSeq.map{(_._1.toLowerCase)}
    val values = lastRow.toSeq.map{(_._2)}
    val dr = DataRow(names)(values.map{Option(_)})
    writer.insert_row("cbc_result", dr)
    harvest commit
}



/* Here is where we actually call each component */

copyPerson
copyEncounter
copyCbc

/* Utility functions */

def schemaName(backend: SqlBackend) = {

   Option(backend.connectionProperties.get("schema").toString)
}
