from avocado.formatters import registry
from serrano.formatters import HTMLFormatter


class GenderFormatter(HTMLFormatter):
    def to_html(self, values, **context):
        dob = values['birthdate']
        est = values['birthdate_estimated']

        output = str(dob)
        if est:
            output = '{} <em>(estimated)</em>'.format(output)
        return output

    to_html.process_multiple = True


registry.register(GenderFormatter, 'Gender')
