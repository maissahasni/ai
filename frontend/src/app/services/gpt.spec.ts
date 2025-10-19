import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GeminiService } from './gpt';
import { Chat } from '../components/chat/chat';

describe('Chat', () => {
  let component: Chat;
  let fixture: ComponentFixture<Chat>;
  let mockGeminiService: jasmine.SpyObj<GeminiService>;

  beforeEach(async () => {
    // 1. Create a mock for the new service
    mockGeminiService = jasmine.createSpyObj('GeminiService', ['generateResponse']);
    
    await TestBed.configureTestingModule({
      imports: [Chat],
      // 2. Provide the mock service
      providers: [
        { provide: GeminiService, useValue: mockGeminiService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chat);
    component = fixture.componentInstance;
    
    // Set up a default mock response
    mockGeminiService.generateResponse.and.returnValue(of('Mock AI Response.'));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call generateResponse and set the response', () => {
    component.userInput = 'Hello, AI';
    component.sendPrompt();
    
    expect(mockGeminiService.generateResponse).toHaveBeenCalledWith('Hello, AI');
    
    // The response is set synchronously after the observable completes
    expect(component.response).toBe('Mock AI Response.');
  });
});