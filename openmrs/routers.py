class Router(object):
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'openmrs':
            return 'default'
        return 'default'
    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'openmrs':
            return 'openmrs'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        return True

    def allow_syncdb(self, db, model):
        if db == 'openmrs' or model._meta.app_label == 'openmrs':
            return False
        else:
            return True
