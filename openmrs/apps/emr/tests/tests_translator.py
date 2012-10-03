try:
    from collections import OrderedDict
except ImportError:
    from orderddict import OrderedDict
from datetime import date, timedelta
from django.test import TestCase
from django.core import management
from avocado.models import DataField, DataConcept, DataConceptField 
from avocado.query.translators import registry
from openmrs.apps.emr.models import Patient

class TranslatorTest(TestCase):
    
    def setUp(self):
        management.call_command('avocado', 'sync', 'emr')

        self.birthdate = DataField.objects.get_by_natural_key('emr', 'patient', 'birthdate')
        self.t = registry.get('Age')

    def test_trans_years(self):
        age = date.today() - timedelta(days=1095.726)
        trans = self.t.translate(self.birthdate,'exact',3, Patient, 'years')
        self.assertEqual(str(trans['query_modifiers']['condition']), "(AND: ('birthdate__exact', datetime.date({}, {}, {})))".format(age.year, age.month, age.day))

    def test_trans_omit_units(self):
        age = date.today() - timedelta(days=1095.726)
        trans = self.t.translate(self.birthdate,'exact',3, Patient)
        self.assertEqual(str(trans['query_modifiers']['condition']), "(AND: ('birthdate__exact', datetime.date({}, {}, {})))".format(age.year, age.month, age.day))

    def test_trans_months(self):
        age = date.today() - timedelta(days=121.7472)
        trans = self.t.translate(self.birthdate,'exact',4, Patient, 'months')
        self.assertEqual(str(trans['query_modifiers']['condition']), "(AND: ('birthdate__exact', datetime.date({}, {}, {})))".format(age.year, age.month, age.day))

    def test_trans_days(self):
        age = date.today() - timedelta(days=28)
        trans = self.t.translate(self.birthdate,'exact',28, Patient, 'days')
        self.assertEqual(str(trans['query_modifiers']['condition']), "(AND: ('birthdate__exact', datetime.date({}, {}, {})))".format(age.year, age.month, age.day))


