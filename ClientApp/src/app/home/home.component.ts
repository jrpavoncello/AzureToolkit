import { Component, OnInit } from '@angular/core';
import { DateService } from '../date/date.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(private dateService: DateService){
  }

  ngOnInit(): void {
    var currentDate = this.dateService.getCurrentDate();
  }
}
