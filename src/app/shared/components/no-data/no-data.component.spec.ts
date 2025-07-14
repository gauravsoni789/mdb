import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoDataComponent } from './no-data.component';
import { By } from '@angular/platform-browser';

describe('NoDataComponent', () => {
  let component: NoDataComponent;
  let fixture: ComponentFixture<NoDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoDataComponent], 
    }).compileComponents();

    fixture = TestBed.createComponent(NoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the default message', () => {
    const text = fixture.debugElement.query(By.css('h2')).nativeElement.textContent;
    expect(text).toContain('No data found.');
  });

  it('should display a custom message if provided', () => {
    component.message = 'Nothing here yet!';
    fixture.detectChanges();
    const text = fixture.debugElement.query(By.css('h2')).nativeElement.textContent;
    expect(text).toContain('Nothing here yet!');
  });
});
