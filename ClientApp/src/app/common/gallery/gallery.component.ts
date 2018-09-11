import { Component, OnInit } from '@angular/core';
import { UserService } from '../../common/services/user.service';
import { User } from '../../common/models/user';
import { AzureToolkitService } from '../../common/services/azureToolkit.service';
import { SavedImage } from '../../common/models/savedImage';
import { SettingsResponse, SettingsRequest } from '../models/settingsResponse';

@Component({
    selector: 'gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
    user: User;
    savedImages: SavedImage[] | null = null;
    searchResults: SavedImage[] | null;

    constructor(
        private userService: UserService, 
        private azureToolkitService: AzureToolkitService) { }

    search(searchTerm: string) {
        this.searchResults = null;
   
        this.azureToolkitService.searchImage(this.user.userId, searchTerm).subscribe(result => {
            this.searchResults = result;
        });
    }

    ngOnInit(): void {
        this.userService.getUser().subscribe(user => {
            this.user = user;
   
            this.azureToolkitService.getImages(this.user.userId).subscribe(images => {
                this.savedImages = images;
            })
        });
    }
}