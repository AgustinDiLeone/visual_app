import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertaService } from 'src/app/services/alerta.service';
import {
  Chart,
  PieController,
  BarController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from 'chart.js';

Chart.register(
  PieController,
  BarController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
    IonButtons,
  ],
})
export class GraficosPage implements OnInit {
  tipo: 'linda' | 'fea' = 'linda';

  constructor(
    private route: ActivatedRoute,
    private supabase: AuthService,
    private alert: AlertaService,
    private router: Router
  ) {}

  ngOnInit(): void {}
  async ngAfterViewInit() {
    this.tipo = this.route.snapshot.paramMap.get('tipo') as 'linda' | 'fea';

    const { data, error } = await this.supabase.supabaseClient
      .from('imagenes')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) {
      this.alert.mostrar('Error al obtener las imágenes');
      return;
    }

    const imagenesFiltradas = data.filter((img) => img.tipo === this.tipo);

    const labels = imagenesFiltradas.map((img) => img.nombre);
    const votos = imagenesFiltradas.map((img) =>
      Array.isArray(img.likes) ? img.likes.length : 0
    );
    const urls = imagenesFiltradas.map((img) => img.url); // Guardamos las URLs de las imágenes

    setTimeout(() => {
      if (this.tipo === 'linda') {
        this.graficarTorta(labels, votos, urls);
      } else {
        this.graficarBarras(labels, votos, urls);
      }
    }, 0);
  }

  graficarTorta(labels: string[], data: number[], urls: string[]) {
    new Chart('grafico', {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: 'Likes por imagen',
            data,
            borderColor: 'rgb(125, 49, 49)',
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#8BC34A',
              '#FF9800',
              '#9C27B0',
              '#00BCD4',
              '#E91E63',
              '#3F51B5',
              '#CDDC39',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'white', // Letras blancas en la leyenda
              font: {
                weight: 'bold', // Negrita en la leyenda
              },
            },
          },
          title: {
            display: true,
            text: 'Cosas ' + this.tipo.toUpperCase(),
            color: 'white', // Título en blanco
            font: {
              weight: 'bold', // Título en negrita
              size: 18, // Tamaño de la fuente
            },
          },
          tooltip: {
            bodyFont: {
              weight: 'bold', // Negrita en los tooltips
            },
            titleFont: {
              weight: 'bold', // Negrita en el título del tooltip
            },
            callbacks: {
              label: (tooltipItem) => {
                return `${tooltipItem.label}: ${tooltipItem.raw} likes`; // Muestra los likes en los tooltips
              },
            },
          },
        },
        onClick: (e) => this.handleChartClick(e, labels, urls),
      },
    });
  }

  graficarBarras(labels: string[], data: number[], urls: string[]) {
    new Chart('grafico', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Likes por imagen',
            data,
            backgroundColor: 'rgba(125, 49, 49, 0.6)',
            borderColor: 'rgb(125, 49, 49)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        indexAxis: 'y', // <-- Esto hace que las barras estén acostadas
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            labels: {
              color: 'white',
              font: {
                weight: 'bold',
              },
            },
          },
          title: {
            display: true,
            text: 'Cosas ' + this.tipo.toUpperCase(),
            color: 'white',
            font: {
              weight: 'bold',
              size: 18,
            },
          },
          tooltip: {
            bodyFont: {
              weight: 'bold',
            },
            titleFont: {
              weight: 'bold',
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              color: 'white',
              font: {
                weight: 'bold',
              },
              stepSize: 1,
              precision: 0,
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)',
            },
          },
          y: {
            ticks: {
              color: 'white',
              font: {
                weight: 'bold',
              },
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)',
            },
          },
        },
        onClick: (e) => this.handleChartClick(e, labels, urls),
      },
    });
  }

  handleChartClick(event: any, labels: string[], urls: string[]) {
    const activePoints = event.chart.getElementsAtEventForMode(
      event,
      'nearest',
      { intersect: true },
      false
    );
    if (activePoints.length > 0) {
      const index = activePoints[0].index;
      const selectedImageUrl = urls[index]; // Obtenemos la URL de la imagen seleccionada
      const selectedImageName = labels[index]; // Obtenemos el nombre de la imagen

      // Navegamos al componente que muestra la imagen
      this.router.navigate(['/imagen-detalle'], {
        queryParams: {
          url: selectedImageUrl,
          nombre: selectedImageName,
          tipo: this.tipo,
        },
      });
    }
  }
  salir() {
    this.router.navigate([`/menu/${this.tipo}`]);
  }
}
