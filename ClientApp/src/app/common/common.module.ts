import { NgModule } from '@angular/core';
import { CognitiveService } from './services/cognitive.service';
import { UserService } from './services/user.service';
import { AzureToolkitService } from './services/azureToolkit.service';
import { AzureHttpClient } from './services/azureHttpClient';

@NgModule({
    providers: [AzureHttpClient, CognitiveService, UserService, AzureToolkitService]
})
export class CommonModule { }
