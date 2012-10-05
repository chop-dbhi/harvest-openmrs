/*
    This script uses the DataExpress ETL scripting environment to transform data from the 
    OpenMRS demo data set into the schema for the Harvest demo project.

    This script requires DataExpress 0.9.0.1 to work properly

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
    Person table
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
    Encounters, denormalizing a bit for convenience
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
    Vital Signs
*/

def copyVitalSigns = {
    val conceptNames = List("SBP", "DBP","HR", "TEMP (C)", "WT", "HT", "RR", "HC").map{Option(_)}
    val vitalSigns = numericConceptQuery(conceptNames)
    val columnOverride = Map("TEMP (C)" -> "temp")
    pivotNumericObservation(DataTable(openmrs, vitalSigns, conceptNames), harvest, "vital_signs", columnOverride)
    harvest commit
}

/*
    Labs from cbc, chem7, and other miscellaneous tests
*/

def copyLabs = {
    val cbc = List("HGB", "WBC", "RBC", "PLATELETS", "MCV", "HCT", "RDW", "MCHC", "MCH")
    val chem7 = List("CR", "BUN", "GLU", "NA", "K", "CL", "CO2")
    val other = List("CD4", "CD4 PERCENT", "CD8", "SGPT", "ALC")

    val conceptNames = (cbc ::: chem7 ::: other).map{Option(_)}

    //Needed since the method we're using assumes the concept names will be the column names by default
    val columnOverride = Map("TEMP (C)" -> "temp", "CD4 PERCENT" -> "cd4_percent")

    val allLabs = numericConceptQuery(conceptNames)
    pivotNumericObservation(DataTable(openmrs, allLabs, conceptNames), harvest, "lab_result", columnOverride)

    harvest commit
}

/* 
    Review of systems
*/

def copySystemReview = {
    val systems = List("HEENT EXAM FINDINGS", "CHEST EXAM FINDINGS", "CARDIAC EXAM FINDINGS",
                       "ABDOMINAL EXAM FINDINGS", "MUSCULOSKELETAL EXAM FINDINGS",
                       "NEUROLOGIC EXAM FINDINGS").map{Option(_)}
    val columnOverride = Map("HEENT EXAM FINDINGS" -> "heent", 
                             "CHEST EXAM FINDINGS" -> "chest", 
                             "CARDIAC EXAM FINDINGS" -> "cardiac",
                             "ABDOMINAL EXAM FINDINGS" -> "abdominal",
                             "MUSCULOSKELETAL EXAM FINDINGS" -> "musculoskeletal",
                             "NEUROLOGIC EXAM FINDINGS" -> "neurologic")

    val allSystems = codedConceptQuery(systems)
    
    pivotCodedObservation(DataTable(openmrs, allSystems, systems), harvest, "systems_review", columnOverride)

    harvest commit
}
/*
    Drugs
*/

 def copyDrugs = {
       val canonicalDrugs = """
             SELECT DISTINCT cn.name AS name, 'HIV' AS disease
                FROM obs, concept_name cn
               WHERE obs.concept_id = 1088
                 AND cn.concept_id = obs.value_coded
                 AND concept_name_type = 'FULLY_SPECIFIED'
                 AND cn.name <>'NONE'
            UNION ALL
            SELECT DISTINCT cn.name AS name, 'Tuberculosis' AS disease 
                FROM obs, concept_name cn
               WHERE obs.concept_id IN (1111, 1110)
                 AND cn.concept_id = obs.value_coded
                 AND concept_name_type = 'FULLY_SPECIFIED'
                 AND cn.name <>'NONE'
            UNION ALL
            SELECT DISTINCT cn.name AS name, 'Cryptococcus' AS disease 
                FROM obs, concept_name cn
               WHERE obs.concept_id = 1112
                 AND cn.concept_id = obs.value_coded
                 AND concept_name_type = 'FULLY_SPECIFIED'
                 AND cn.name <>'NONE'
            UNION ALL
            SELECT DISTINCT cn.name AS name, 'Pneumocystis pneumonia' AS disease 
                FROM obs, concept_name cn
               WHERE obs.concept_id = 1109
                 AND cn.concept_id = obs.value_coded
                 AND concept_name_type = 'FULLY_SPECIFIED'
                 AND cn.name <>'NONE'""" 

    val source = DataTable(openmrs,canonicalDrugs)
    val writer = SqlTableWriter(harvest)
     
    writer.insert_rows("drug", source)
    harvest commit

    val loadedDrugs = """SELECT name, id FROM drug"""
    val drugMap = DataTable(harvest, loadedDrugs).foldLeft(Map[String,Int]())((r,c) => r + (c.name.as[String].get -> c.id.as[Int].get))

    val drugAlias = """SELECT DISTINCT cn1.name as name, cn2.name as alias
                         FROM obs
                         JOIN (concept_name cn1) ON (obs.value_coded = cn1.concept_id)
                         JOIN (concept_name cn2) ON (cn1.concept_id = cn2.concept_id)
                        WHERE obs.concept_id IN (1088, 1111, 1112, 1110, 1109)
                          AND cn2.concept_name_type = 'FULLY_SPECIFIED'
                          AND cn1.name <>'NONE'""" 

    DataTable(openmrs, drugAlias).foreach{row =>
        val dr = DataRow("name" -> row.name.as[String].get,
                         "drug_id" -> drugMap.get(row.alias.as[String].get).get)
        writer.insert_row("drug_synonym", dr)
    }
    harvest commit
 }



/* Here is where we actually call each component */

//copyPerson
//copyEncounter
//copyVitalSigns
//copyLabs
//copySystemReview
copyDrugs


/* Utility functions */

def pivotCodedObservation(dataTable: DataTable[Any], target: SqlBackend, tableName: String,
    columnOverride:Map[String,String] = Map.empty[String,String]) = {
   val writer = SqlTableWriter(target)
   val lastRow = dataTable.foldLeft(Map[String,Any]()){ (r,c) =>
                    val currentEncounter = c.encounter_id.as[Int].get
                    val currentConceptName = c.name.as[String].get
                    val currentConceptValue =  c.coded_value.as[String].get
                                        
                    if (r.isEmpty) {
                          Map[String,Any]() + ("encounter_id" -> currentEncounter,
                                               columnOverride.getOrElse(currentConceptName, currentConceptName) -> currentConceptValue)
                    }
                    else if (currentEncounter == r.get("encounter_id").get) {
                         r + (columnOverride.getOrElse(currentConceptName, currentConceptName) -> currentConceptValue)
                    }
                    else   {
                        val names = r.toSeq.map{(_._1.toLowerCase)}
                        val values = r.toSeq.map{(_._2)}
                        val dr = DataRow(names)(values.map{Option(_)})
                        writer.insert_row(tableName, dr)
                        Map[String,Any]("encounter_id" -> currentEncounter)
                    }
    }

    val names = lastRow.toSeq.map{(_._1.toLowerCase)}
    val values = lastRow.toSeq.map{(_._2)}
    val dr = DataRow(names)(values.map{Option(_)})
    writer.insert_row(tableName, dr)
}


def pivotNumericObservation(dataTable: DataTable[Any], target: SqlBackend, tableName: String,
    columnOverride:Map[String,String] = Map.empty[String,String]) = {
   val writer = SqlTableWriter(target)

   val lastRow = dataTable.foldLeft(Map[String,Any]()){ (r,c) =>
                    val currentEncounter = c.encounter_id.as[Int].get
                    val currentConceptName = c.name.as[String].get
                    val currentConceptValue =  c.value_numeric.as[Double].get

                    if (r.isEmpty) {
                          Map[String,Any]() + ("encounter_id" -> currentEncounter,
                                               columnOverride.getOrElse(currentConceptName, currentConceptName) -> currentConceptValue)
                    }
                    else if (currentEncounter == r.get("encounter_id").get) {
                         r + (columnOverride.getOrElse(currentConceptName, currentConceptName) -> currentConceptValue)
                    }
                    else   {
                        val names = r.toSeq.map{(_._1.toLowerCase)}
                        val values = r.toSeq.map{(_._2)}
                        val dr = DataRow(names)(values.map{Option(_)})
                        writer.insert_row(tableName, dr)
                        Map[String,Any]("encounter_id" -> currentEncounter)
                    }
    }

    val names = lastRow.toSeq.map{(_._1.toLowerCase)}
    val values = lastRow.toSeq.map{(_._2)}
    val dr = DataRow(names)(values.map{Option(_)})
    writer.insert_row(tableName, dr)
}


def numericConceptQuery(conceptNames:List[Option[String]]) = {
    val query = """SELECT DISTINCT obs.person_id,
	                                   obs.encounter_id,
                                       obs.concept_id,
                                       cname.name,
                                       obs.value_numeric
                                FROM   obs
                       LEFT OUTER JOIN (concept_name cname) on (obs.concept_id = cname.concept_id)
		                          JOIN (concept_numeric cnum) on (obs.concept_id = cnum.concept_id)
                                 WHERE cname.name IN (%s)
                                   AND cname.voided = 0
                              ORDER BY encounter_id"""

   query.format(List.fill(conceptNames.size)("?").mkString(","))
}

def codedConceptQuery(conceptNames:List[Option[String]]) = {
    
    val query = """SELECT DISTINCT obs.person_id,
                                   obs.encounter_id,
                                       obs.concept_id,
                                       cname.name,
									   cname2.name as coded_value
                                FROM   obs
                       LEFT OUTER JOIN (concept_name cname) on (obs.concept_id = cname.concept_id)
                                  JOIN (concept_name cname2) on (obs.value_coded = cname2.concept_id)
                                 WHERE cname.name IN (%s)
                                   AND cname.voided = 0
								   AND cname2.voided = 0
                              ORDER BY encounter_id """

   query.format(List.fill(conceptNames.size)("?").mkString(","))
}

def schemaName(backend: SqlBackend) = {

   Option(backend.connectionProperties.get("schema").toString)
}
