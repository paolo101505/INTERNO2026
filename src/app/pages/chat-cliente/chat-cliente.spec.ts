import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatCliente } from './chat-cliente';

describe('ChatCliente', () => {
  let component: ChatCliente;
  let fixture: ComponentFixture<ChatCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatCliente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
