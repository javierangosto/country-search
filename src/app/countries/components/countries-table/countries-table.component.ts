import { Component, Input, input } from '@angular/core';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'countries-table',
  templateUrl: './countries-table.component.html',
  styles: [
    `
    img {
      width: 25px;
    }
    `
  ]
})
export class CountriesTableComponent {
  @Input()
  public countries: Country[] = [];
}
