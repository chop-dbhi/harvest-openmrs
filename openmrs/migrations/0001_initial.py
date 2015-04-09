# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    depends_on = (
        ("avocado", "0036_initialize_indexable"),
    )

    def forwards(self, orm):
        # Adding model 'Patient'
        db.create_table('patient', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('gender', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('birthdate', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('birthdate_estimated', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
        ))
        db.send_create_signal(u'openmrs', ['Patient'])

        # Adding model 'Referral'
        db.create_table('referral', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=200)),
        ))
        db.send_create_signal(u'openmrs', ['Referral'])

        # Adding model 'Encounter'
        db.create_table('encounter', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('patient', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['openmrs.Patient'])),
            ('encounter_datetime', self.gf('django.db.models.fields.DateTimeField')(null=True, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal(u'openmrs', ['Encounter'])

        # Adding M2M table for field drugs on 'Encounter'
        m2m_table_name = 'encounter_drug'
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('encounter', models.ForeignKey(orm[u'openmrs.encounter'], null=False)),
            ('drug', models.ForeignKey(orm[u'drugs.drug'], null=False))
        ))
        db.create_unique(m2m_table_name, ['encounter_id', 'drug_id'])

        # Adding M2M table for field diagnoses on 'Encounter'
        m2m_table_name = 'encounter_diagnosis'
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('encounter', models.ForeignKey(orm[u'openmrs.encounter'], null=False)),
            ('diagnosis', models.ForeignKey(orm[u'diagnoses.diagnosis'], null=False))
        ))
        db.create_unique(m2m_table_name, ['encounter_id', 'diagnosis_id'])

        # Adding M2M table for field referrals on 'Encounter'
        m2m_table_name = 'encounter_referral'
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('encounter', models.ForeignKey(orm[u'openmrs.encounter'], null=False)),
            ('referral', models.ForeignKey(orm[u'openmrs.referral'], null=False))
        ))
        db.create_unique(m2m_table_name, ['encounter_id', 'referral_id'])

        # Adding model 'EncounterVaccine'
        db.create_table('encounter_vaccine', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('encounter', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['openmrs.Encounter'])),
            ('vaccine', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['vaccines.Vaccine'])),
            ('status', self.gf('django.db.models.fields.CharField')(max_length=100, null=True)),
        ))
        db.send_create_signal(u'openmrs', ['EncounterVaccine'])

        # Adding model 'LabResult'
        db.create_table('lab_result', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('encounter', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['openmrs.Encounter'])),
            ('hgb', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('wbc', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('rbc', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('platelets', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('mcv', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('hct', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('rdw', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('mchc', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('mch', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('cr', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('bun', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('glu', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('na', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('k', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('cl', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('co2', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('cd4', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('cd4_percent', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('cd8', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('sgpt', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('alc', self.gf('django.db.models.fields.FloatField')(null=True)),
        ))
        db.send_create_signal(u'openmrs', ['LabResult'])

        # Adding model 'SystemsReview'
        db.create_table('systems_review', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('encounter', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['openmrs.Encounter'])),
            ('heent', self.gf('django.db.models.fields.CharField')(max_length=30, null=True)),
            ('chest', self.gf('django.db.models.fields.CharField')(max_length=30, null=True)),
            ('abdominal', self.gf('django.db.models.fields.CharField')(max_length=30, null=True)),
            ('cardiac', self.gf('django.db.models.fields.CharField')(max_length=30, null=True)),
            ('musculoskeletal', self.gf('django.db.models.fields.CharField')(max_length=30, null=True)),
            ('neurologic', self.gf('django.db.models.fields.CharField')(max_length=30, null=True)),
        ))
        db.send_create_signal(u'openmrs', ['SystemsReview'])

        # Adding model 'HIVDetails'
        db.create_table('hiv_details', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('encounter', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['openmrs.Encounter'])),
            ('plan', self.gf('django.db.models.fields.CharField')(max_length=30, null=True)),
            ('treat_adhere', self.gf('django.db.models.fields.CharField')(max_length=30, null=True)),
            ('stage_adult', self.gf('django.db.models.fields.CharField')(max_length=30, null=True)),
            ('stage_adult_last', self.gf('django.db.models.fields.CharField')(max_length=30, null=True)),
            ('stage_peds', self.gf('django.db.models.fields.CharField')(max_length=30, null=True)),
            ('cdc_category', self.gf('django.db.models.fields.CharField')(max_length=30, null=True)),
            ('taking_antiretrovirals', self.gf('django.db.models.fields.CharField')(max_length=10, null=True)),
            ('discordant_couple', self.gf('django.db.models.fields.CharField')(max_length=10, null=True)),
        ))
        db.send_create_signal(u'openmrs', ['HIVDetails'])

        # Adding model 'TBDetails'
        db.create_table('tb_details', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('encounter', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['openmrs.Encounter'])),
            ('treat_adhere', self.gf('django.db.models.fields.CharField')(max_length=30, null=True)),
            ('treat_plan', self.gf('django.db.models.fields.CharField')(max_length=30, null=True)),
            ('pro_adhere', self.gf('django.db.models.fields.CharField')(max_length=30, null=True)),
            ('pro_plan', self.gf('django.db.models.fields.CharField')(max_length=30, null=True)),
        ))
        db.send_create_signal(u'openmrs', ['TBDetails'])

        # Adding model 'PCPDetails'
        db.create_table('pcp_details', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('encounter', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['openmrs.Encounter'])),
            ('plan', self.gf('django.db.models.fields.CharField')(max_length=30, null=True)),
            ('pro_adhere', self.gf('django.db.models.fields.CharField')(max_length=30, null=True)),
        ))
        db.send_create_signal(u'openmrs', ['PCPDetails'])


    def backwards(self, orm):
        # Deleting model 'Patient'
        db.delete_table('patient')

        # Deleting model 'Referral'
        db.delete_table('referral')

        # Deleting model 'Encounter'
        db.delete_table('encounter')

        # Removing M2M table for field drugs on 'Encounter'
        db.delete_table('encounter_drug')

        # Removing M2M table for field diagnoses on 'Encounter'
        db.delete_table('encounter_diagnosis')

        # Removing M2M table for field referrals on 'Encounter'
        db.delete_table('encounter_referral')

        # Deleting model 'EncounterVaccine'
        db.delete_table('encounter_vaccine')

        # Deleting model 'LabResult'
        db.delete_table('lab_result')

        # Deleting model 'SystemsReview'
        db.delete_table('systems_review')

        # Deleting model 'HIVDetails'
        db.delete_table('hiv_details')

        # Deleting model 'TBDetails'
        db.delete_table('tb_details')

        # Deleting model 'PCPDetails'
        db.delete_table('pcp_details')


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
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
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
