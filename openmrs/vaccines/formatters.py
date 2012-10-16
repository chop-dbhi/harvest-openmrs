from avocado.formatters import registry
from serrano.formatters import HTMLFormatter


class VaccineFormatter(HTMLFormatter):

    def to_html(self, values, **context):
        print values
        status = values['status']
        name = values['name']
        if status == 'PREVIOUS IMMUNIZATIONS ADMINISTERED':
            status = "(PREVIOUSLY ADMINISTERED)"
            return "<strong>" + name + "</strong> " + "<span class='text-info'>" + status +  "</span></br>"
        elif status == "IMMUNIZATIONS ORDERED":
            status = "(ORDERED)"
            return "<strong>" + name + "</strong> " + "<span class='text-warning'>" + status + "</span></br>"
        return "<h5>" + name + " " + status + "</h5>"

    to_html.process_multiple = True


registry.register(VaccineFormatter, 'Vaccine')
