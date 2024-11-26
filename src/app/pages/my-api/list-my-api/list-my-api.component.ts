import { Component } from '@angular/core';
import { Trabajador, MiApiService } from '../../../services/miApi.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-my-api',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './list-my-api.component.html',
  styleUrls: ['./list-my-api.component.css'], // Corregido `styleUrls`
})
export class ListMyApiComponent {
  public trabajadores: Trabajador[] = []; // Lista de trabajadores completa
  public searchResults: Trabajador[] = []; // Resultados de la búsqueda
  public searchTerm: string = ''; // Término de búsqueda

  constructor(private miApiService: MiApiService) {}

  ngOnInit(): void {
    // Cargar todos los trabajadores al iniciar
    this.miApiService.getTrabajadores().subscribe((trabajadores) => {
      this.trabajadores = trabajadores;
      this.searchResults = trabajadores; // Inicializar la tabla con todos los trabajadores
    });
  }

  onSearch(): void {
    // Si el término de búsqueda está vacío, mostrar todos los trabajadores
    if (!this.searchTerm.trim()) {
      this.searchResults = this.trabajadores;
      return;
    }

    // Verificar si el término de búsqueda podría ser un ID
    if (this.isId(this.searchTerm)) {
      // Buscar por ID
      this.miApiService.getTrabajadorById(this.searchTerm).subscribe({
        next: (trabajador) => {
          if (trabajador) {
            console.log(trabajador);

            this.searchResults = [trabajador]; // Mostrar el único resultado encontrado por ID
            console.log(this.searchResults);
          } else {
            this.searchResults = []; // No se encontró el trabajador
            alert('No se encontró un trabajador con ese ID.');
          }
        },
        error: (err) => {
          console.error('Error al buscar por ID:', err);
          alert('Hubo un error al buscar por ID.');
        },
      });
    } else {
      // Buscar por nombre (parcial)
      this.miApiService
        .getTrabajadoresByNombreParcial(this.searchTerm)
        .subscribe({
          next: (resultados) => {
            this.searchResults = resultados; // Actualizar los resultados mostrados en la tabla
            if (resultados.length === 0) {
              alert('No se encontraron trabajadores con ese nombre.');
            }
          },
          error: (err) => {
            console.error('Error al buscar trabajadores:', err);
            alert('Hubo un error al realizar la búsqueda por nombre.');
          },
        });
    }
  }

  // Método para verificar si el término es un ID
  isId(term: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(term); // Compara si el término tiene la longitud y formato de un ID de MongoDB
  }

  eliminarTrabajador(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este trabajador?')) {
      this.miApiService.deleteTrabajadorById(id).subscribe({
        next: (resultado) => {
          if (resultado) {
            alert('Trabajador eliminado con éxito');
            // Actualizar la lista de resultados después de eliminar
            this.searchResults = this.searchResults.filter(
              (trab) => trab._id !== id
            );
            // Actualizar la lista completa en caso de nuevas búsquedas
            this.trabajadores = this.trabajadores.filter(
              (trab) => trab._id !== id
            );
          } else {
            alert('Error al eliminar trabajador');
          }
        },
        error: (err) => console.error('Error al eliminar trabajador:', err),
      });
    }
  }
}
