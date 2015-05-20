try:
    from collections import OrderedDict
except ImportError:
    from ordereddict import OrderedDict
from datetime import date, timedelta
from django.test import TestCase
from django.core import management
from avocado.models import DataField, DataConcept, DataConceptField
from avocado.formatters import registry

class FormatTest(TestCase):

    def setUp(self):
        management.call_command('avocado','init', 'openmrs')

        birthdate_field = DataField.objects.get_by_natural_key('openmrs', 'patient', 'birthdate')
        estimate_field = DataField.objects.get_by_natural_key('openmrs','patient', 'birthdate_estimated')

        self.concept = concept = DataConcept(name="Birthdate")
        concept.save()

        DataConceptField(concept=concept, field=birthdate_field, order=1).save()
        DataConceptField(concept=concept, field=estimate_field, order=2).save()

        formatter = registry.get('Age')
        self.f = formatter(concept)

    def test_dateage(self):
        self.values = [date(1992, 10, 3), False]
        fvalues = self.f(self.values, preferred_formats=['html'])
        age = round((date.today() - date(1992,10,3)).total_seconds()/60/60/24/365, 1)
        self.assertEqual(OrderedDict([
            ('Birthdate', '{0} years old'.format(age)),
            ]), fvalues)

    def test_estimated(self):
        self.values = [date(1992, 10, 3), True]
        fvalues = self.f(self.values, preferred_formats=['html'])
        age = round((date.today() - date(1992,10,3)).total_seconds()/60/60/24/365, 1)
        self.assertEqual(OrderedDict([
            ('Birthdate', "{0} years old <em class='muted'>(estimated)</em>".format(age)),
            ]), fvalues)

    def test_year(self):
        dob = date.today() - timedelta(days=366)
        self.values = [dob, False]
        fvalues = self.f(self.values, preferred_formats=['html'])
        self.assertEqual(OrderedDict([
            ('Birthdate', '1.0 year old'),
            ]), fvalues)

    def test_year_est(self):
        dob = date.today() - timedelta(days=366)
        self.values = [dob, True]
        fvalues = self.f(self.values, preferred_formats=['html'])
        self.assertEqual(OrderedDict([
            ('Birthdate', "1.0 year old <em class='muted'>(estimated)</em>"),
            ]), fvalues)

    def test_months(self):
        dob = date.today() - timedelta(days=60)
        self.values = [dob, False]
        fvalues = self.f(self.values, preferred_formats=['html'])
        self.assertEqual(OrderedDict([
            ('Birthdate', '2.0 months old'),
            ]), fvalues)

    def test_months_est(self):
        dob = date.today() - timedelta(days=60)
        self.values = [dob, True]
        fvalues = self.f(self.values, preferred_formats=['html'])
        self.assertEqual(OrderedDict([
            ('Birthdate', "2.0 months old <em class='muted'>(estimated)</em>"),
            ]), fvalues)

    def test_month(self):
        dob = date.today() - timedelta(days=30)
        self.values = [dob, False]
        fvalues = self.f(self.values, preferred_formats=['html'])
        self.assertEqual(OrderedDict([
            ('Birthdate', '1.0 month old'),
            ]), fvalues)

    def test_month_est(self):
        dob = date.today() - timedelta(days=30)
        self.values = [dob, True]
        fvalues = self.f(self.values, preferred_formats=['html'])
        self.assertEqual(OrderedDict([
            ('Birthdate', "1.0 month old <em class='muted'>(estimated)</em>"),
            ]), fvalues)

    def test_half_month(self):
        dob = date.today() - timedelta(days=45)
        self.values = [dob, False]
        fvalues = self.f(self.values, preferred_formats=['html'])
        self.assertEqual(OrderedDict([
            ('Birthdate', '1.5 months old'),
            ]), fvalues)

    def test_half_month_est(self):
        dob = date.today() - timedelta(days=45)
        self.values = [dob, True]
        fvalues = self.f(self.values, preferred_formats=['html'])
        self.assertEqual(OrderedDict([
            ('Birthdate', "1.5 months old <em class='muted'>(estimated)</em>"),
            ]), fvalues)

    def test_two_half_year(self):
        dob = date.today() - timedelta(days=912)
        self.values = [dob, False]
        fvalues = self.f(self.values, preferred_formats=['html'])
        self.assertEqual(OrderedDict([
            ('Birthdate', '2.5 years old'),
            ]), fvalues)

    def test_two_half_year_est(self):
        dob = date.today() - timedelta(days=912)
        self.values = [dob, True]
        fvalues = self.f(self.values, preferred_formats=['html'])
        self.assertEqual(OrderedDict([
            ('Birthdate', "2.5 years old <em class='muted'>(estimated)</em>"),
            ]), fvalues)

    def test_empty(self):
        self.values =[None,False]
        fvalues = self.f(self.values, preferred_formats=['html'])
        self.assertEqual(OrderedDict([
            ('Birthdate', 'Current age not available'),
            ]), fvalues)

    def test_empty_est(self):
        self.values =[None,True]
        fvalues = self.f(self.values, preferred_formats=['html'])
        self.assertEqual(OrderedDict([
            ('Birthdate', 'Current age not available'),
            ]), fvalues)

    def test_empty_both(self):
        self.values =[None, None]
        fvalues = self.f(self.values, preferred_formats=['html'])
        self.assertEqual(OrderedDict([
            ('Birthdate', 'Current age not available'),
            ]), fvalues)

    def test_empty_est(self):
        self.values =[None, None]
        fvalues = self.f(self.values, preferred_formats=['html'])
        self.assertEqual(OrderedDict([
            ('Birthdate', 'Current age not available'),
            ]), fvalues)

    def test_two_half_year_empty_est(self):
        dob = date.today() - timedelta(days=912)
        self.values = [dob, None]
        fvalues = self.f(self.values, preferred_formats=['html'])
        self.assertEqual(OrderedDict([
            ('Birthdate', '2.5 years old'),
            ]), fvalues)

    def test_half_month_empty_est(self):
        dob = date.today() - timedelta(days=45)
        self.values = [dob, None]
        fvalues = self.f(self.values, preferred_formats=['html'])
        self.assertEqual(OrderedDict([
            ('Birthdate', '1.5 months old'),
            ]), fvalues)

    def test_one_day(self):
        dob = date.today() - timedelta(days=1)
        self.values = [dob, False]
        fvalues = self.f(self.values, preferred_formats=['html'])
        self.assertEqual(OrderedDict([
            ('Birthdate', '1.0 day old'),
            ]), fvalues)

    def test_one_day_est(self):
        dob = date.today() - timedelta(days=1)
        self.values = [dob, True]
        fvalues = self.f(self.values, preferred_formats=['html'])
        self.assertEqual(OrderedDict([
            ('Birthdate', "1.0 day old <em class='muted'>(estimated)</em>"),
            ]), fvalues)

    def test_24_days(self):
        dob = date.today() - timedelta(days=24)
        self.values = [dob, False]
        fvalues = self.f(self.values, preferred_formats=['html'])
        self.assertEqual(OrderedDict([
            ('Birthdate', '24.0 days old'),
            ]), fvalues)

    def test_24_daysi_est(self):
        dob = date.today() - timedelta(days=24)
        self.values = [dob, True]
        fvalues = self.f(self.values, preferred_formats=['html'])
        self.assertEqual(OrderedDict([
            ('Birthdate', "24.0 days old <em class='muted'>(estimated)</em>"),
            ]), fvalues)

