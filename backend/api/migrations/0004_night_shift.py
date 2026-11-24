from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auditlog_userprofile'),
    ]

    operations = [
        migrations.AddField(
            model_name='payrollrecord',
            name='is_night_shift',
            field=models.BooleanField(default=False),
        ),
    ]
