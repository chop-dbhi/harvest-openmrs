from django.shortcuts import render, get_object_or_404
from avocado.models import DataConcept
from avocado import formatters
from openmrs.models import (Patient, Encounter, LabResult, SystemsReview,
    EncounterVaccine, HIVDetails, TBDetails, PCPDetails)


def format_concept(concept, values, formats=None):
    name = concept.formatter
    f = formatters.registry.get(name)(concept, formats=formats)
    return f(values)


def landing(request):
    return render(request, 'landing.html')


def get_vaccine_table(encounter):
    # Get all Vaccine information
    enc_vac = EncounterVaccine.objects.filter(encounter=encounter)

    if enc_vac:
        recieved = []
        ordered = []
        vaccine_rows = ""
        for ev in enc_vac:
            # Easier not to use the Formatters in this case..
            if ev.status == "PREVIOUS IMMUNIZATIONS ADMINISTERED":
                recieved.append(ev.vaccine.name)
            elif ev.status == "IMMUNIZATIONS ORDERED":
                ordered.append(ev.vaccine.name)

        while len(recieved) > 0 or len(ordered) > 0:
            r = ""
            o = ""
            if len(recieved) > 0:
                r = recieved.pop(0)
            if len(ordered) > 0:
                o = ordered.pop(-1)
            vaccine_rows += "<tr><td>{0}</td><td>{1}</td></tr>".format(o, r)

        return "<h4> Vaccinations </h4><table class='table table-bordered table-condensed'><thead><tr></tr><tr><th class='text-warning'>ORDERED</th><th class='text-info'>PREVIOUSLY RECIEVED</th></tr></thead><tbody>{0}</tbody></table>".format(vaccine_rows)
    return ""


def patient_view(request, mrn):
    p = get_object_or_404(Patient, mrn=mrn)

    enc = Encounter.objects.filter(patient=p).order_by('-encounter_datetime')

    dc = DataConcept.objects.get(pk=62)
    age, = format_concept(dc, [p.birthdate, p.birthdate_estimated], formats=['html'])
    p.age = age

    dc = DataConcept.objects.get(pk=63)
    gender, = format_concept(dc, p.gender, formats=['html'])
    p.gender = gender

    enc_list = []
    for e in enc:
        # Get all LabResults and pass it into the appropriate formatters to produce HTML
        # tables for the template
        results = LabResult.objects.filter(encounter=e)

        for r in results:
            dc = DataConcept.objects.get(pk=4)
            table, = format_concept(dc, [r.hgb, r.wbc, r.rbc, r.platelets, r.mcv, r.hct, r.rdw, r.mchc, r.mch], formats=['html'])
            r.cbc_table = table

            dc = DataConcept.objects.get(pk=6)
            table, = format_concept(dc, [r.cr, r.bun, r.glu, r.na, r.k, r.cl, r.co2], formats=['html'])
            r.chem_table = table

            dc = DataConcept.objects.get(pk=7)
            table, = format_concept(dc, [r.cd4, r.cd4_percent, r.cd8, r.sgpt, r.sgpt, r.alc], formats=['html'])
            r.misc_table = table

        # Likewise, get all SystemReview objects and pass into
        sys_reviews = SystemsReview.objects.filter(encounter=e)
        for s in sys_reviews:
            dc = DataConcept.objects.get(pk=64)
            table, = format_concept(dc, [s.heent, s.chest, s.abdominal, s.cardiac, s.musculoskeletal, s.neurologic], formats=['html'])
            s.table = table

        dc = DataConcept.objects.get(pk=3)
        age, = format_concept(dc, [p.birthdate, p.birthdate_estimated, e.encounter_datetime], formats=['html'])
        e.date_age = age

        vaccines = get_vaccine_table(e)

        drug_list =""
        if e.drugs.all():
            drug_list ="<h4>Drugs</h4><ul>"
            for drug in e.drugs.all():
                drug_list +="<li><strong>" +  drug.name + "</strong> to treat " + drug.disease + " </li>"
            drug_list +="</ul>"

        diags = ""
        diagnoses  = ""
        for diagnoses in e.diagnoses.all():
            diags += "<li>{0}</li>".format(diagnoses.name)
        if diags:
            diagnoses = "<h4>Diagnoses</h4><ul>{0}</ul>".format(diags)

        hiv_details = HIVDetails.objects.filter(encounter=e)
        for h in hiv_details:
            dc = DataConcept.objects.get(pk=11)
            table, = format_concept(dc, [h.plan, h.treat_adhere, h.stage_adult, h.stage_adult_last, h.stage_peds, h.cdc_category, h.taking_antiretrovirals, h.discordant_couple], formats=['html'])
            h.table = table

        # Get TB details table
        tb_details = TBDetails.objects.filter(encounter=e)

        for tb in tb_details:
            dc = DataConcept.objects.get(pk=12)
            table, = format_concept(dc, [tb.treat_adhere, tb.treat_plan, tb.pro_adhere, tb.pro_plan], formats=['html'])
            tb.table = table

        # Get pcp details table
        pcp_details = PCPDetails.objects.filter(encounter=e)

        for pcp in pcp_details:
            dc = DataConcept.objects.get(pk=16)
            table, = format_concept(dc, [pcp.plan, pcp.pro_adhere], formats=['html'])
            pcp.table = table

        enc_list.append([e, results, sys_reviews, vaccines, drug_list,
            diagnoses, hiv_details, tb_details, pcp_details])

    return render(request, 'patient.html', {
        'patient': p,
        'encounters': enc_list,
    })
