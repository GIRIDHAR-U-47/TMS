from django.core.management.base import BaseCommand
from api.models import TrainingModule


class Command(BaseCommand):
    help = 'Populate the database with initial training modules'

    def handle(self, *args, **options):
        training_modules_data = [
            {
                's_no': 1,
                'title': 'Pricol culture & Values, Time office & Briefing on statutory requirements',
                'expert': 'Mr.Harish Kumar Y / Mr.Sivakumar G',
            },
            {
                's_no': 2,
                'title': 'Behavioural safety & Environment',
                'expert': 'Mr. Jagadeesan M/ Mr. Sridhar R',
            },
            {
                's_no': 3,
                'title': 'IR - OHC (Medical centre)',
                'expert': 'Medical Officers',
            },
            {
                's_no': 4,
                'title': 'IR - Security Office',
                'expert': 'Security Officers',
            },
            {
                's_no': 5,
                'title': 'Workplace maintenance - 5S & Suggestion scheme',
                'expert': 'Mr. Balamurugan P',
            },
            {
                's_no': 6,
                'title': 'POSH Awareness',
                'expert': 'Ms. Aarthi R',
            },
            {
                's_no': 7,
                'title': 'Product / Process knowledge',
                'expert': '',
            },
            {
                's_no': 8,
                'title': 'Usage of tools / Machines / Instruments & Calibration / Gauges & Abnormality Handling',
                'expert': 'Mr. Madhalaimuthu',
            },
            {
                's_no': 9,
                'title': 'Defect identification & Quality alerts',
                'expert': '',
            },
            {
                's_no': 10,
                'title': 'Videos on process, Safety,EHS, Discipline, 5S',
                'expert': 'Ms. Vinitha V',
            },
            {
                's_no': 11,
                'title': 'Basic dexterity training & Assessment',
                'expert': '',
            },
            {
                's_no': 12,
                'title': 'Gemba & Skill evaluation (Post test)',
                'expert': 'Operations / Other',
            },
        ]

        created_count = 0
        updated_count = 0

        for module_data in training_modules_data:
            module, created = TrainingModule.objects.get_or_create(
                s_no=module_data['s_no'],
                defaults=module_data
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created training module: {module.title}')
                )
            else:
                # Update existing module
                for key, value in module_data.items():
                    setattr(module, key, value)
                module.save()
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'Updated training module: {module.title}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully processed {len(training_modules_data)} training modules. '
                f'Created: {created_count}, Updated: {updated_count}'
            )
        ) 