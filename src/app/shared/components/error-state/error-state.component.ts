import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  imports: [],
  templateUrl: './error-state.component.html',
  styleUrl: './error-state.component.scss'
})
export class ErrorStateComponent {
  @Input() message: string = 'Something went wrong.';
  @Output() retry: EventEmitter<void>  = new EventEmitter<void>();
}
