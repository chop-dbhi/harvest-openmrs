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

//register store SqlDb("openmrsdb.properties") as "openmrs"
//register store SqlDb("harvestdb.properties") as "harvest"
val harvest = SqlBackendFactory("harvestdb.properties")
val openmrs = SqlBackendFactory("openmrsdb.properties")




/*
    Copy the person table

*/

def copyPerson = {
    val patients = """SELECT person_id as 'id',
                          gender,
	                      birthdate,
                          birthdate_estimated
                     FROM person"""
    
  
    val source = DataTable(openmrs,patients )
    val writer = SqlTableWriter(harvest, schemaName(harvest))
     
    writer.insert_rows("person", source)
    harvest commit

}

/*
    Copy the encounters, denormalizing a bit for convenience
*/




def copyEncounter = {
    val encounters = """SELECT e.encounter_id, 
                               e.patient_id, 
                        	   e.encounter_datetime,
                               encounter_type.description
                          FROM encounter e
               LEFT OUTER JOIN (encounter_type) ON (e.encounter_type = encounter_type.encounter_type_id)"""    
    
    val source = DataTable(openmrs,encounters)
    val writer = SqlTableWriter(harvest, schemaName(harvest))
     
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
                                         (cname.name = 'PLATELETS' ANDl cname.concept_name_type ='FULLY_SPECIFIED'))
                                   AND cname.voided = 0
                              ORDER BY encounter_id"""



}



/* Here is where we actually call each component */

copyPerson
copyEncounter


/* Utility functions */

def schemaName(backend: SqlBackend) = {

   Option(backend.connectionProperties.get("schema").toString)
}
