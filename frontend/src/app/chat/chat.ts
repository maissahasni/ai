import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from 'src/app/services/gpt';
import { ComponentsModule } from "src/app/components.module";
import { FrontHeader } from '../front-header/front-header';
// FIX 1: Change service import from GptService to GeminiService

@Component({
  selector: 'app-chat',
  standalone: true, // Assuming a modern standalone component
  imports: [CommonModule, FormsModule, ComponentsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss']
})
export class Chat {
 userInput: string = '';
     response: string = '';

     // FIX 2: Change service injection from gptService to geminiService
     constructor(private geminiService: GeminiService) {}

     sendPrompt(): void {
        // Add a loading message
        this.response = 'Generating response...';

        // FIX 3: Call the new service method
       this.geminiService.generateResponse(this.userInput).subscribe({
         // FIX 4: The service now returns a direct string, so simplify parsing
         next: (textResponse) => {
           this.response = textResponse.trim();
         },
         error: (error) => {
           console.error('Error:', error);
           this.response = 'Something went wrong. Please try again.';
         }
       });
     }
}