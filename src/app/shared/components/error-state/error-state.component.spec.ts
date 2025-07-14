import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorStateComponent } from './error-state.component';
import { By } from '@angular/platform-browser';

describe('ErrorStateComponent', () => {
  let component: ErrorStateComponent;
  let fixture: ComponentFixture<ErrorStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorStateComponent], // ✅ Standalone
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the default message', () => {
    const text = fixture.debugElement.query(By.css('p')).nativeElement.textContent;
    expect(text).toContain('Something went wrong.');
  });

  it('should display a custom message', () => {
    component.message = 'Custom error message.';
    fixture.detectChanges();
    const text = fixture.debugElement.query(By.css('p')).nativeElement.textContent;
    expect(text).toContain('Custom error message.');
  });

  it('should emit retry when button is clicked', () => {
    spyOn(component.retry, 'emit');
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();
    expect(component.retry.emit).toHaveBeenCalled();
  });
});
