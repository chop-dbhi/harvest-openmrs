from django.shortcuts import render, get_object_or_404
from avocado.models import DataConcept
from openmrs.models import (Patient, Encounter, LabResult, SystemsReview,
    EncounterVaccine, HIVDetails, TBDetails, PCPDetails)


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

def patient_view(request, pk):
    p = get_object_or_404(Patient, pk=pk)

    enc = Encounter.objects.filter(patient=p).order_by('-encounter_datetime')

    dc = DataConcept.objects.get(ident="inter_birthdate")
    age = dc.format([p.birthdate_estimated, p.birthdate], preferred_formats=['html'])
    p.age = age['inter_birthdate']

    dc = DataConcept.objects.get(ident='inter_gender')
    gender = dc.format(p.gender, preferred_formats=['html'])
    p.gender = gender['gender']

    enc_list = []
    for e in enc:
        # Get all LabResults and pass it into the appropriate formatters to produce HTML
        # tables for the template
        results = LabResult.objects.filter(encounter=e)

        for r in results:
            dc = DataConcept.objects.get(ident="inter_cbclab")
            table = dc.format([r.hgb, r.wbc, r.rbc, r.platelets, r.mcv, r.hct, r.rdw, r.mchc, r.mch], preferred_formats=['html'])
            r.cbc_table = table['inter_cbclab']

            dc = DataConcept.objects.get(ident="inter_chem7")
            table = dc.format([r.cr, r.bun, r.glu, r.na, r.k, r.cl, r.co2], preferred_formats=['html'])
            r.chem_table = table['inter_chem7']

            dc = DataConcept.objects.get(ident="inter_misclab")
            table = dc.format([r.cd4, r.cd4_percent, r.cd8, r.sgpt, r.sgpt, r.alc], preferred_formats=['html'])
            r.misc_table = table['inter_misclab']

        # Likewise, get all SystemReview objects and pass into
        sys_reviews = SystemsReview.objects.filter(encounter=e)
        for s in sys_reviews:
            dc = DataConcept.objects.get(ident="inter_systemsreview")
            table = dc.format([s.heent, s.chest, s.abdominal, s.cardiac, s.musculoskeletal, s.neurologic], preferred_formats=['html'])
            s.table = table['inter_systemsreview']

        dc = DataConcept.objects.get(ident='inter_encounterage')
        vals = dc.format([p.birthdate, p.birthdate_estimated, e.encounter_datetime], preferred_formats=['html'])
        e.date_age = vals['inter_encounterage']

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
            dc = DataConcept.objects.get(ident="inter_hivdetail")
            table = dc.format([h.plan, h.treat_adhere, h.stage_adult, h.stage_adult_last, h.stage_peds, h.cdc_category, h.taking_antiretrovirals, h.discordant_couple], preferred_formats=['html'])
            h.table = table['inter_hivdetail']

        # Get TB details table
        tb_details = TBDetails.objects.filter(encounter=e)

        for tb in tb_details:
            dc = DataConcept.objects.get(ident="inter_tbdetail")
            table = dc.format([tb.treat_adhere, tb.treat_plan, tb.pro_adhere, tb.pro_plan], preferred_formats=['html'])
            tb.table = table['inter_tbdetail']

        # Get pcp details table
        pcp_details = PCPDetails.objects.filter(encounter=e)

        for pcp in pcp_details:
            dc = DataConcept.objects.get(ident="inter_pcpdetail")
            table = dc.format([pcp.plan, pcp.pro_adhere], preferred_formats=['html'])
            pcp.table = table['inter_pcpdetail']

        enc_list.append([e, results, sys_reviews, vaccines, drug_list,
            diagnoses, hiv_details, tb_details, pcp_details])

    return render(request, 'patient.html', {
        'patient': p,
        'encounters': enc_list,
    })
