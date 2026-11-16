from decimal import Decimal
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Holiday',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(unique=True)),
                ('name', models.CharField(max_length=150)),
                ('holiday_type', models.CharField(choices=[('REGULAR', 'Regular Holiday (Double Pay 200%)'), ('SPECIAL', 'Special Non-Working Holiday (+30%)'), ('PAID_HOLIDAY', 'Paid Holiday (100% Even Unworked)')], default='REGULAR', max_length=20)),
                ('auto_apply', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['date'],
            },
        ),
        migrations.AddField(
            model_name='payrollrecord',
            name='paid_holiday_amount',
            field=models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=12),
        ),
        migrations.AddField(
            model_name='payrollrecord',
            name='paid_holiday_days',
            field=models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=6),
        ),
    ]
