import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-data',
  imports: [],
  templateUrl: './no-data.component.html',
  styleUrl: './no-data.component.scss'
})
export class NoDataComponent {
   @Input() message: string = 'No data found.';
}
