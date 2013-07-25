# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import DataMigration
from django.db import models

class Migration(DataMigration):

    def forwards(self, orm):
        "Write your forwards methods here."
        for patient in orm.Patient.objects.all():
            patient.mrn = 'MRN' + str(patient.pk).zfill(6)
            patient.save()

    def backwards(self, orm):
        "Write your backwards methods here."
        orm.Patient.objects.update(mrn=None)

    models = {
        u'diagnoses.diagnosis': {
            'Meta': {'object_name': 'Diagnosis', 'db_table': "'diagnosis'"},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '200'})
        },
        u'drugs.drug': {
            'Meta': {'object_name': 'Drug', 'db_table': "'drug'"},
            'disease': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '100'})
        },
        u'openmrs.encounter': {
            'Meta': {'object_name': 'Encounter', 'db_table': "'encounter'"},
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'diagnoses': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['diagnoses.Diagnosis']", 'db_table': "'encounter_diagnosis'", 'symmetrical': 'False'}),
            'drugs': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['drugs.Drug']", 'db_table': "'encounter_drug'", 'symmetrical': 'False'}),
            'encounter_datetime': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'patient': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['openmrs.Patient']"}),
            'referrals': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['openmrs.Referral']", 'db_table': "'encounter_referral'", 'symmetrical': 'False'}),
            'vaccines': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['vaccines.Vaccine']", 'through': u"orm['openmrs.EncounterVaccine']", 'symmetrical': 'False'})
        },
        u'openmrs.encountervaccine': {
            'Meta': {'object_name': 'EncounterVaccine', 'db_table': "'encounter_vaccine'"},
            'encounter': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['openmrs.Encounter']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'status': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True'}),
            'vaccine': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['vaccines.Vaccine']"})
        },
        u'openmrs.hivdetails': {
            'Meta': {'object_name': 'HIVDetails', 'db_table': "'hiv_details'"},
            'cdc_category': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True'}),
            'discordant_couple': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True'}),
            'encounter': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['openmrs.Encounter']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'plan': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True'}),
            'stage_adult': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True'}),
            'stage_adult_last': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True'}),
            'stage_peds': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True'}),
            'taking_antiretrovirals': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True'}),
            'treat_adhere': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True'})
        },
        u'openmrs.labresult': {
            'Meta': {'object_name': 'LabResult', 'db_table': "'lab_result'"},
            'alc': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'bun': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'cd4': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'cd4_percent': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'cd8': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'cl': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'co2': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'cr': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'encounter': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['openmrs.Encounter']"}),
            'glu': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'hct': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'hgb': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'k': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'mch': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'mchc': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'mcv': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'na': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'platelets': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'rbc': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'rdw': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'sgpt': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'wbc': ('django.db.models.fields.FloatField', [], {'null': 'True'})
        },
        u'openmrs.patient': {
            'Meta': {'object_name': 'Patient', 'db_table': "'patient'"},
            'birthdate': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'birthdate_estimated': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'gender': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'mrn': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True'})
        },
        u'openmrs.pcpdetails': {
            'Meta': {'object_name': 'PCPDetails', 'db_table': "'pcp_details'"},
            'encounter': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['openmrs.Encounter']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'plan': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True'}),
            'pro_adhere': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True'})
        },
        u'openmrs.referral': {
            'Meta': {'object_name': 'Referral', 'db_table': "'referral'"},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        u'openmrs.systemsreview': {
            'Meta': {'object_name': 'SystemsReview', 'db_table': "'systems_review'"},
            'abdominal': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True'}),
            'cardiac': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True'}),
            'chest': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True'}),
            'encounter': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['openmrs.Encounter']"}),
            'heent': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'musculoskeletal': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True'}),
            'neurologic': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True'})
        },
        u'openmrs.tbdetails': {
            'Meta': {'object_name': 'TBDetails', 'db_table': "'tb_details'"},
            'encounter': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['openmrs.Encounter']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'pro_adhere': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True'}),
            'pro_plan': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True'}),
            'treat_adhere': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True'}),
            'treat_plan': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True'})
        },
        u'vaccines.vaccine': {
            'Meta': {'object_name': 'Vaccine', 'db_table': "'vaccine'"},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '100'})
        }
    }

    complete_apps = ['openmrs']
    symmetrical = True
