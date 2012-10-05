from django.db import models


class Vaccine(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta(object):
        db_table = 'vaccine'


class VaccineSynonym(models.Model):
    name = models.CharField(max_length=100)
    vaccine = models.ForeignKey(Vaccine)

    class Meta(object):
        db_table = 'vaccine_synonym'
