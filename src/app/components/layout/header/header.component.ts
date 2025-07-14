import { Component } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { SearchComponent } from '../../search/search.component';

@Component({
  selector: 'app-header',
  imports: [Menubar, ButtonModule, CommonModule, RouterLink, Popover, SearchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
}
