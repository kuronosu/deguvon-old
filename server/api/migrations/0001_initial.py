# Generated by Django 2.2.3 on 2019-07-30 04:13

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Anime',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('aid', models.IntegerField(unique=True, verbose_name='Anime ID')),
                ('name', models.CharField(max_length=300, unique=True, verbose_name='Nombre')),
                ('slug', models.SlugField(max_length=300, unique=True, verbose_name='Slug')),
                ('animeflv_url', models.CharField(max_length=300, unique=True, verbose_name='AnimeFLV url')),
                ('cover', models.CharField(max_length=300, verbose_name='Imagen de portada')),
                ('synopsis', models.TextField(verbose_name='Sinopsis')),
                ('banner', models.CharField(max_length=300, verbose_name='Banner')),
                ('score', models.FloatField(validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(5)], verbose_name='Puntaje')),
            ],
        ),
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='Nombre del genero')),
            ],
        ),
        migrations.CreateModel(
            name='State',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='Nombre del estado')),
            ],
        ),
        migrations.CreateModel(
            name='Type',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='Nombre del tipo')),
            ],
        ),
        migrations.CreateModel(
            name='Relation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ra_name', models.CharField(max_length=300, verbose_name='Nombre del anime relacionado')),
                ('animeflv_url', models.CharField(max_length=300, verbose_name='Url del anime relacionado')),
                ('relation', models.CharField(max_length=100, verbose_name='Relación')),
                ('anime', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Anime')),
            ],
        ),
        migrations.CreateModel(
            name='Episode',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.FloatField(verbose_name='Numero del episodio')),
                ('animeflv_url', models.CharField(max_length=300, unique=True, verbose_name='Url del episodio')),
                ('cover', models.CharField(max_length=300, verbose_name='Imagen')),
                ('anime', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Anime')),
            ],
        ),
        migrations.AddField(
            model_name='anime',
            name='genres',
            field=models.ManyToManyField(to='api.Genre', verbose_name='Generos'),
        ),
        migrations.AddField(
            model_name='anime',
            name='state',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.State', verbose_name='Estado'),
        ),
        migrations.AddField(
            model_name='anime',
            name='typea',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Type', verbose_name='Tipo'),
        ),
    ]
