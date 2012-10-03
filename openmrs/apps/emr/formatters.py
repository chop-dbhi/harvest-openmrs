from avocado.formatters import registry
from serrano.formatters import HTMLFormatter
from datetime import date


class AgeFormatter(HTMLFormatter):
    def to_html(self, values, **context):
        
        dob = values['birthdate']
        est = values['birthdate_estimated']
        

        if not dob:
            return "Age not available"

        else:
            today = date.today()
            age = ((today - dob).total_seconds())/60/60/24/365.242
            age = round(age, 1)
            
            time = "years"
            if age < 1.0:
                age = ((today - dob).total_seconds())/60/60/24/30.4368
                age = round(age, 1)
                time = "months"
                if age < 1.0:
                    age =((today - dob).total_seconds())/60/60/24
                    age = round(age, 1)
                    time = "days"
                    if age == 1.0:
                        time = "day"
                elif age == 1.0:
                    time = "month"

            elif age == 1.0:
                time ="year"

            if est:
                return "{} {} old <em>(estimated)</em>".format(age, time)
            else: 
                return "{} {} old".format(age,time)

    to_html.process_multiple = True

registry.register(AgeFormatter, 'Age')
