import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MiApiService, Trabajador } from '../../../services/miApi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-my-api',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-my-api.component.html',
  styleUrls: ['./update-my-api.component.css'],
})
export class UpdateMyApiComponent implements OnInit {
  public trabajadorForm = new FormGroup({
    _id: new FormControl(''), // Incluimos el campo _id para usarlo en la actualización
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

  constructor(
    private miApiService: MiApiService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Obtener el ID de la URL

    if (id) {
      this.miApiService.getTrabajadorById(id).subscribe((trabajador) => {
        if (trabajador) {
          console.log(trabajador);
          this.trabajadorForm.reset(trabajador); // Rellena el formulario con los datos del trabajador
        } else {
          console.error('Trabajador no encontrado.');
          this.router.navigate(['/miapi/list']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.trabajadorForm.valid) {
      const trabajadorActualizado = this.trabajadorForm.value as Trabajador;

      console.log('Trabajador a actualizar:', trabajadorActualizado);

      this.miApiService.updateTrabajador(trabajadorActualizado).subscribe({
        next: () => {
          console.log('Trabajador actualizado con éxito');
          this.router.navigate(['/miapi/list']);
        },
        error: (err) => {
          console.error('Error al actualizar el trabajador:', err);
        },
      });
    } else {
      console.error('Formulario inválido:', this.trabajadorForm);
    }
  }
}
