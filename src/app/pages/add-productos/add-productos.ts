import { Component, inject } from '@angular/core';
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
export class AddProductos{
onFileSelected($event: Event) {
throw new Error('Method not implemented.');
}
  myForm: FormGroup;

  private firestoreService = inject(FirestoreService);

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.myForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      stock: ['', [Validators.required]],
    });
  }


  goBack() {
    this.router.navigate(['/productos']);
  }

  async guardar() {
    if (this.myForm.valid) {
      await this.firestoreService.add('productos', this.myForm.value);
      alert('Producto agregado correctamente')
      this.myForm.reset();
    }else{
      alert('Formulario vacio')
    }
  }
}
