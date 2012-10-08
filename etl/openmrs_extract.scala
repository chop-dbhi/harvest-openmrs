/*  
    Harvest OpenMRS Demo Data ETL Script version 1.0
    

    --- Background ---

    This script uses the DataExpress ETL scripting environment to transform data from the 
    OpenMRS demo data set into the schema for the Harvest demo project. OpenMRS is an 
    open source medical record system designed to support delivery of health care in 
    resource constrained environments. For more information visit http://openmrs.org/
   
    PLEASE NOTE: OpenMRS is an independent software package and organization, not affiliated with
    The Children's Hospital of Philadelphia or the Harvest project

   
    This script assumes that all the tables have been created. It is designed to work against the "large"
    demo data set available in 
    
    https://wiki.openmrs.org/download/attachments/5047323/large-demo-data-1.8.0.sql.zip
    
    --- Requirements ---
    -DataExpress 0.9.0.1
    -Scala 2.9.1 or higher
    -harvestdb.properties & openmrsdb.properties files with 
     connection info for each database (see DataExpress documentation for more info)

    --- Running --- 
    scala -cp "path_to_dataexpress_with_dependencies_jar" -Xexperimental openmrs_extract.scala 

    This script requires the DataExpress.jar to be on your java classpath for more info
    on the DataExpress ETL environment see http://dataexpress.research.chop.edu

    --- Copyright & License ---
    Copyright (c) 2012, The Children's Hospital of Philadelphia All rights reserved.

    Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
    following conditions are met:

    1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following
       disclaimer.

    2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
       following disclaimer in the documentation and/or other materials provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
    INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
    SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
    SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
    WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
    USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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


/* Here is where we actually call each method that processes data */

copyPerson
copyEncounter
copyVitalSigns
copyLabs
copySystemReview
copyDrugs
copyDrugEncounter
copyVaccines
copyVaccineEncounter
copyDiagnoses
copyDiagnosisEncounter
copyReferrals
copyReferralEncounter
copyHIVDetails
copyTBDetails
copyPCPDetails


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

    //Need to cast the last column to a boolean data type, inserting as we go
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

    //Can copy the entire encounter table wholesale as we are re-using existing primary keys
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
    //This is the list of concepts that will become columns during the pivot 
    val conceptNames = List("SBP", "DBP","HR", "TEMP (C)", "WT", "HT", "RR", "HC").map{Option(_)}

    //Preps the query with placeholders for the concepts
    val vitalSigns = numericConceptQuery(conceptNames)

    //Need to override the names for each entity from the DB to the actual column names we use in harvest
    val columnOverride = Map("TEMP (C)" -> "temp")
    
    //Utility method to read data from the source query (vitalSigns) and copy to the new table (vital_signs)
    pivotNumericObservation(DataTable(openmrs, vitalSigns, conceptNames), harvest, "vital_signs", columnOverride)
    harvest commit
}

/*
    Labs from cbc, chem7, and other miscellaneous tests
*/

def copyLabs = {
    //This is the list of concepts that will become columns during the pivot, broken out for readability
    val cbc = List("HGB", "WBC", "RBC", "PLATELETS", "MCV", "HCT", "RDW", "MCHC", "MCH")
    val chem7 = List("CR", "BUN", "GLU", "NA", "K", "CL", "CO2")
    val other = List("CD4", "CD4 PERCENT", "CD8", "SGPT", "ALC")
    
    //Concatenate all labs into one list
    val conceptNames = (cbc ::: chem7 ::: other).map{Option(_)}

    //Need to override the names for each entity from the DB to the actual column names we use in harvest
    val columnOverride = Map("CD4 PERCENT" -> "cd4_percent")

    //Prep query with placeholders for the actual concepts
    val allLabs = numericConceptQuery(conceptNames)

    //Utility method to read data from the source query (allLabs) and copy to the new table (lab_result)
    pivotNumericObservation(DataTable(openmrs, allLabs, conceptNames), harvest, "lab_result", columnOverride)

    harvest commit
}

/* 
    Review of systems
*/

def copySystemReview = {
    //This is the list of concepts that will become columns during the pivot 
    val systems = List("HEENT EXAM FINDINGS", "CHEST EXAM FINDINGS", "CARDIAC EXAM FINDINGS",
                       "ABDOMINAL EXAM FINDINGS", "MUSCULOSKELETAL EXAM FINDINGS",
                       "NEUROLOGIC EXAM FINDINGS").map{Option(_)}
    
    //Need to override the names for each entity from the DB to the actual column names we use in harvest
    val columnOverride = Map("HEENT EXAM FINDINGS" -> "heent", 
                             "CHEST EXAM FINDINGS" -> "chest", 
                             "CARDIAC EXAM FINDINGS" -> "cardiac",
                             "ABDOMINAL EXAM FINDINGS" -> "abdominal",
                             "MUSCULOSKELETAL EXAM FINDINGS" -> "musculoskeletal",
                             "NEUROLOGIC EXAM FINDINGS" -> "neurologic")
    
    //Prep query with placeholders for the actual concepts
    val allSystems = codedConceptQuery(systems)
    
    //Utility method to read data from the source query (allSystems) and copy to the new table (systems_review)
    pivotCodedObservation(DataTable(openmrs, allSystems, systems), harvest, "systems_review", columnOverride)

    harvest commit
}


/*
    Drugs
*/

 def copyDrugs = {
       //This query batches up all the drugs and puts them with the primary indication
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

    //Data comes out of the database structured for harvest, so no need for a pivot before insert 
    writer.insert_rows("drug", source)
    harvest commit

    //Need to get back the primary keys on all drugs loaded so we can map aliases to them
    val loadedDrugs = """SELECT name, id FROM drug"""
    val drugMap = DataTable(harvest, loadedDrugs).foldLeft(Map[String,Int]())((r,c) => r + (c.name.as[String].get -> c.id.as[Int].get))

    //Pull all canonical and alias names for drugs from OpenMRS, with the canonical name as a column
    //We use the canonical name as a key to get the ID out of the Map created above
    val drugAlias = """SELECT DISTINCT cn1.name as name, cn2.name as alias
                         FROM obs
                         JOIN (concept_name cn1) ON (obs.value_coded = cn1.concept_id)
                         JOIN (concept_name cn2) ON (cn1.concept_id = cn2.concept_id)
                        WHERE obs.concept_id IN (1088, 1111, 1112, 1110, 1109)
                          AND cn2.concept_name_type = 'FULLY_SPECIFIED'
                          AND cn1.name <>'NONE'""" 

    //Insert the aliases, mapping to the canonical ID along the way
    DataTable(openmrs, drugAlias).foreach{row =>
        val dr = DataRow("name" -> row.name.as[String].get,
                         "drug_id" -> drugMap.get(row.alias.as[String].get).get)
        writer.insert_row("drug_synonym", dr)
    }
    harvest commit
 }



/* 
    Drugs associated with encounters
*/
def copyDrugEncounter = {
    //As above, we need to create a map to easily look up drugs and map them to our ID's
    val loadedDrugs = """SELECT name, id FROM drug"""
    val drugMap = DataTable(harvest, loadedDrugs).foldLeft(Map[String,Int]())((r,c) => r + (c.name.as[String].get -> c.id.as[Int].get))

    //Select all the drugs associated with encounters
    val encounterDrug = """SELECT DISTINCT obs.encounter_id, cn.name AS drug_name
                                 FROM obs, concept_name cn
                                WHERE obs.concept_id IN (1088, 1111, 1110, 1112, 1109)
                                  AND cn.concept_id = obs.value_coded
                                  AND concept_name_type = 'FULLY_SPECIFIED'
                                  AND cn.name <>'NONE' """
   val writer = SqlTableWriter(harvest)
   
   //Insert the relationship between enocunter and drug into harvest tables, mapping drug names to our ID's as we go
   DataTable(openmrs, encounterDrug).foreach{row =>
                val dr = DataRow("encounter_id" -> row.encounter_id.as[Int].get,
                                 "drug_id" -> drugMap.get(row.drug_name.as[String].get).get)
                writer.insert_row("encounter_drug", dr)

    }
   harvest commit 
}

/* 
    Vaccines
*/

def copyVaccines = {
    //get the canonical names for all vaccines
    def canonicalVaccines = """SELECT DISTINCT cn.name 
	                                      FROM obs, concept_name cn
                                         WHERE obs.concept_id IN (1198, 984)
                                           AND cn.concept_id = obs.value_coded
                                           AND concept_name_type = 'FULLY_SPECIFIED'
                                           AND cn.name <> 'NONE'"""
    val source = DataTable(openmrs,canonicalVaccines)
    val writer = SqlTableWriter(harvest)
     
    //Load the vaccine names into harvest
    writer.insert_rows("vaccine", source)
    harvest commit

    //Pull all canonical and alias names for vaccines from OpenMRS, with the canonical name as a column
    //We use the canonical name as a key to get the ID out of the Map created below
    //Note that we're intentionally excluding some aliases here that really don't help with search (our primary reason for inlcuding them)
    def vaccineAlias = """SELECT DISTINCT cn1.name as name, cn2.name as alias
                                     FROM obs
                                     JOIN (concept_name cn1) ON (obs.value_coded = cn1.concept_id)
                                     JOIN (concept_name cn2) ON (cn1.concept_id = cn2.concept_id)
                                    WHERE obs.concept_id = 6042
                                      AND cn2.concept_name_type = 'FULLY_SPECIFIED'
                                      AND cn1.name <>'NONE' """

    //Need to get back the primary keys on all drugs loaded so we can map aliases to them
    val loadedVaccines = """SELECT name, id FROM vaccine"""
    val vaccineMap = DataTable(harvest, loadedVaccines).foldLeft(Map[String,Int]())((r,c) => r + (c.name.as[String].get -> c.id.as[Int].get))
    
   //Insert the aliases, mapping to the canonical ID along the way
   DataTable(openmrs, vaccineAlias).foreach{row =>
        val dr = DataRow("name" -> row.name.as[String].get,
                         "vaccine_id" -> vaccineMap.get(row.alias.as[String].get).get)
        writer.insert_row("vaccine_synonym", dr)
   }      
   
   harvest commit

}


/* 
    Vaccine-encounter relationship
*/

def copyVaccineEncounter = {
    //As above, we need to create a map to easily look up vaccines and map them to our ID's
    val loadedVaccines = """SELECT name, id FROM vaccine"""
    val vaccineMap = DataTable(harvest, loadedVaccines).foldLeft(Map[String,Int]())((r,c) => r + (c.name.as[String].get -> c.id.as[Int].get))
    
    //Map encounters to vaccines, note the for simplicity we are combining previously administered vaccines and vaccines administered at the encounter 
    //They are delineated by the "status" column
    val encounterVaccine = """SELECT DISTINCT obs.encounter_id, cn.name AS vaccine_name, cn2.name AS status
                                 FROM obs
                                 JOIN (concept_name cn) ON (cn.concept_id = obs.value_coded)
                                 JOIN (concept_name cn2) ON (cn2.concept_id = obs.concept_id)
                                WHERE obs.concept_id IN (1198, 984)
                                  AND cn.concept_name_type = 'FULLY_SPECIFIED'
                                  AND cn2.concept_name_type = 'FULLY_SPECIFIED'
                                  AND cn.name <>'NONE'"""
    val writer = SqlTableWriter(harvest)
  
    //Insert the relationship between enocunter and vaccine into harvest tables, mapping vaccine names to our ID's as we go
    DataTable(openmrs, encounterVaccine).foreach{row =>
                val dr = DataRow("encounter_id" -> row.encounter_id.as[Int].get,
                                 "vaccine_id" -> vaccineMap.get(row.vaccine_name.as[String].get).get,
                                 "status" -> row.status.as[String].get)
                writer.insert_row("encounter_vaccine", dr)
    }
   
   harvest commit 

}

/*
    Diagnoses
*/

def copyDiagnoses = {
    //get the canonical names for all diagnoses
    val canonicalDiagnoses = """SELECT DISTINCT cn.name 
	                                       FROM obs, concept_name cn
                                          WHERE obs.concept_id = 6042
                                            AND cn.concept_id = obs.value_coded
                                            AND concept_name_type = 'FULLY_SPECIFIED'"""

    val source = DataTable(openmrs,canonicalDiagnoses)
    val writer = SqlTableWriter(harvest)
     
    writer.insert_rows("diagnosis", source)
    harvest commit
    
    //Pull all canonical and alias names for diagnoses from OpenMRS, with the canonical name as a column
    //We use the canonical name as a key to get the ID out of the Map created below
    //Note that we're intentionally excluding some aliases here that really don't help with search (our primary reason for inlcuding them)
    def diagnosisAlias = """SELECT DISTINCT cn1.concept_id, cn1.name as name, cn2.name as alias
                                     FROM obs
                                     JOIN (concept_name cn1) ON (obs.value_coded = cn1.concept_id)
                                     JOIN (concept_name cn2) ON (cn1.concept_id = cn2.concept_id)
                                    WHERE obs.concept_id = 6042
                                      AND cn2.concept_name_type = 'FULLY_SPECIFIED'
                                      AND cn1.name <>'NONE'
									  AND cn1.name not IN ('FUNTIME', 'CLINICAL', 'PRESUMED')"""
   //Need to get back the primary keys on all drugs loaded so we can map aliases to them
   val loadedDiagnoses = """SELECT name, id FROM diagnosis"""
   val diagnosisMap = DataTable(harvest, loadedDiagnoses).foldLeft(Map[String,Int]())((r,c) => r + (c.name.as[String].get -> c.id.as[Int].get))

  //Insert the aliases, mapping to the canonical ID along the way
  DataTable(openmrs, diagnosisAlias).foreach{row =>
      val dr = DataRow("name" -> row.name.as[String].get,
                       "diagnosis_id" -> diagnosisMap.get(row.alias.as[String].get).get)
      writer.insert_row("diagnosis_synonym", dr)
    }      
   
   harvest commit
}

/*
    Diagnosis Encounter

*/

def copyDiagnosisEncounter = {
    //As above, we need to create a map to easily look up diagnoses and map them to our ID's
    val loadedDiagnoses = """SELECT name, id FROM diagnosis"""
    val diagMap = DataTable(harvest, loadedDiagnoses).foldLeft(Map[String,Int]())((r,c) => r + (c.name.as[String].get -> c.id.as[Int].get))

    //Map encounters to diagnoses
    val encounterDiagnosis = """SELECT DISTINCT obs.encounter_id, cn.name AS diagnosis_name
                                 FROM obs, concept_name cn
                                WHERE obs.concept_id = 6042
                                  AND cn.concept_id = obs.value_coded
                                  AND concept_name_type = 'FULLY_SPECIFIED'
                                  AND cn.name <>'NONE' """
   val writer = SqlTableWriter(harvest)
   
   //Insert the relationship between enocunter and diagnosis into harvest tables, mapping diagnosis names to our ID's as we go 
   DataTable(openmrs, encounterDiagnosis).foreach{row =>
                val dr = DataRow("encounter_id" -> row.encounter_id.as[Int].get,
                                 "diagnosis_id" -> diagMap.get(row.diagnosis_name.as[String].get).get)
                writer.insert_row("encounter_diagnosis", dr)

    }
   harvest commit 
}

/*
    Referral

*/

def copyReferrals = {
    //Copy the list of referrals to harvest, these are simpler since this vocabulary doesn't have aliases
    val referrals = """SELECT DISTINCT name 
	       FROM obs, concept_name cn
          WHERE obs.concept_id = 1272
            AND cn.concept_id = obs.value_coded
			AND cn.name <> 'NONE'"""

    val source = DataTable(openmrs,referrals)
    val writer = SqlTableWriter(harvest)
    
    //Insert the result of the query directly, with no modifications
    writer.insert_rows("referral", source)
    harvest commit
}

/*
     Referral Encounter

*/

def copyReferralEncounter = {
    //As above, we need to create a map to easily look up referrals and map them to our ID's
    val loadedReferrals = """SELECT name, id FROM referral"""
    val referralMap = DataTable(harvest, loadedReferrals).foldLeft(Map[String,Int]())((r,c) => r + (c.name.as[String].get -> c.id.as[Int].get))

    //Map encounters to referrals
    val encounterReferral = """SELECT DISTINCT obs.encounter_id, cn.name AS referral_name
                                 FROM obs, concept_name cn
                                WHERE obs.concept_id = 1272
                                  AND cn.concept_id = obs.value_coded
                                  AND cn.name <>'NONE' """
   val writer = SqlTableWriter(harvest)
 
 //Insert the relationship between enocunter and referral into harvest tables, mapping diagnosis names to our ID's as we go  
   DataTable(openmrs, encounterReferral).foreach{row =>
                val dr = DataRow("encounter_id" -> row.encounter_id.as[Int].get,
                                 "referral_id" -> referralMap.get(row.referral_name.as[String].get).get)
                writer.insert_row("encounter_referral", dr)

    }
   harvest commit  
}

/*

    HIV Details

*/

def copyHIVDetails = {
     //This is the list of concepts that will become columns during the pivot 
    val conceptNames = List("ANTIRETROVIRAL ADHERENCE IN PAST WEEK",
                            "ANTIRETROVIRAL USE",
                            "PEDS CDC CATEGORY QUERY",
                            "PEDS WHO CATEGORY QUERY",
                            "NEW WHO/CDC STAGING CRITERIA MET",
                            "ANTIRETROVIRAL PLAN",
                            "CURRENT WHO HIV STAGE",
                            "DISCORDANT COUPLE").map{Option(_)}

    //Needed since the method we're using assumes the concept names will be the column names by default
    val columnOverride = Map("ANTIRETROVIRAL ADHERENCE IN PAST WEEK" -> "treat_adhere",
                            "ANTIRETROVIRAL USE" -> "taking_antiretrovirals",
                            "PEDS CDC CATEGORY QUERY" -> "cdc_category",
                            "PEDS WHO CATEGORY QUERY" -> "stage_peds",
                            "NEW WHO/CDC STAGING CRITERIA MET" -> "stage_adult_last",
                            "ANTIRETROVIRAL PLAN" -> "plan",
                            "CURRENT WHO HIV STAGE" -> "stage_adult",
                            "DISCORDANT COUPLE" -> "discordant_couple")

    val allConcepts = codedConceptQuery(conceptNames)
    pivotCodedObservation(DataTable(openmrs, allConcepts, conceptNames), harvest, "hiv_details", columnOverride)

    harvest commit


}

def copyTBDetails = {
     //This is the list of concepts that will become columns during the pivot 
    val conceptNames = List("TUBERCULOSIS PROPHYLAXIS ADHERENCE IN PAST WEEK",
                                "TUBERCULOSIS PROPHYLAXIS PLAN",
                                "TUBERCULOSIS TREATMENT PLAN",
                                "TUBERCULOSIS TREATMENT ADHERENCE IN PAST WEEK").map{Option(_)}

    //Needed since the method we're using assumes the concept names will be the column names by default
    val columnOverride = Map("TUBERCULOSIS PROPHYLAXIS ADHERENCE IN PAST WEEK" -> "pro_adhere",
                             "TUBERCULOSIS PROPHYLAXIS PLAN" -> "pro_plan",
                             "TUBERCULOSIS TREATMENT PLAN" -> "treat_plan",
                             "TUBERCULOSIS TREATMENT ADHERENCE IN PAST WEEK" -> "treat_adhere")
    val allConcepts = codedConceptQuery(conceptNames)
    pivotCodedObservation(DataTable(openmrs, allConcepts, conceptNames), harvest, "tb_details", columnOverride)

    harvest commit
}

def copyPCPDetails = {
     val conceptNames = List("PCP PROPHYLAXIS PLAN",
                             "PCP PROPHYLAXIS ADHERENCE IN PAST WEEK").map{Option(_)}
     
     
     //Needed since the method we're using assumes the concept names will be the column names by default
    val columnOverride = Map("PCP PROPHYLAXIS PLAN" -> "plan",
                             "PCP PROPHYLAXIS ADHERENCE IN PAST WEEK" -> "pro_adhere")
    val allConcepts = codedConceptQuery(conceptNames)
    pivotCodedObservation(DataTable(openmrs, allConcepts, conceptNames), harvest, "pcp_details", columnOverride)

    harvest commit

    
}




/* 

    Utility functions

*/

//Takes entity attribute value structured data and pivots to column-based representation
//This only works for coded (non-numerical) observations
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

//Takes entity attribute value structured data and pivots to column-based representation
//This only works for numerical observations
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

//Basic query to pull the data for a set of numeric concepts
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

//Basic query to pull the data for a set of numeric concepts
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
