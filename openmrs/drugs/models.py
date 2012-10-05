from django.db import models


class Drug(models.Model):
    name = models.CharField(max_length=100, unique=True)
    disease = models.CharField(max_length=100, null=True)

    class Meta(object):
        db_table = 'drug'


class DrugSynonym(models.Model):
    name = models.CharField(max_length=100)
    drug = models.ForeignKey(Drug)

    class Meta(object):
        db_table = 'drug_synonym'
