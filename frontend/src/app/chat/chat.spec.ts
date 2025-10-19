import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chat } from './chat';
// FIX 1: Import the new service
import { of } from 'rxjs'; // For mocking the observable return value
import { GeminiService } from 'src/app/services/gpt';

describe('Chat', () => {
  let component: Chat;
  let fixture: ComponentFixture<Chat>;
  // FIX 2: Create a spy object for the new service
  let mockGeminiService: jasmine.SpyObj<GeminiService>;

  beforeEach(async () => {
    // Create the mock service and define a mock return value
    mockGeminiService = jasmine.createSpyObj('GeminiService', ['generateResponse']);
    mockGeminiService.generateResponse.and.returnValue(of('Mock response from Gemini.'));

    await TestBed.configureTestingModule({
      imports: [Chat],
      // FIX 3: Provide the mock service
      providers: [
        { provide: GeminiService, useValue: mockGeminiService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call generateResponse and update the response', () => {
    component.userInput = 'Test prompt';
    component.sendPrompt();
    
    // Check if the service was called
    expect(mockGeminiService.generateResponse).toHaveBeenCalledWith('Test prompt');
    
    // Check if the response was updated correctly
    expect(component.response).toBe('Mock response from Gemini.');
  });
});