import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  imports: [],
  templateUrl: './error-state.component.html',
  styleUrl: './error-state.component.scss'
})
export class ErrorStateComponent {
  @Input() public message: string = 'Something went wrong.';
  @Output() public retry: EventEmitter<void>  = new EventEmitter<void>();
}
