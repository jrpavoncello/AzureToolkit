import { Component, OnInit } from '@angular/core';
import { DateService } from '../date/date.service';
import { UserService } from '../common/services/user.service';
import { User } from '../common/models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  user: User;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => this.user = user );
  }
}
