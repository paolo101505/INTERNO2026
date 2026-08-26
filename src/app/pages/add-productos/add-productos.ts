import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-productos',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-productos.html',
  styleUrl: './add-productos.css',
})
export class AddProductos {
  myForm: FormGroup;

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  subiendo = false;

  private firestoreService = inject(FirestoreService);
  private cdr = inject(ChangeDetectorRef);

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.myForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      categoria: ['plantas', [Validators.required]],
      precio: ['', [Validators.required]],
      stock: ['', [Validators.required]],
      tiempoReposicion: [''],
      descripcion: [''],
    });
  }

  goBack() {
    this.router.navigate(['/productos']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result; // esto YA es el base64 que vamos a guardar
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async guardar() {
    if (!this.myForm.valid) {
      alert('Formulario vacio');
      return;
    }

    if (!this.previewUrl) {
      alert('Selecciona una fotografía para el producto');
      return;
    }

    this.subiendo = true;
    this.cdr.detectChanges();

    try {
      await this.firestoreService.add('productos', {
        ...this.myForm.value,
        fotoUrl: this.previewUrl,
      });

      alert('Producto agregado correctamente');
      this.myForm.reset({ categoria: 'plantas' });
      this.selectedFile = null;
      this.previewUrl = null;
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al guardar el producto');
    } finally {
      this.subiendo = false;
      this.cdr.detectChanges();
    }
  }
}