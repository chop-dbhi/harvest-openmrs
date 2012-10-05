from django.db import models


class Diagnosis(models.Model):
    name = models.CharField(max_length=200, unique=True)

    class Meta(object):
        db_table = 'diagnosis'


class DiagnosisSynonym(models.Model):
    name = models.CharField(max_length=200)
    diagnosis = models.ForeignKey(Diagnosis)

    class Meta(object):
        db_table = 'diagnosis_synonym'
