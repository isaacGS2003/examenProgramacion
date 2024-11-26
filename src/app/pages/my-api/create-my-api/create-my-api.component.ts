import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MiApiService, Trabajador } from '../../../services/miApi.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-my-api',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-my-api.component.html',
  styleUrls: ['./create-my-api.component.css'],
})
export class CreateMyApiComponent {
  // Formulario reactivo con validaciones básicas
  public trabajadorForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    puesto: new FormControl('', [Validators.required]),
    horario: new FormControl('', [Validators.required]),
    salario: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    telefono_contacto: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'), // Solo números
      Validators.minLength(10), // Mínimo 10 caracteres
      Validators.maxLength(10), // Máximo 10 caracteres
    ]),
  });

  constructor(private miApiService: MiApiService, public router: Router) {}

  onSubmit() {
    if (this.trabajadorForm.valid) {
      const nuevoTrabajador = this.trabajadorForm.value as Omit<
        Trabajador,
        '_id'
      >; // Excluir `_id`

      console.log('Datos a enviar:', nuevoTrabajador);

      this.miApiService.addTrabajador(nuevoTrabajador).subscribe({
        next: () => {
          console.log('Trabajador agregado con éxito');
          this.router.navigate(['/miapi/list']); // Redirige a la lista de trabajadores
        },
        error: (err) => {
          console.error('Error al agregar trabajador:', err);
        },
      });
    } else {
      console.error('Formulario inválido:', this.trabajadorForm.value);
    }
  }
}
