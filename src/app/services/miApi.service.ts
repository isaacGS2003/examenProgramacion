import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

export interface Trabajador {
  _id: string; // Cambiado `Empleado` a `Trabajador`
  nombre: string;
  apellido: string;
  puesto: string;
  horario: string;
  salario: number;
  telefono_contacto: string;
}

@Injectable({ providedIn: 'root' })
export class MiApiService {
  private baseUrl = 'http://localhost:3000/api/trabajadores';

  constructor(private http: HttpClient) {}

  /** Obtiene todos los trabajadores */
  getTrabajadores(): Observable<Trabajador[]> {
    return this.http.get<{ trabajadores: Trabajador[] }>(this.baseUrl).pipe(
      map((response) => response.trabajadores), // Extrae el array de la propiedad `trabajadores`
      catchError((error) => {
        console.error('Error al obtener los trabajadores:', error);
        return of([]); // Devuelve un arreglo vacío en caso de error
      })
    );
  }

  /** Busca un trabajador por ID */
  getTrabajadorById(id: string): Observable<Trabajador | undefined> {
    return this.http
      .get<{ trabajadores: Trabajador[] }>(this.baseUrl) // La respuesta tiene un campo "empleados"
      .pipe(
        map((response) =>
          response.trabajadores.find((trabajador) => trabajador._id === id)
        ), // Filtra por ID
        catchError((error) => {
          console.error('Error al obtener el trabajador por ID:', error);
          return of(undefined); // Devuelve `undefined` en caso de error
        })
      );
  }

  /** Busca trabajadores por coincidencia parcial en el nombre */
  getTrabajadoresByNombreParcial(nombre: string): Observable<Trabajador[]> {
    return this.http
      .get<{ trabajadores: Trabajador[] }>(`${this.baseUrl}/nombre/${nombre}`)
      .pipe(
        map((response) => response.trabajadores),
        catchError((error) => {
          console.error(
            'Error al obtener trabajadores por nombre parcial:',
            error
          );
          return of([]); // Devuelve un arreglo vacío en caso de error
        })
      );
  }

  /** Agrega un nuevo trabajador */
  addTrabajador(trabajador: Omit<Trabajador, '_id'>): Observable<Trabajador> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http
      .post<Trabajador>(this.baseUrl, trabajador, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al agregar trabajador:', error);
          throw error; // Relanza el error para manejarlo externamente
        })
      );
  }

  /** Actualiza un trabajador existente */
  updateTrabajador(trabajador: Trabajador): Observable<Trabajador> {
    if (!trabajador._id) {
      throw Error('El ID del trabajador es requerido para actualizar');
    }

    const { _id, ...trabajadorSinId } = trabajador; // Excluir `_id` del cuerpo de la solicitud

    return this.http
      .put<Trabajador>(`${this.baseUrl}/${_id}`, trabajadorSinId)
      .pipe(
        catchError((error) => {
          console.error('Error al actualizar trabajador:', error);
          throw error; // Relanza el error para manejarlo externamente
        })
      );
  }

  /** Elimina un trabajador por su ID */
  deleteTrabajadorById(id: string): Observable<boolean> {
    if (!id) {
      throw Error('El ID del trabajador es requerido para eliminar');
    }

    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      map(() => true), // Devuelve `true` si la eliminación es exitosa
      catchError((error) => {
        console.error('Error al eliminar trabajador:', error);
        return of(false); // Devuelve `false` en caso de error
      })
    );
  }
}
