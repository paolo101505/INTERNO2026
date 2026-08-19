import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductos } from './add-productos';

describe('AddProductos', () => {
  let component: AddProductos;
  let fixture: ComponentFixture<AddProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
