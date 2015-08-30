from django.core.urlresolvers import reverse
from avocado.formatters import registry, Formatter, process_multiple
from datetime import date


def process_age(dob, date_end):
    if not dob or not date_end:
        return "<em class='muted'>Unknown</em>"
    else:
        age = ((date_end - dob).total_seconds())/60/60/24/365.242
        age = round(age, 1)

        time = "years"
        if age < 1.0:
            age = ((date_end - dob).total_seconds())/60/60/24/30.4368
            age = round(age, 1)
            time = "months"
            if age < 1.0:
                age = ((date_end - dob).total_seconds())/60/60/24
                age = round(age, 1)
                time = "days"
                if age == 1.0:
                    time = "day"
            elif age == 1.0:
                time = "month"

        elif age == 1.0:
            time = "year"

        return age, time


class AgeFormatter(Formatter):
    @process_multiple
    def to_html(self, values, **context):
        dob = values['birthdate']
        est = values['birthdate_estimated']

        if not dob:
            return "Current age not available"
        age, time = process_age(dob, date.today())

        if est:
            return "{0} {1} old <em class='muted'>(estimated)</em>".format(age, time)
        else:
            return "{0} {1} old".format(age, time)

    @process_multiple
    def to_csv(self, values, **context):
        dob = values['birthdate']

        if not dob:
            return 'N/A'

        age, time = process_age(dob, date.today())

        return str(age)

    @process_multiple
    def to_excel(self, values, **context):
        return self.to_csv(values, **context)


class EncounterAgeFormatter(Formatter):
    @process_multiple
    def to_html(self, values, **context):
        dob = values['birthdate']
        est = values['birthdate_estimated']
        enc = values['encounter_datetime']

        if not enc or not enc.date:
            return ''
        enc_date = date(enc.year, enc.month, enc.day)

        age, time = process_age(dob, enc_date)

        if est:
            return "{0} {1} old <em class='muted'>(estimated)</em>".format(age, time)
        else:
            return "{0} {1} old".format(age, time)


class GenderFormatter(Formatter):
    def to_html(self, value, **context):
        gender_map = {
            'M': 'Male',
            'F': 'Female',
        }
        if value in gender_map:
            return gender_map[value]
        return '<span class="muted">Unknown</span>'


class CbcPanelFormatter(Formatter):
    @process_multiple
    def to_html(self, values, **context):
        from avocado.models import DataField
        test_names = ['hgb','wbc','rbc','platelets','mcv','hct','rdw','mchc','mch']

        html_str = ""
        for name in test_names:
            if values[name] != None:
                data_field = DataField.objects.get_by_natural_key('openmrs', 'labresult', name)
                html_str += "<tr><td>{0}</td><td>{1}</td></tr>".format(data_field, values[name])
        if html_str != "":
            return "<table class='table table-striped'>{0}</table>".format(html_str)
        return "<div class='muted'><h5>No Complete Blood Count Panel</h5></div>"


class Chem7PanelFormatter(Formatter):
    @process_multiple
    def to_html(self, values, **context):
        from avocado.models import DataField
        test_names = ['cr','bun','glu','na','k','cl','co2']

        html_str = ""
        for name in test_names:
            if values[name] != None:
                data_field = DataField.objects.get_by_natural_key('openmrs', 'labresult', name)
                html_str += "<tr><td>{0}</td><td>{1}</td></tr>".format(data_field, values[name])
        if html_str != "":
            return "<table class='table table-striped'>{0}</table>".format(html_str)
        return "<div class='muted'><h5>No Chem7 Panel</h5></div>"


class MiscPanelFormatter(Formatter):
    @process_multiple
    def to_html(self, values, **context):
        from avocado.models import DataField
        test_names = ['cd4','cd4_percent','cd8','sgpt','alc']

        html_str = ""
        for name in test_names:
            if values[name] != None:
                data_field = DataField.objects.get_by_natural_key('openmrs', 'labresult', name)
                html_str += "<tr><td>{0}</td><td>{1}</td></tr>".format(data_field, values[name])
        if html_str != "":
            return "<table class='table table-striped'>{0}</table>".format(html_str)
        return ""


class SystemsFormatter(Formatter):
    @process_multiple
    def to_html(self, values, **context):
        from avocado.models import DataField
        test_names = ['heent','chest','abdominal','cardiac','musculoskeletal', 'neurologic']

        html_str = ""
        for name in test_names:
            if values[name] != None:
                data_field = DataField.objects.get_by_natural_key('openmrs', 'systemsreview', name)
                if values[name] == 'ABNORMAL':
                    html_str += "<tr class=error><td>{0}</td><td class=text-error>{1}</td></tr>".format(data_field, values[name])
                else:
                    html_str += "<tr><td>{0}</td><td>{1}</td></tr>".format(data_field, values[name])
        if html_str != "":
            return "<table class='table table-striped'>{0}</table>".format(html_str)
        return ""


class HIVDetailFormatter(Formatter):
    @process_multiple
    def to_html(self, values, **context):
        from avocado.models import DataField
        test_names = ['plan','treat_adhere','stage_adult','stage_adult_last','stage_peds','cdc_category', 'taking_antiretrovirals', 'discordant_couple']

        html_str = ""
        for name in test_names:
            if values[name] != None:
                data_field = DataField.objects.get_by_natural_key('openmrs', 'hivdetails', name)
                html_str += "<tr><td>{0}</td><td>{1}</td></tr>".format(data_field, values[name])
        if html_str != "":
            return "<table class='table table-striped'>{0}</table>".format(html_str)
        return ""


class TBDetailFormatter(Formatter):
    @process_multiple
    def to_html(self, values, **context):
        from avocado.models import DataField
        test_names = ['treat_adhere','treat_plan','pro_adhere','pro_plan']
        html_str = ""
        for name in test_names:
            if values[name] != None and values[name] != 'NONE':
                data_field = DataField.objects.get_by_natural_key('openmrs', 'tbdetails', name)
                html_str += "<tr><td>{0}</td><td>{1}</td></tr>".format(data_field, values[name])
        if html_str != "":
            return "<table class='table table-striped'>{0}</table>".format(html_str)
        return ""


class PCPDetailFormatter(Formatter):
    @process_multiple
    def to_html(self, values, **context):
        from avocado.models import DataField
        test_names = ['plan','pro_adhere']
        html_str = ""
        for name in test_names:
            if values[name] != None and values[name] != 'NONE':
                data_field = DataField.objects.get_by_natural_key('openmrs', 'pcpdetails', name)
                html_str += "<tr><td>{0}</td><td>{1}</td></tr>".format(data_field, values[name])
        if html_str != "":
            return "<table class='table table-striped'>{0}</table>".format(html_str)
        return ""


class MRNFormatter(Formatter):
    def to_html(self, value, **context):
        url = reverse('patient-detail', kwargs={'mrn': value})
        return '<a href="{0}">{1}</a>'.format(url, value)


registry.register(AgeFormatter, 'Age')
registry.register(GenderFormatter, 'Gender')
registry.register(EncounterAgeFormatter, 'EncounterAge')
registry.register(CbcPanelFormatter, 'CbcPanel')
registry.register(Chem7PanelFormatter, 'Chem7')
registry.register(MiscPanelFormatter, 'MiscLab')
registry.register(SystemsFormatter, 'SystemsReview')
registry.register(HIVDetailFormatter, 'HIVDetail')
registry.register(TBDetailFormatter, 'TBDetail')
registry.register(PCPDetailFormatter, 'PCPDetail')
registry.register(MRNFormatter, 'MRN')
