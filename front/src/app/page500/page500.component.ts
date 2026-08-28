import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-page500',
  standalone: true,
  imports: [MatIcon, MatButton, RouterLink],
  templateUrl: './page500.component.html',
  styleUrl: './page500.component.css'
})
export class Page500Component {

}
