import { Component, OnInit } from '@angular/core';
import { CognitiveService } from '../common/services/cognitive.service';
import { AzureToolkitService } from '../common/services/azureToolkit.service';
import { ImageResult } from '../common/models/bingSearchResponse';
import { ComputerVisionRequest, ComputerVisionResponse } from '../common/models/computerVisionResponse';
import { SettingsResponse, SettingsRequest } from '../common/models/settingsResponse';
import { ImagePostRequest } from '../common/models/imagePostRequest';
import { UserService } from '../common/services/user.service';
import { User } from '../common/models/user';
import { isUndefined } from 'util';

@Component({
    selector: 'search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
    bingSearchApiKey: string | null = null;
    computerVisionAPIKey: string | null = null;
    searchResults: ImageResult[] | null;
    isSearching = false;
    user: User;

    currentAnalytics: ComputerVisionResponse | null;
    currentItem: ImageResult;
    currentItemSaved: boolean;
    isAnalyzing = false;

    constructor(
        private cognitiveService: CognitiveService,
        private azureToolkitService: AzureToolkitService,
        private userService: UserService) { }

    search(searchTerm: string) {
        this.searchResults = null;
        this.currentAnalytics = null;
        this.isSearching = true;
        this.cognitiveService.searchImages(this.bingSearchApiKey, searchTerm).subscribe(result => {
            this.searchResults = result.value;
            this.isSearching = false;
        });
    }

    analyze(result: ImageResult) {
        this.currentItem = result;
        this.currentItemSaved = false;
        this.currentAnalytics = null;
        this.isAnalyzing = true;
        this.cognitiveService
        .analyzeImage(
            this.computerVisionAPIKey,
            { url: result.thumbnailUrl } as ComputerVisionRequest)
        .subscribe(cvResponse => {
            this.currentAnalytics = cvResponse;
            this.isAnalyzing = false;
        });
        window.scroll(0, 0);
    }

    saveImage() {
        let userId = '';
        if (!isUndefined(this.user)) {
            userId = this.user.userId;
        }
        const request: ImagePostRequest = {
             userId: userId,
             url: this.currentItem.thumbnailUrl,
             encodingFormat: this.currentItem.encodingFormat,
             id: this.currentItem.imageId,
             description: this.currentAnalytics.description.captions[0].text,
             tags: this.currentAnalytics.tags.map(tag => tag.name)
        };
        this.azureToolkitService.saveImage(request).subscribe(saveSuccessful => {
            this.currentItemSaved = saveSuccessful;
        });
    }

    ngOnInit(): void {
        this.azureToolkitService
            .getSettings({ token: '' } as SettingsRequest)
            .subscribe(response => {
                this.bingSearchApiKey = response.bingSearchApiKey;
                this.computerVisionAPIKey = response.computerVisionAPIKey;
            });
        this.userService.getUser().subscribe(user => this.user = user );
    }
}
