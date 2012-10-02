from avocado.query.translators import Translator, registry


class GenderTranslator(Translator):
    def translate(self, *args, **kwargs):
        output = super(GenderTranslator, self).translate(*args, **kwargs)
        cvalue = output['cleaned_data']['value']

        if cvalue == 'M':
            cvalue = 'Male'
        elif cvalue == 'F':
            cvalue = 'Female'
        output['cleaned_data']['value'] = cvalue
        return output


registry.register(GenderTranslator, 'Gender')
