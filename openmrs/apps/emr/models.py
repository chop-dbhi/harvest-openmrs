from django.db import models


class Patient(models.Model):
    gender = models.CharField(max_length=50, blank=True, null=True)
    birthdate = models.DateField(null=True, blank=True)
    birthdate_estimated = models.NullBooleanField('birthdate estimated?', blank=True)

    class Meta(object):
        db_table = u'patient'


class Encounter(models.Model):
    patient = models.ForeignKey(Patient)
    encounter_datetime = models.DateTimeField(null=True, blank=True)
    description = models.TextField(blank=True)

    class Meta(object):
        db_table = u'encounter'


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
        db_table = u'lab_result'
