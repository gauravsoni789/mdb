import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingStateComponent } from './loading-state.component';
import { By } from '@angular/platform-browser';

describe('LoadingStateComponent', () => {
  let component: LoadingStateComponent;
  let fixture: ComponentFixture<LoadingStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the spinner div', () => {
    const spinner = fixture.debugElement.query(By.css('div.w-12.h-12'));
    expect(spinner).toBeTruthy();
  });

  it('should display the loading text', () => {
    const text = fixture.debugElement.query(By.css('p')).nativeElement.textContent;
    expect(text).toContain('Please wait');
  });
});
