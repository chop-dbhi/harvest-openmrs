from datetime import date, timedelta
from avocado.query.translators import Translator, registry

class AgeTranslator(Translator):
    def translate(self, field, roperator,rvalue, tree, units='years', **kwargs):
        secs= float(rvalue)*60*60*24*365.242
        if units == 'months':
            secs = float(rvalue)*60*60*24*30.4368
        elif units == 'days':
            secs = float(rvalue)*60*60*24
        rvalue =date.today() - timedelta(seconds=secs)
        output = super(AgeTranslator,self).translate(field,roperator,rvalue,tree, **kwargs)
        return output

registry.register(AgeTranslator, 'Age')
