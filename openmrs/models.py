from django.db import models
from .drugs.models import Drug
from .vaccines.models import Vaccine
from .diagnoses.models import Diagnosis


class Patient(models.Model):
    gender = models.CharField(max_length=50, blank=True, null=True)
    birthdate = models.DateField(null=True, blank=True)
    birthdate_estimated = models.NullBooleanField('birthdate estimated?', blank=True)
    mrn = models.CharField(max_length=10, null=True)

    class Meta(object):
        db_table = 'patient'


class Referral(models.Model):
    name = models.CharField(max_length=200)

    class Meta(object):
        db_table = 'referral'


class Encounter(models.Model):
    patient = models.ForeignKey(Patient)
    encounter_datetime = models.DateTimeField(null=True, blank=True)
    description = models.TextField(blank=True)

    drugs = models.ManyToManyField(Drug, db_table='encounter_drug')
    vaccines = models.ManyToManyField(Vaccine, through='EncounterVaccine')
    diagnoses = models.ManyToManyField(Diagnosis, db_table='encounter_diagnosis')
    referrals = models.ManyToManyField(Referral, db_table='encounter_referral')

    class Meta(object):
        db_table = 'encounter'


class EncounterVaccine(models.Model):
    encounter = models.ForeignKey(Encounter)
    vaccine = models.ForeignKey(Vaccine)
    status = models.CharField(max_length=100, null=True)

    class Meta(object):
        db_table = 'encounter_vaccine'


class LabResult(models.Model):
    encounter = models.ForeignKey(Encounter)

    # CBC panel
    hgb = models.FloatField('hemoglobin (HGB)', null=True)
    wbc = models.FloatField('white blood cells (WBC)', null=True)
    rbc = models.FloatField('red blood cells (RBC)', null=True)
    platelets = models.FloatField(null=True)
    mcv = models.FloatField('mean corpuscular volume (MCV)', null=True)
    hct = models.FloatField('hematocrit', null=True)
    rdw = models.FloatField('red cell distribution width (RDW)', null=True)
    mchc = models.FloatField('mean cell hemoglobin concentration (MCHC)', null=True)
    mch = models.FloatField('mean corpuscular hemoglobin (MCH)', null=True)

    # Chem7
    cr = models.FloatField('creatinine', null=True)
    bun = models.FloatField('blood urea nitrogen', null=True)
    glu = models.FloatField('glucose', null=True)
    na = models.FloatField('sodium', null=True)
    k = models.FloatField('potassium', null=True)
    cl = models.FloatField('chlorine', null=True)
    co2 = models.FloatField('carbon dioxide', null=True)

    cd4 = models.FloatField('CD4', null=True)
    cd4_percent = models.FloatField('CD4 %', null=True)
    cd8 = models.FloatField('CD8', null=True)
    sgpt = models.FloatField('SGPT', null=True)
    alc = models.FloatField('ALC', null=True)

    class Meta(object):
        db_table = 'lab_result'


class SystemsReview(models.Model):
    encounter = models.ForeignKey(Encounter)
    heent = models.CharField('head, eye, ear, neck, throat (HEENT) exam', max_length=30, null=True)
    chest = models.CharField('chest exam', max_length=30, null=True)
    abdominal = models.CharField('abdominal exam', max_length=30, null=True)
    cardiac = models.CharField('cardiac exam', max_length=30, null=True)
    musculoskeletal = models.CharField('musculoskeletal exam', max_length=30, null=True)
    neurologic = models.CharField('neurologic exam', max_length=30, null=True)

    class Meta(object):
        db_table = 'systems_review'


class HIVDetails(models.Model):
    encounter = models.ForeignKey(Encounter)
    plan = models.CharField(max_length=30, null=True)
    treat_adhere = models.CharField('treatment adherence last week', max_length=30, null=True)
    stage_adult = models.CharField('stage (adult)', max_length=30, null=True)
    stage_adult_last = models.CharField('stage change since last visit (adult)', max_length=30, null=True)
    stage_peds = models.CharField('stage (peds)', max_length=30, null=True)
    cdc_category = models.CharField('CDC category', max_length=30, null=True)
    taking_antiretrovirals = models.CharField('currently taking antiretrovial medications', max_length=10, null=True)
    discordant_couple = models.CharField(max_length=10, null=True)

    class Meta(object):
        db_table = 'hiv_details'
        verbose_name = 'hiv details'
        verbose_name_plural = verbose_name


class TBDetails(models.Model):
    encounter = models.ForeignKey(Encounter)
    treat_adhere = models.CharField('treatment adherence last week', max_length=30, null=True)
    treat_plan = models.CharField('treatment plan', max_length=30, null=True)
    pro_adhere = models.CharField('prophylaxis adherence last week', max_length=30, null=True)
    pro_plan = models.CharField('prophylaxis plan', max_length=30, null=True)

    class Meta(object):
        db_table = 'tb_details'
        verbose_name = 'tuberculosis details'
        verbose_name_plural = verbose_name


class PCPDetails(models.Model):
    encounter = models.ForeignKey(Encounter)
    plan = models.CharField(max_length=30, null=True)
    pro_adhere = models.CharField('prophylaxis adherence last week', max_length=30, null=True)

    class Meta(object):
        db_table = 'pcp_details'
        verbose_name = 'PCP details'
        verbose_name_plural = verbose_name
